/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import { useState, useEffect, useCallback } from "react"
import { DashboardLayout } from "@/components/Dashboard/_layout"
import { DataTableCard } from "@/components/DataTable/CardTable"
import { createPeriodeRenstraColumns } from "./_component/Column"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import type { PeriodeRenstra } from "@/types/renstra"
import { useToast } from "@/hooks/use-toast"
import { PeriodeRenstraDialog } from "./_component/Modal"
import RoleGuard from "@/middleware/RoleGuard"
import { PageLoader, TableLoader } from "@/components/ui/loader"
import { Role } from "@/types/user"

export default function PeriodeRenstraPage() {
  const [periodeRenstraList, setPeriodeRenstraList] = useState<PeriodeRenstra[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedPeriodeRenstra, setSelectedPeriodeRenstra] = useState<PeriodeRenstra | null>(null)
  const [mode, setMode] = useState<"add" | "edit">("add")

  // Fetch data
  const fetchPeriodeRenstra = useCallback(async () => {
    try {
      const response = await fetch("/api/periode")
      if (!response.ok) {
        throw new Error("Failed to fetch periode renstra")
      }
      const data = await response.json()
      setPeriodeRenstraList(data)
    } catch (error) {
      console.error("Error fetching periode renstra:", error)
      toast({
        title: "Error",
        description: "Gagal mengambil data periode renstra",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPeriodeRenstra()
  }, [fetchPeriodeRenstra])

  // Handle add
  const handleAdd = () => {
    setSelectedPeriodeRenstra(null)
    setMode("add")
    setDialogOpen(true)
  }

  // Handle edit
  const handleEdit = (periodeRenstra: PeriodeRenstra) => {
    setSelectedPeriodeRenstra(periodeRenstra)
    setMode("edit")
    setDialogOpen(true)
  }

  // Handle delete
  const handleDelete = async (periodeRenstra: PeriodeRenstra) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus periode renstra "${periodeRenstra.nama}"?`)) {
      return
    }

    try {
      const response = await fetch(`/api/periode/${periodeRenstra.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete periode renstra")
      }

      toast({
        title: "Berhasil",
        description: `Periode renstra ${periodeRenstra.nama} telah dihapus`,
        variant: "success",
      })

      setPeriodeRenstraList((prev) => prev.filter((p) => p.id !== periodeRenstra.id))
    } catch (error) {
      console.error("Error deleting periode renstra:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete periode renstra",
        variant: "destructive",
      })
    }
  }

  // Handle save
  const handleSave = async (formData: Partial<PeriodeRenstra>) => {
    try {
      if (mode === "add") {
        const response = await fetch("/api/periode", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to create periode renstra")
        }

        const newPeriodeRenstra = await response.json()
        setPeriodeRenstraList((prev) => [...prev, newPeriodeRenstra])
      } else if (selectedPeriodeRenstra) {
        const response = await fetch(`/api/periode/${selectedPeriodeRenstra.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to update periode renstra")
        }

        const updatedPeriodeRenstra = await response.json()
        setPeriodeRenstraList((prev) =>
          prev.map((p) => (p.id === updatedPeriodeRenstra.id ? updatedPeriodeRenstra : p)),
        )
      }

      toast({
        title: "Berhasil",
        description: `Periode renstra ${formData.nama} telah disimpan`,
        variant: "success",
      })
      setDialogOpen(false)
    } catch (error) {
      console.error("Error saving periode renstra:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save periode renstra",
        variant: "destructive",
      })
    }
  }

  // Create columns
  const columns = createPeriodeRenstraColumns(handleEdit, handleDelete)

  return (
    <RoleGuard allowedRoles={[Role.Admin]}>
      {loading && periodeRenstraList.length === 0 ? (
        <DashboardLayout>
          <PageLoader />
        </DashboardLayout>
      ) : (
        <DashboardLayout>
          <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">Periode Renstra</h1>
                <p className="text-gray-500 mt-1">Kelola periode renstra dalam sistem</p>
              </div>
              <Button onClick={handleAdd}>
                <PlusCircle className="mr-2 h-4 w-4" /> Tambah Periode Renstra
              </Button>
            </div>

            {loading && periodeRenstraList.length > 0 ? (
              <TableLoader />
            ) : (
              <DataTableCard
                columns={columns}
                data={periodeRenstraList}
                title="Manajemen Periode Renstra"
                description="Kelola periode renstra dalam sistem."
                searchColumn="nama"
                searchPlaceholder="Cari periode renstra..."
                extraActions={
                  <Button size="sm" className="h-10" onClick={handleAdd}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Tambah Baru
                  </Button>
                }
              />
            )}
          </div>

          {/* Dialog for Add/Edit */}
          <PeriodeRenstraDialog
            isOpen={dialogOpen}
            onClose={() => setDialogOpen(false)}
            onSave={handleSave}
            periodeRenstra={selectedPeriodeRenstra}
            mode={mode}
          />
        </DashboardLayout>
      )}
    </RoleGuard>
  )
}

