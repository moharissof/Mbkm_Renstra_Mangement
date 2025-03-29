/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect, useRef } from "react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { DataTableCard } from "@/components/DataTable/CardTable";
import { createRenstraColumns } from "./_component/Column";
import { Button } from "@/components/ui/button";
import { Loader2, PlusCircle, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PageLoader, TableLoader } from "@/components/ui/loader";
import RoleGuard from "@/middleware/RoleGuard";
import { Role } from "@/types/user";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RenstraDialog } from "./_component/Modal";
import type { Renstra, PeriodeRenstra } from "@/types/renstra";
import { useRouter } from "next/navigation"

export default function RenstraPage() {
    const [renstraItems, setRenstraItems] = useState<Renstra[]>([])
    const [periodes, setPeriodes] = useState<PeriodeRenstra[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [totalItems, setTotalItems] = useState(0)
    const [selectedPeriode, setSelectedPeriode] = useState<string | null>(null)
    const router = useRouter()
    // Dialog state
    const [dialogOpen, setDialogOpen] = useState(false)
    const [selectedRenstra, setSelectedRenstra] = useState<Renstra | null>(null)
    const [dialogMode, setDialogMode] = useState<"add" | "edit">("add")
    const { success, error: showError } = useToast()
  
    // Track if component is mounted
    const isMounted = useRef(false)
  
    // Fetch periods
    const fetchPeriodes = async () => {
      try {
        const response = await fetch("/api/periode")
        if (!response.ok) {
          throw new Error("Failed to fetch periods")
        }
        const data = await response.json()
        setPeriodes(data.periodes || data)
      } catch (err) {
        console.error("Error fetching periods:", err)
        showError("Error", "Failed to fetch periods. Please try again.")
      }
    }
  
    const fetchRenstra = async () => {
      if (loading) return
  
      setLoading(true)
      setError(null)
  
      try {
        const queryParams = new URLSearchParams()
  
        if (selectedPeriode) {
          queryParams.append("periode_id", selectedPeriode)
        }
  
        const response = await fetch(`/api/renstra?${queryParams.toString()}`)
  
        if (!response.ok) {
          throw new Error("Failed to fetch renstra data")
        }
  
        const data = await response.json()
  
        if (isMounted.current) {
          setRenstraItems(data.renstra || data)
          setTotalItems(data.total || data.renstra?.length || data.length || 0)
        }
      } catch (err) {
        if (isMounted.current) {
          setError(err instanceof Error ? err.message : "An error occurred")
          console.error(err)
          showError("Error", "Failed to fetch renstra data. Please try again.")
        }
      } finally {
        if (isMounted.current) {
          setLoading(false)
        }
      }
    }
  
    const handleAddRenstra = () => {
      setSelectedRenstra(null)
      setDialogMode("add")
      setDialogOpen(true)
    }
  
    const handleEditRenstra = (renstra: Renstra) => {
      setSelectedRenstra(renstra)
      setDialogMode("edit")
      setDialogOpen(true)
    }
  
    const handleDeleteRenstra = async (renstra: Renstra) => {
      if (!confirm(`Are you sure you want to delete "${renstra.nama}"?`)) {
        return
      }
  
      try {
        const response = await fetch(`/api/renstra/${renstra.id}`, {
          method: "DELETE",
        })
  
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to delete renstra")
        }
  
        success("Success", `Renstra "${renstra.nama}" has been deleted successfully.`)
  
        fetchRenstra()
      } catch (error) {
        console.error("Error deleting renstra:", error)
        showError("Error", error instanceof Error ? error.message : "Failed to delete renstra")
      }
    }
  
    const handleSaveRenstra = async (formData: Partial<Renstra>) => {
      try {
        if (dialogMode === "add") {
          const response = await fetch("/api/renstra", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          })
  
          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || "Failed to create renstra")
          }
  
          success("Success", `Renstra "${formData.nama}" has been created successfully.`)
        } else {
          const response = await fetch(`/api/renstra/${selectedRenstra?.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          })
  
          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || "Failed to update renstra")
          }
  
          success("Success", `Renstra "${formData.nama}" has been updated successfully.`)
        }
  
        setDialogOpen(false)
        fetchRenstra()
      } catch (error) {
        console.error("Error saving renstra:", error)
        showError("Error", error instanceof Error ? error.message : "Failed to save renstra")
        throw error
      }
    }

    const handleViewSubRenstra = (renstra: Renstra) => {
      router.push(`/dashboard/renstra/${renstra.id}`)
    }
  
    useEffect(() => {
      isMounted.current = true
      fetchPeriodes()
      fetchRenstra()
  
      return () => {
        isMounted.current = false
      }
    }, [])
  
    useEffect(() => {
      if (isMounted.current) {
        fetchRenstra()
      }
    }, [])
  
    // Create columns with the actions
    const renstraColumns = createRenstraColumns(handleEditRenstra, handleDeleteRenstra, handleViewSubRenstra)
  
    // Count sub-renstra and point-renstra
    const totalSubRenstra = renstraItems.reduce((total, item) => total + (item.sub_renstra?.length || 0), 0)
    const totalPointRenstra = renstraItems.reduce((total, item) => total + (item.point_renstra?.length || 0), 0)
  
    return (
       <RoleGuard allowedRoles={[Role.Admin, Role.Waket_1, Role.Waket_2]}>
            {/* Jika loading dan users kosong, tampilkan PageLoader */}
            {loading && renstraItems.length === 0 ? (
              <DashboardLayout>
                <PageLoader />
              </DashboardLayout>
            ) : (
      <DashboardLayout>
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Rencana Strategis</h1>
              <p className="text-gray-500 mt-1">Kelola Dokumen Rencana Strategis Anda</p>
            </div>
            <Button onClick={handleAddRenstra}>
              <PlusCircle className="mr-2 h-4 w-4" /> Tambah Renstra
            </Button>
          </div>
  
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-sm text-gray-500">Total Renstra</div>
              <div className="text-2xl font-bold mt-1">{totalItems}</div>
            </div>
  
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-sm text-gray-500">Total Sub-Renstra</div>
              <div className="text-2xl font-bold mt-1">{totalSubRenstra}</div>
            </div>
  
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-sm text-gray-500">Total Point Renstra</div>
              <div className="text-2xl font-bold mt-1">{totalPointRenstra}</div>
            </div>
          </div>
  
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <Select
              value={selectedPeriode || "all"}
              onValueChange={(value) => setSelectedPeriode(value === "all" ? null : value)}
            >
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Filter by period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Periods</SelectItem>
                {periodes.map((periode) => (
                  <SelectItem key={periode.id.toString()} value={periode.id.toString()}>
                    {periode.nama} ({periode.tahun_awal}-{periode.tahun_akhir})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
  
            <Button variant="outline" size="sm" onClick={fetchRenstra}>
              <RefreshCw className="mr-2 h-4 w-4" /> Refresh
            </Button>
          </div>
  
          {error ? (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg">Error: {error}. Please try again.</div>
          ) : (
            <DataTableCard
              columns={renstraColumns}
              data={renstraItems}
              title="Renstra Management"
              description="Manage strategic planning documents and their components."
              searchColumn="nama"
              searchPlaceholder="Search renstra..."
              extraActions={
                <Button size="sm" className="h-10" onClick={handleAddRenstra}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Tambah Renstra
                </Button>
              }
            />
          )}
        </div>
  
        {/* Renstra Dialog */}
        <RenstraDialog
          isOpen={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onSave={handleSaveRenstra}
          renstra={selectedRenstra}
          mode={dialogMode}
          periodes={periodes}
        />
      </DashboardLayout>
    )}
    </RoleGuard>
    )
  }