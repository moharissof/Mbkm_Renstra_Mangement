'use client'

import { Suspense, useEffect, useState } from "react"
import { notFound, useParams } from "next/navigation"
import ReportsFeed from "../../_component/reports/ReportFeeds"
import ReportFormSkeleton from "../../_component/reports/ReportSkeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, BarChart, ChevronLeft, CheckCircle } from "lucide-react"
import ReportForm from "../../_component/reports/ReportForm"
import ProgressChart from "../../_component/reports/Progress"
import { User } from "@/types/user"
import { ProgramKerja } from "@/types/proker"
import { PageLoader } from "@/components/ui/loader"
import { DashboardLayout } from "@/components/Dashboard/layout"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button"
import Link from 'next/link';
import { Badge } from "@/components/ui/badge"

async function getProgramKerja(id: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || ''
    const res = await fetch(`${baseUrl}/api/proker/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      if (res.status === 404) {
        return null;
      }
      throw new Error("Gagal mengambil data program kerja");
    }

    return res.json();
  } catch (error) {
    console.error("Error saat mengambil program kerja:", error);
    throw error;
  }
}

export default function ProgramReportsPage() {
  const params = useParams()
  const id = Array.isArray(params.id) ? params.id[0] : params.id
  
  if (!id) {
    return notFound()
  }

  return (
    <Suspense fallback={<PageLoader />}>
      <ProgramReportsContent id={id} />
    </Suspense>
  )
}

function ProgramReportsContent({ id }: { id: string }) {
  const [user, setUser] = useState<User | null>(null)
  const [programKerja, setProgramKerja] = useState<ProgramKerja | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const abortController = new AbortController()

    const fetchData = async () => {
      try {
        // Ambil data user
        const userResponse = await fetch("/api/auth/user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          signal: abortController.signal
        })
        
        if (!userResponse.ok) {
          throw new Error("Gagal mengambil data user")
        }
        
        const { user: userData } = await userResponse.json()
        
        // Ambil data program kerja
        const programData = await getProgramKerja(id)
        
        if (!abortController.signal.aborted) {
          setUser(userData)
          setProgramKerja(programData)
        }
      } catch (error) {
        if (!abortController.signal.aborted) {
          console.error("Error saat mengambil data:", error)
        }
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      abortController.abort()
    }
  }, [id])

  if (loading) {
    return <PageLoader />
  }

  if (!user || !programKerja) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg">
          <div className="text-center">
            <h3 className="text-lg font-medium mb-2">Tidak ada data</h3>
            <p className="text-muted-foreground">
              Tidak ada program kerja yang ditemukan dengan filter yang dipilih.
            </p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const isInProgress = programKerja.status === "On_Progress"
  const isAssigned = programKerja.user_id === user.id
  const isSupervisor = ["Kabag", "Waket_1", "Waket_2", "Ketua"].includes(user.jabatan?.role || "")
  const isCompleted = programKerja.progress === 100
  const isDone = programKerja.status === "Done"

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  href="/dashboard"
                  className="text-sm hover:text-primary"
                >
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink
                  href={`/proker/${programKerja.id}`}
                  className="text-sm hover:text-primary"
                >
                  Program Kerja
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink className="text-sm font-medium text-primary">
                  Laporan
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <Link href={`/proker/${programKerja.id}`}>
            <Button variant="outline" size="sm" className="gap-1">
              <ChevronLeft className="h-4 w-4" />
              <span>Kembali</span>
            </Button>
          </Link>
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Laporan Program</h1>
          <p className="text-muted-foreground">Lihat dan kelola laporan untuk {programKerja.nama}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Tabs defaultValue="reports" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="reports" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>Laporan</span>
                </TabsTrigger>
                <TabsTrigger value="progress" className="flex items-center gap-2">
                  <BarChart className="h-4 w-4" />
                  <span>Progres</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="reports" className="space-y-4 pt-4">
                {isDone ? (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6 flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-blue-800 font-medium">
                        Program ini telah selesai dan diverifikasi 
                      </p>
                    </div>
                  </div>
                ) : isInProgress && isAssigned && !isCompleted ? (
                  <Suspense fallback={<ReportFormSkeleton />}>
                    <div className="mb-6">
                      <ReportForm 
                        programId={id} 
                        userId={user.id} 
                        initialProgress={programKerja.progress || 0} 
                      />
                    </div>
                    <Separator className="my-6" />
                  </Suspense>
                ) : isCompleted && isAssigned ? (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-6">
                    <p className="text-green-800">
                      Program ini telah mencapai 100% progres. Tunggu verifikasi dari atasan.
                    </p>
                  </div>
                ) : null}

                <Suspense fallback={<ReportsFeedSkeleton />}>
                  <ReportsFeed programId={id} userId={user.id} isSupervisor={isSupervisor} />
                </Suspense>
              </TabsContent>

              <TabsContent value="progress" className="pt-4">
                <Suspense fallback={<ProgressChartSkeleton />}>
                  <ProgressChart programId={id} />
                </Suspense>
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Detail Program</CardTitle>
                <CardDescription>Informasi tentang program ini</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Nama</h3>
                  <p>{programKerja.nama}</p>
                </div>

                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Status</h3>
                  <div className="flex items-center gap-2">
                    <p>{programKerja.status}</p>
                    {isDone && (
                      <Badge variant="outline" className="border-blue-200 text-blue-700">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Selesai
                      </Badge>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Departemen</h3>
                  <p>{programKerja.point_renstra?.bidang?.nama || "Tidak tersedia"}</p>
                </div>

                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Jangka Waktu</h3>
                  <p>
                    {programKerja.waktu_mulai && programKerja.waktu_selesai
                      ? `${new Date(programKerja.waktu_mulai).toLocaleDateString()} - ${new Date(programKerja.waktu_selesai).toLocaleDateString()}`
                      : "Tidak ditentukan"}
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Progres</h3>
                  <p>{programKerja.progress || 0}%</p>
                </div>

              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Panduan Pelaporan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>• Laporkan progres secara berkala</p>
                <p>• Sertakan pencapaian dan tantangan spesifik</p>
                <p>• Unggah file atau dokumentasi terkait</p>
                <p>• Perbarui persentase realisasi</p>
                <p>• Tanggapi komentar dari Atasan</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

function ReportsFeedSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-muted rounded-lg h-40 animate-pulse" />
      ))}
    </div>
  )
}

function ProgressChartSkeleton() {
  return <div className="bg-muted rounded-lg h-80 animate-pulse" />
}