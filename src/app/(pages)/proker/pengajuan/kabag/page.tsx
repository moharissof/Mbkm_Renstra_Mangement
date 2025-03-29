 
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/layout";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { DataTableCard } from "@/components/DataTable/CardTable";
import { PengajuanProgramColumn } from "../../_component/PengajuanList";
import { ApprovalDialog } from "../../_component/ApprovalModal";

export default function ProgramKerjaPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ id?: string; jabatan?: any }>({});
  const { error: showError } = useToast();

  const [loading, setLoading] = useState(true);
  const [programs, setPrograms] = useState<any[]>([]);
  const [totalPrograms, setTotalPrograms] = useState(0);

  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
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
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchSubordinatePrograms = async () => {
      if (!user?.id) return;

      setLoading(true);
      try {
        const response = await fetch(
          `/api/proker/pengajuan/kabag?user_id=${user.id}&status=Planning`
        );
        if (!response.ok)
          throw new Error("Failed to fetch subordinate programs");

        const data = await response.json();
        setPrograms(data.programKerja || data);
        setTotalPrograms(
          data.total || data.programKerja?.length || data.length || 0
        );
      } catch (err) {
        console.error("Error fetching subordinate programs:", err);
        showError("Error", "Failed to fetch subordinate programs");
      } finally {
        setLoading(false);
      }
    };

    fetchSubordinatePrograms();
  }, [user]);

  const handleStatusChanged = () => {
    // Refresh data setelah approval
    setPrograms([]);
    setSelectedProgram(null);
  };
  const handleViewProgram = (program: any) => {
    router.push(`/proker/${program.id}`);
  };

  // Create columns with the actions
  const programColumns = PengajuanProgramColumn(handleViewProgram);

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Pengajuan Proker Staff</h1>
            <p className="text-gray-500 mt-1">
              Kelola program kerja bawahan Anda
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-sm text-gray-500">Total Proker</div>
            <div className="text-2xl font-bold mt-1">{totalPrograms}</div>
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
            title="Program Kerja Bawahan"
            description="Daftar program kerja dari bawahan Anda"
            searchColumn="nama"
            searchPlaceholder="Cari program..."
          />
        )}

        {selectedProgram && (
          <ApprovalDialog
            program={selectedProgram}
            isOpen={approvalDialogOpen}
            onClose={() => setApprovalDialogOpen(false)}
            onStatusChanged={handleStatusChanged}
            approvalLevel={2}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
