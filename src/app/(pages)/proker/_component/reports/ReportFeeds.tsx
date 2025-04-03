/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { Suspense, useEffect, useState } from "react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { id } from "date-fns/locale"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { FileText, ExternalLink } from "lucide-react"
import CommentForm from "./CommentForm"
import CommentList from "./CommentList"


interface ReportsFeedProps {
  programId: string
  userId: string
  isSupervisor: boolean
}

async function getReports(programId: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || ''
    const res = await fetch(`${baseUrl}/api/reports?programId=${programId}`, {
      cache: "no-store",
    })

    if (!res.ok) {
      throw new Error("Gagal mengambil laporan")
    }

    return res.json()
  } catch (error) {
    console.error("Error saat mengambil laporan:", error)
    return []
  }
}

export default function ReportsFeed({ programId, userId, isSupervisor }: ReportsFeedProps) {
  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const abortController = new AbortController()

    async function loadReports() {
      try {
        const data = await getReports(programId)
        if (!abortController.signal.aborted) {
          setReports(data)
        }
      } catch (error) {
        if (!abortController.signal.aborted) {
          console.error("Error saat memuat laporan:", error)
        }
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadReports()

    return () => {
      abortController.abort()
    }
  }, [programId])

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-muted rounded-lg h-40 animate-pulse" />
        ))}
      </div>
    )
  }

  if (!reports || reports.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-medium">Belum ada laporan</h3>
        <p className="text-muted-foreground mt-2">
          {isSupervisor ? "Belum ada laporan untuk program ini." : "Mulailah dengan membuat laporan pertama Anda di atas."}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {reports.map((report: any) => (
        <ReportCard key={report.id} report={report} userId={userId} isSupervisor={isSupervisor} />
      ))}
    </div>
  )
}

function ReportCard({ report, userId, isSupervisor }: { report: any; userId: string; isSupervisor: boolean }) {
  const createdAt = new Date(report.created_at)
  const timeAgo = formatDistanceToNow(createdAt, { 
    addSuffix: true,
    locale: id
  })
  const canComment = isSupervisor || userId === report.user_id

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={report.users?.photo || ""} alt={report.users?.name || "Pengguna"} />
              <AvatarFallback>{report.users?.name?.charAt(0) || "P"}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{report.users?.name || "Pengguna Tidak Dikenal"}</p>
              <p className="text-xs text-muted-foreground">{timeAgo}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-full">
              {report.realisasi}% Realisasi
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <div className="space-y-4">
          <p className="whitespace-pre-line text-sm">{report.laporan}</p>
          {report.realisasi > 0 && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Progress</span>
                <span>{report.realisasi}%</span>
              </div>
              <Progress value={report.realisasi} className="h-2" />
            </div>
          )}

          {report.link_file && (
            <div className="mt-4">
              <Link
                href={report.link_file}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <FileText className="h-4 w-4" />
                Lihat dokumen terlampir
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          )}
        </div>
      </CardContent>

      <Separator />

      <Suspense fallback={<div className="p-4 text-center text-sm text-muted-foreground">Memuat komentar...</div>}>
        <CommentList reportId={report.id} />
      </Suspense>

      {canComment && (
        <CardFooter className="pt-3">
          <CommentForm programId={report.program_kerja_id} userId={userId} reportId={report.id} />
        </CardFooter>
      )}
    </Card>
  )
}