/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState, useEffect, useRef } from "react"
import { DashboardLayout } from "@/components/dashboard/_layout"
import { DataTableCard } from "@/components/data-table/card-table"
import { createUserColumns } from "./_component/column"
import { Button } from "@/components/ui/button"
import { PlusCircle, RefreshCw, UserPlus } from "lucide-react"
import { type User, type Jabatan, Role, Bidang } from "@/types/user"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { VerifyUserDialog } from "./_component/verify-user"
import { useToast } from "@/hooks/use-toast"

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [jabatan, setJabatan] = useState<Jabatan[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalUsers, setTotalUsers] = useState(0)
  const [filters, setFilters] = useState({
    role: null as string | null,
    bidang: null as string | null,
    jabatan: null as string | null,
  })

  // Verification dialog state
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const { toast } = useToast()

  // Track if component is mounted
  const isMounted = useRef(false)

  const fetchJabatan = async () => {
    try {
      const response = await fetch("/api/jabatan")

      if (!response.ok) {
        throw new Error("Failed to fetch jabatan")
      }

      const data = await response.json()
      setJabatan(data)
    } catch (err) {
      console.error("Error fetching jabatan:", err)
      toast({
        title: "Error",
        description: "Gagal mengambil data jabatan",
        variant: "destructive",
      })
    }
  }

  const fetchUsers = async () => {
    // Don't fetch if already loading
    if (loading) return

    setLoading(true)
    setError(null)

    try {
      const queryParams = new URLSearchParams()

      if (filters.role) {
        queryParams.append("role", filters.role)
      }

      if (filters.bidang) {
        queryParams.append("bidang", filters.bidang)
      }

      if (filters.jabatan) {
        queryParams.append("jabatan_id", filters.jabatan)
      }

      const response = await fetch(`/api/users?${queryParams.toString()}`)

      if (!response.ok) {
        throw new Error("Failed to fetch users")
      }

      const data = await response.json()

      if (isMounted.current) {
        setUsers(data.users)
        setTotalUsers(data.total)
      }
    } catch (err) {
      if (isMounted.current) {
        setError(err instanceof Error ? err.message : "An error occurred")
        console.error(err)
        toast({
          title: "Error",
          description: "Gagal mengambil data pengguna",
          variant: "destructive",
        })
      }
    } finally {
      if (isMounted.current) {
        setLoading(false)
      }
    }
  }

  const handleVerifyUser = (user: User) => {
    setSelectedUser(user)
    setVerifyDialogOpen(true)
  }

  const handleVerifySubmit = async (jabatanId: string) => {
    if (!selectedUser) return

    try {
      const response = await fetch(`/api/users/${selectedUser.id}/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jabatan_id: jabatanId,
        }),
      })

      let errorData

      // Check if response is ok before trying to parse JSON
      if (!response.ok) {
        try {
          errorData = await response.json()
          throw new Error(errorData.error || "Failed to verify user")
        } catch (jsonError) {
          // If JSON parsing fails, use status text
          throw new Error(`Server error: ${response.status} ${response.statusText}`)
        }
      }

      // Only try to parse JSON if we know the response is OK
      const data = await response.json()

      // Refresh the user list
      fetchUsers()
      toast({
        title: "Berhasil",
        description: `Pengguna ${selectedUser.name} telah diverifikasi`,
        variant: "success",
      })
    } catch (error) {
      console.error("Error verifying user:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to verify user",
        variant: "destructive",
      })
      throw error
    }
  }

  useEffect(() => {
    isMounted.current = true

    // Initial data fetch
    fetchJabatan()
    fetchUsers()

    return () => {
      isMounted.current = false
    }
  }, [])

  // Only fetch when filters change
  useEffect(() => {
    if (isMounted.current) {
      fetchUsers()
    }
  }, [filters])

  const handleRoleFilterChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      role: value === "all" ? null : value,
    }))
  }

  const handleBidangFilterChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      bidang: value === "all" ? null : value,
    }))
  }

  const handleJabatanFilterChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      jabatan: value === "all" ? null : value,
    }))
  }

  // Create columns with the verify action
  const userColumns = createUserColumns(handleVerifyUser)

  // Count users by role
  const adminCount = users.filter((user) => user.jabatan?.role === Role.Admin).length
  const pimpinanCount = users.filter((user) =>
    [Role.Ketua, Role.Waket_1, Role.Waket_2].includes(user.jabatan?.role as Role),
  ).length
  const kabagCount = users.filter((user) => user.jabatan?.role === Role.Kabag).length
  const staffCount = users.filter((user) => user.jabatan?.role === Role.Staff_Kabag).length

  // Count verified and unverified users
  const verifiedCount = users.filter((user) => user.isVerified).length
  const unverifiedCount = users.filter((user) => !user.isVerified).length

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Pengguna</h1>
            <p className="text-gray-500 mt-1">Kelola pengguna sistem dan hak akses mereka</p>
          </div>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" /> Tambah Pengguna
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-sm text-gray-500">Total Pengguna</div>
            <div className="text-2xl font-bold mt-1">{totalUsers}</div>
            <div className="flex justify-between mt-1 text-xs">
              <span className="text-green-500">{verifiedCount} Terverifikasi</span>
              <span className="text-orange-500">{unverifiedCount} Belum Verifikasi</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-sm text-gray-500">Admin</div>
            <div className="text-2xl font-bold mt-1">{adminCount}</div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-sm text-gray-500">Pimpinan</div>
            <div className="text-2xl font-bold mt-1">{pimpinanCount}</div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-sm text-gray-500">Kabag & Staff</div>
            <div className="text-2xl font-bold mt-1">{kabagCount + staffCount}</div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 mb-4">
          <Select value={filters.role || "all"} onValueChange={handleRoleFilterChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Role</SelectItem>
              <SelectItem value={Role.Admin}>Admin</SelectItem>
              <SelectItem value={Role.Ketua}>Ketua</SelectItem>
              <SelectItem value={Role.Waket_1}>Wakil Ketua 1</SelectItem>
              <SelectItem value={Role.Waket_2}>Wakil Ketua 2</SelectItem>
              <SelectItem value={Role.Kabag}>Kepala Bagian</SelectItem>
              <SelectItem value={Role.Staff_Kabag}>Staff Kabag</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.bidang || "all"} onValueChange={handleBidangFilterChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by bidang" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Bidang</SelectItem>
              <SelectItem value={Bidang.SEMUA_BIDANG}>Semua Bidang</SelectItem>
              <SelectItem value={Bidang.BIDANG_1}>Bidang 1</SelectItem>
              <SelectItem value={Bidang.BIDANG_2}>Bidang 2</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.jabatan || "all"} onValueChange={handleJabatanFilterChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by jabatan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Jabatan</SelectItem>
              {jabatan.map((item) => (
                <SelectItem key={item.id.toString()} value={item.id.toString()}>
                  {item.nama}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" onClick={fetchUsers}>
            <RefreshCw className="mr-2 h-4 w-4" /> Refresh
          </Button>
        </div>

        {error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg">Error: {error}. Silakan coba lagi.</div>
        ) : (
          <DataTableCard
            columns={userColumns}
            data={users}
            title="Manajemen Pengguna"
            description="Kelola pengguna sistem, role, dan jabatan mereka."
            searchColumn="name"
            searchPlaceholder="Cari pengguna..."
            extraActions={
              <Button size="sm" className="h-10">
                <PlusCircle className="mr-2 h-4 w-4" /> Pengguna Baru
              </Button>
            }
          />
        )}
      </div>

      {/* Verification Dialog */}
      {selectedUser && (
        <VerifyUserDialog
          isOpen={verifyDialogOpen}
          onClose={() => setVerifyDialogOpen(false)}
          onVerify={handleVerifySubmit}
          user={selectedUser}
          jabatan={jabatan}
        />
      )}
    </DashboardLayout>
  )
}


