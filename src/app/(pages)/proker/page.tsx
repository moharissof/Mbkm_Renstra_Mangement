/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/layout";
import { Button } from "@/components/ui/button";
import { StatusChangeDialog } from "./_component/ModalPengajuan";
import RoleGuard from "@/middleware/RoleGuard";
import { Role } from "@/types/user";
import { useToast } from "@/hooks/use-toast";
import { Loader2, PlusCircle, Filter } from "lucide-react";
import { DataTableCard } from "@/components/DataTable/CardTable";
import { createProgramKerjaColumns } from "./_component/Column";
import { PageLoader } from "@/components/ui/loader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ProgramKerjaPage() {
  const router = useRouter();
  const [user, setUser] = useState<{
    [x: string]: any;
    id?: string;
  }>({});
  const { error: showError } = useToast();

  const [loading, setLoading] = useState(true);
  const [programs, setPrograms] = useState<any[]>([]);
  const [totalPrograms, setTotalPrograms] = useState(0);
  const [periodes, setPeriodes] = useState<any[]>([]);
  const [selectedPeriode, setSelectedPeriode] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  // Status change dialog state
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/auth/user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const { user: userData } = await response.json();
        console.log("userData", userData);
        setUser(userData); // Simpan data user ke state
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, []);
  // Fetch active periods
  useEffect(() => {
    const fetchPeriodes = async () => {
      try {
        const response = await fetch("/api/periode-proker");
        if (!response.ok) throw new Error("Failed to fetch periods");

        const data = await response.json();
        const periodesData = data.periodeProker || data;
        setPeriodes(periodesData);

        // Auto-select the first active period if available
        const activePeriods = periodesData.filter((period: any) => {
          const now = new Date();
          const startDate = new Date(period.tanggal_mulai);
          const endDate = new Date(period.tanggal_selesai);
          return now >= startDate && now <= endDate;
        });

        if (activePeriods.length > 0 && !selectedPeriode) {
          setSelectedPeriode(activePeriods[0].id);
        }
      } catch (err) {
        console.error("Error fetching periods:", err);
        showError("Error", "Failed to fetch periods");
      }
    };

    fetchPeriodes();
  }, []);

  useEffect(() => {
    const fetchPrograms = async () => {
      // Don't fetch if user isn't available yet
      console.log("user", user);
      if (!user?.id) return;

      setLoading(true);
      try {
        let url = "/api/proker?";

        if (selectedPeriode) {
          url += `periode_proker_id=${selectedPeriode}&`;
        }

        if (selectedStatus) {
          url += `status=${selectedStatus}&`;
        }

        url += `user_id=${user.id}&`;

        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch programs");

        const data = await response.json();
        setPrograms(data.programKerja || data);
        setTotalPrograms(
          data.total || data.programKerja?.length || data.length || 0
        );
      } catch (err) {
        console.error("Error fetching programs:", err);
        showError("Error", "Failed to fetch programs");
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, [selectedPeriode, selectedStatus, user]); // Add user to dependencies

  const handleCreateProgram = () => {
    router.push("/proker/renstra");
  };

  const handleViewProgram = (program: any) => {
    router.push(`/proker/${program.id}`);
  };

  const handleEditProgram = (program: any) => {
    router.push(`/proker/edit/${program.id}`);
  };

  const handleDeleteProgram = async (program: any) => {
    if (!confirm(`Are you sure you want to delete "${program.nama}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/proker/${program.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete program");
      }

      // Refresh the program list
      const updatedPrograms = programs.filter((p) => p.id !== program.id);
      setPrograms(updatedPrograms);
      setTotalPrograms((prev) => prev - 1);
    } catch (error) {
      console.error("Error deleting program:", error);
      showError(
        "Error",
        error instanceof Error ? error.message : "Failed to delete program"
      );
    }
  };
  const handleChangeStatus = (program: any) => {
    setSelectedProgram(program);
    setStatusDialogOpen(true);
  };
  // Create columns with the actions
  const programColumns = createProgramKerjaColumns(
    handleViewProgram,
    handleEditProgram,
    handleDeleteProgram,
    handleChangeStatus
  );

  // Count programs by status
  const draftCount = programs.filter((p) => p.status === "Draft").length;
  const planningCount = programs.filter((p) => p.status === "Planning").length;
  const approvedCount = programs.filter((p) => p.status === "Disetujui").length;
  const rejectedCount = programs.filter((p) => p.status === "Ditolak").length;
  const doneCount = programs.filter((p) => p.status === "Done").length;
  console.log("programs", rejectedCount);
  return (
    <RoleGuard allowedRoles={[Role.Kabag, Role.Staff_Kabag]}>
      {/* Jika loading dan users kosong, tampilkan PageLoader */}
      {loading && programs.length === 0 ? (
        <DashboardLayout>
          <PageLoader />
        </DashboardLayout>
      ) : (
        <DashboardLayout>
          <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">Program Kerja</h1>
                <p className="text-gray-500 mt-1">Kelola program kerja Anda</p>
              </div>
              <Button onClick={handleCreateProgram}>
                <PlusCircle className="mr-2 h-4 w-4" /> Buat Program
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-sm text-gray-500">Total Proker</div>
                <div className="text-2xl font-bold mt-1">{totalPrograms}</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-sm text-gray-500">Draft</div>
                <div className="text-2xl font-bold mt-1">{draftCount}</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-sm text-gray-500">Planning</div>
                <div className="text-2xl font-bold mt-1">{planningCount}</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-sm text-gray-500">Approved</div>
                <div className="text-2xl font-bold mt-1">{approvedCount}</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-sm text-gray-500">Done</div>
                <div className="text-2xl font-bold mt-1">{doneCount}</div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="border-l-4 border-primary p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="h-5 w-5 text-primary" />
                  <span className="font-medium">Filters:</span>
                </div>

                <div className="flex flex-wrap gap-4">
                  <div className="w-full sm:w-auto">
                    <Select
                      value={selectedPeriode || ""}
                      onValueChange={setSelectedPeriode}
                    >
                      <SelectTrigger className="w-full sm:w-[180px] bg-white border-gray-200">
                        <SelectValue placeholder="Pilih periode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Periode</SelectItem>
                        {periodes.map((period) => (
                          <SelectItem
                            key={period.id}
                            value={period.id.toString()}
                          >
                            {period.tahun}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="w-full sm:w-auto">
                    <Select
                      value={selectedStatus || ""}
                      onValueChange={setSelectedStatus}
                    >
                      <SelectTrigger className="w-full sm:w-[180px] bg-white border-gray-200">
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Status</SelectItem>
                        <SelectItem value="Draft">Draft</SelectItem>
                        <SelectItem value="Planning">Planning</SelectItem>
                        <SelectItem value="Disetujui">Disetujui</SelectItem>
                        <SelectItem value="Ditolak">Ditolak</SelectItem>
                        <SelectItem value="Done">Selesai</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : ( 
              <DataTableCard
                columns={programColumns}
                data={programs}
                title="Program Kerja"
                description="Kelola program kerja dan pantau perkembangannya"
                searchColumn="nama"
                searchPlaceholder="Cari program..."
                extraActions={
                  <Button
                    size="sm"
                    className="h-10"
                    onClick={handleCreateProgram}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" /> Program Baru
                  </Button>
                }
              />
            )}
            {/* Status Change Dialog */}
            {selectedProgram && (
              <StatusChangeDialog
                program={selectedProgram}
                isOpen={statusDialogOpen}
                role={user?.jabatan?.role || "Staff_Kabag"} // Changed User to user and added optional chaining
                onClose={() => {
                  setStatusDialogOpen(false);
                  setSelectedProgram(null);
                }}
                onStatusChanged={() => setPrograms([])}
              />
            )}
          </div>
        </DashboardLayout>
      )}
    </RoleGuard>
  );
}
