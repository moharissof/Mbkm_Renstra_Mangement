/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface ProgressChartProps {
  programId: string
}

export default function ProgressChart({ programId }: ProgressChartProps) {
  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const abortController = new AbortController()
    
    async function fetchReports() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || ''
        const res = await fetch(`${baseUrl}/api/reports?programId=${programId}`, {
          signal: abortController.signal
        })
        
        if (!res.ok) {
          throw new Error("Gagal mengambil laporan")
        }
        
        const data = await res.json()
        setReports(data)
      } catch (error) {
        if (!abortController.signal.aborted) {
          console.error("Error saat mengambil laporan:", error)
        }
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false)
        }
      }
    }

    fetchReports()

    return () => {
      abortController.abort()
    }
  }, [programId])

  if (loading) {
    return <div className="h-80 flex items-center justify-center">Memuat data progres...</div>
  }

  if (!reports || reports.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="mt-4 text-lg font-medium">Tidak ada data progres</h3>
        <p className="text-muted-foreground mt-2">Data progres akan muncul di sini setelah laporan dikirimkan.</p>
      </div>
    )
  }

  const chartData = reports.map((report) => ({
    date: new Date(report.created_at).toLocaleDateString(),
    progress: report.realisasi,
  }))

  const latestProgress = reports.length > 0 ? reports[0].realisasi : 0

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Progres Saat Ini</CardTitle>
          <CardDescription>Progres terakhir yang dilaporkan untuk program ini</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Penyelesaian</span>
              <span className="text-sm font-medium">{latestProgress}%</span>
            </div>
            <Progress value={latestProgress} className="h-4" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Progres dari Waktu ke Waktu</CardTitle>
          <CardDescription>Perkembangan program berdasarkan laporan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="progress" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}