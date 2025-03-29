/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect, useRef } from "react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { DataTableCard } from "@/components/DataTable/CardTable";
import { createPositionColumns } from "./_component/Column";
import { Button } from "@/components/ui/button";
import { Loader2, PlusCircle, RefreshCw } from "lucide-react";
import { type Jabatan, Role, Bidang } from "@/types/user";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PositionDialog } from "./_component/Modal";
import { useToast } from "@/hooks/use-toast";
import { PageLoader, TableLoader } from "@/components/ui/loader";
import RoleGuard from "@/middleware/RoleGuard";

export default function PositionsPage() {
  const [positions, setPositions] = useState<Jabatan[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [bidangList, setBidangList] = useState<Bidang[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [totalPositions, setTotalPositions] = useState(0);
  const [filters, setFilters] = useState({
    role: null as string | null,
    bidang: null as string | null,
    parentId: null as string | null,
  });

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<Jabatan | null>(
    null
  );
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const { toast } = useToast();

  // Track if component is mounted
  const isMounted = useRef(false);
  useEffect(() => {
    const fetchBidang = async () => {
      try {
        const response = await fetch("/api/bidang");
        if (!response.ok) {
          throw new Error("Failed to fetch bidang");
        }
        const data = await response.json();
        setBidangList(data);
      } catch (error) {
        console.error("Error fetching bidang:", error);
      }
    };

    fetchBidang();
  }, []);
  // Fix the loading state issue in the fetchPositions function
  const fetchPositions = async (isRefreshing = false) => {
    if (loading && !isRefreshing) return;

    if (isRefreshing) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const queryParams = new URLSearchParams();

      if (filters.role) {
        queryParams.append("role", filters.role);
      }

      if (filters.bidang) {
        queryParams.append("bidang", filters.bidang);
      }

      if (filters.parentId) {
        queryParams.append("parent_id", filters.parentId);
      }

      const response = await fetch(`/api/jabatan?${queryParams.toString()}`);

      if (!response.ok) {
        throw new Error("Failed to fetch positions");
      }

      const data = await response.json();
      setPositions(data);
      setTotalPositions(data.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error(err);
      toast({
        title: "Error",
        description: "Gagal mengambil data jabatan",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchPositions(true);
  };

  const handleAddPosition = () => {
    setSelectedPosition(null);
    setDialogMode("add");
    setDialogOpen(true);
  };

  const handleEditPosition = (position: Jabatan) => {
    setSelectedPosition(position);
    setDialogMode("edit");
    setDialogOpen(true);
  };

  const handleDeletePosition = async (position: Jabatan) => {
    if (
      !confirm(`Apakah Anda yakin ingin menghapus jabatan "${position.nama}"?`)
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/jabatan/${position.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete position");
      }

      toast({
        title: "Berhasil",
        description: `Jabatan ${position.nama} telah dihapus`,
        variant: "success",
      });

      fetchPositions();
    } catch (error) {
      console.error("Error deleting position:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to delete position",
        variant: "destructive",
      });
    }
  };

  const handleSavePosition = async (formData: Partial<Jabatan>) => {
    try {
      if (dialogMode === "add") {
        const response = await fetch("/api/jabatan", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to create position");
        }

        toast({
          title: "Berhasil",
          description: `Jabatan ${formData.nama} telah dibuat`,
          variant: "success",
        });
      } else {
        const response = await fetch(`/api/jabatan/${selectedPosition?.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to update position");
        }

        toast({
          title: "Berhasil",
          description: `Jabatan ${formData.nama} telah diperbarui`,
          variant: "success",
        });
      }

      setDialogOpen(false);
      fetchPositions();
    } catch (error) {
      console.error("Error saving position:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to save position",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Fix the initial data fetch in useEffect
  useEffect(() => {
    isMounted.current = true;

    // Initial data fetch - load all data without filters
    const initData = async () => {
      try {
        setLoading(true);

        // Fetch all positions without waiting for filters
        const response = await fetch("/api/jabatan");
        console.log("Response:", response);
        if (!response.ok) {
          throw new Error("Failed to fetch positions");
        }
        const data = await response.json();
        console.log("Data:", data);
        setPositions(data);
        setTotalPositions(data.length);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error(err);
        toast({
          title: "Error",
          description: "Gagal mengambil data jabatan",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    initData();

    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (
      isMounted.current &&
      (filters.role || filters.bidang || filters.parentId)
    ) {
      fetchPositions();
    }
  }, [filters]);

  const handleRoleFilterChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      role: value === "all" ? null : value,
    }));
  };

  const handleBidangFilterChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      bidang: value === "all" ? null : value,
    }));
  };

  const handleParentFilterChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      parentId: value === "all" ? null : value,
    }));
  };

  // Create columns with the actions
  const positionColumns = createPositionColumns(
    handleEditPosition,
    handleDeletePosition
  );

  // Count positions by role
  const adminCount = positions.filter(
    (position) => position.role === Role.Admin
  ).length;
  const pimpinanCount = positions.filter((position) =>
    [Role.Ketua, Role.Waket_1, Role.Waket_2].includes(position.role as Role)
  ).length;
  const kabagCount = positions.filter(
    (position) => position.role === Role.Kabag
  ).length;
  const staffCount = positions.filter(
    (position) => position.role === Role.Staff_Kabag
  ).length;

  // Get parent positions for filter
  const parentPositions = positions.filter(
    (p) => !p.parent_id || p.parent_id.toString() === "0"
  );

  return (
    <RoleGuard allowedRoles={[Role.Admin]}>
      {/* Jika loading dan positions kosong, tampilkan PageLoader */}
      {loading && positions.length === 0 ? (
        <DashboardLayout>
          <PageLoader />
        </DashboardLayout>
      ) : (
        <DashboardLayout>
          <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">Jabatan</h1>
                <p className="text-gray-500 mt-1">
                  Kelola struktur jabatan dan hak akses sistem
                </p>
              </div>
              <Button onClick={handleAddPosition}>
                <PlusCircle className="mr-2 h-4 w-4" /> Tambah Jabatan
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-sm text-gray-500">Total Jabatan</div>
                <div className="text-2xl font-bold mt-1">{totalPositions}</div>
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
                <div className="text-2xl font-bold mt-1">
                  {kabagCount + staffCount}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 mb-4">
              <Select
                value={filters.role || "all"}
                onValueChange={handleRoleFilterChange}
              >
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

              <Select
                value={filters.bidang || "all"}
                onValueChange={handleBidangFilterChange}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by bidang" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Bidang</SelectItem>
                  {bidangList.map((bidang) => (
                    <SelectItem
                      key={bidang.id.toString()}
                      value={bidang.id.toString()}
                    >
                      {bidang.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filters.parentId || "all"}
                onValueChange={handleParentFilterChange}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by parent" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Jabatan</SelectItem>
                  <SelectItem value="0">Jabatan Utama</SelectItem>
                  {parentPositions.map((position) => (
                    <SelectItem
                      key={position.id.toString()}
                      value={position.id.toString()}
                    >
                      {position.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
              >
                {refreshing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Memuat...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" /> Refresh
                  </>
                )}
              </Button>
            </div>

            {error ? (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                Error: {error}. Silakan coba lagi.
              </div>
            ) : loading && positions.length > 0 ? (
              <TableLoader />
            ) : (
              <DataTableCard
                columns={positionColumns}
                data={positions}
                title="Manajemen Jabatan"
                description="Kelola struktur jabatan, role, dan bidang dalam sistem."
                searchColumn="nama"
                searchPlaceholder="Cari jabatan..."
                extraActions={
                  <Button
                    size="sm"
                    className="h-10"
                    onClick={handleAddPosition}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" /> Jabatan Baru
                  </Button>
                }
              />
            )}
          </div>

          {/* Position Dialog */}
          <PositionDialog
            isOpen={dialogOpen}
            onClose={() => setDialogOpen(false)}
            onSave={handleSavePosition}
            position={selectedPosition}
            mode={dialogMode}
            allPositions={positions}
            bidangList={bidangList} // Pastikan bidangList diteruskan
          />
        </DashboardLayout>
      )}
    </RoleGuard>
  );
}
