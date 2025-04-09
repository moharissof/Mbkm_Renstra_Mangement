/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import { DataTableCard } from "@/components/DataTable/CardTable"
import { staffColumns, type StaffPerformance } from "./_component/Column"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Role } from "@/types/user"
import { Loader2 } from "lucide-react"
import { DashboardLayout } from "@/components/Dashboard/layout"

export default function StaffPerformancePage() {
  const [staffData, setStaffData] = useState<StaffPerformance[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/auth/user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        })
        const { user: userData } = await response.json()
        console.log("userData", userData)
        setUser(userData)
      } catch (error) {
        console.error("Error fetching user data:", error)
      }
    }

    fetchUser()
  }, [])

  useEffect(() => {
    const fetchStaffData = async () => {
      if (!user?.id) return

      try {
        setLoading(true)
        // Use the user's ID to fetch their subordinates
        const scope = user?.jabatan?.role === Role.Kabag ? "jabatan" : "bidang"

        // Fetch directly from the struktural API
        const response = await fetch(`/api/struktur?user_id=${user.id}&scope=${scope}`)

        if (!response.ok) {
          throw new Error("Gagal mengambil data kinerja staf")
        }

        const responseData = await response.json()

        // Check if we have the expected data structure with data property
        if (responseData && responseData.data && Array.isArray(responseData.data)) {
          // Transform the data to match the StaffPerformance type
          const transformedData = responseData.data.map((subordinate : any) => {
            // Determine status based on last login
            let status: "active" | "inactive" | "on_leave" = "active"
            if (!subordinate.lastLogin) {
              status = "inactive"
            } else {
              try {
                const lastLogin = new Date(subordinate.lastLogin)
                const daysSinceLogin = (Date.now() - lastLogin.getTime()) / (1000 * 60 * 60 * 24)
                if (daysSinceLogin > 14) status = "inactive"
                else if (daysSinceLogin > 7) status = "on_leave"
              } catch (e) {
                status = "inactive"
              }
            }

            // Use the stats from the API
            const stats = subordinate.stats || {}

            return {
              id: subordinate.id,
              name: subordinate.name,
              email: subordinate.email || `${subordinate.name.toLowerCase().replace(/\s+/g, ".")}@example.com`,
              avatar: subordinate.avatar || `/placeholder.svg?height=40&width=40`,
              position: subordinate.position || "Staf",
              department: subordinate.department || "Umum",
              lastLogin: subordinate.lastLogin || new Date().toISOString(),
              completionRate: stats.completion_rate || 0,
              onTimeRate: Math.floor(Math.random() * 30) + 70, // Still random as not provided by API
              qualityScore: Math.floor(Math.random() * 40) + 60, // Still random as not provided by API
              responseTime: Math.floor(Math.random() * 24) + 1, // Still random as not provided by API
              activePrograms: stats.active_programs || 0,
              completedPrograms: stats.programs_completed || 0,
              totalPrograms: stats.total_programs || 0,
              status: status,
            }
          })

          setStaffData(transformedData)
        } else {
          console.error("API tidak mengembalikan format data yang diharapkan:", responseData)
          setStaffData([])
          toast({
            title: "Error",
            description: "Format data dari server tidak valid.",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error mengambil data staf:", error)
        toast({
          title: "Error",
          description: "Gagal memuat data kinerja staf. Silakan coba lagi.",
          variant: "destructive",
        })
        setStaffData([])
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchStaffData()
    }
  }, [user])

  // Calculate summary statistics
  const totalStaff = Array.isArray(staffData) ? staffData.length : 0
  const activeStaff = Array.isArray(staffData) ? staffData.filter((s) => s.status === "active").length : 0
  const avgCompletionRate =
    Array.isArray(staffData) && staffData.length > 0
      ? Math.round(staffData.reduce((acc, staff) => acc + staff.completionRate, 0) / staffData.length)
      : 0
  const totalActivePrograms = Array.isArray(staffData)
    ? staffData.reduce((acc, staff) => acc + staff.activePrograms, 0)
    : 0
  const totalPrograms = Array.isArray(staffData) ? staffData.reduce((acc, staff) => acc + staff.totalPrograms, 0) : 0

  // Determine title based on user role
  const getTitle = () => {
    if (!user?.jabatan?.role) return "Kinerja Staf"

    switch (user.jabatan.role) {
      case Role.Waket_1:
      case Role.Waket_2:
        return "Kinerja Staf Departemen"
      case Role.Kabag:
        return "Kinerja Staf Tim"
      default:
        return "Kinerja Staf"
    }
  }

  // Determine description based on user role
  const getDescription = () => {
    if (!user?.jabatan?.role) return "Pantau kinerja staf, waktu login terakhir, dan tingkat penyelesaian program."

    switch (user.jabatan.role) {
      case Role.Waket_1:
      case Role.Waket_2:
        return "Pantau kinerja semua staf di departemen Anda, waktu login terakhir, dan tingkat penyelesaian program."
      case Role.Kabag:
        return "Pantau kinerja anggota tim Anda, waktu login terakhir, dan tingkat penyelesaian program."
      default:
        return "Pantau kinerja staf, waktu login terakhir, dan tingkat penyelesaian program."
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <div className="flex flex-col space-y-4">
          <h2 className="text-2xl font-bold tracking-tight">Dashboard Kinerja Staf</h2>
          <p className="text-muted-foreground">
            Pantau kinerja staf, lacak kemajuan program, dan analisis metrik produktivitas.
          </p>
        </div>

        <div className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Staf</CardTitle>
                <CardDescription>Semua anggota staf</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : totalStaff}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{loading ? "" : `${activeStaff} staf aktif`}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Rata-rata Tingkat Penyelesaian</CardTitle>
                <CardDescription>Persentase penyelesaian program</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : `${avgCompletionRate}%`}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{loading ? "" : "Berdasarkan semua program"}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Program Aktif</CardTitle>
                <CardDescription>Program yang sedang berjalan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : totalActivePrograms}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {loading ? "" : `Dari total ${totalPrograms} program`}
                </p>
              </CardContent>
            </Card>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <DataTableCard
              columns={staffColumns}
              data={staffData}
              title={getTitle()}
              description={getDescription()}
              searchColumn="name"
              pageSize={10}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

