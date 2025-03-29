/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/Dashboard/layout";
import { Button } from "@/components/ui/button";
import { StatusChangeDialog } from "../../_component/Modal";
import { useToast } from "@/hooks/use-toast";
import { Loader2, PlusCircle } from "lucide-react";
import { DataTableCard } from "@/components/DataTable/CardTable";
import { ApprovalDialog } from "../../_component/ApprovalModal";
import { PengajuanProgramColumn } from "../../_component/PengajuanList";

export default function ProgramKerjaBidangPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<{ id?: string; jabatan?: any }>({});
  
  const [loading, setLoading] = useState(true);
  const [programs, setPrograms] = useState<any[]>([]);
  const [totalPrograms, setTotalPrograms] = useState(0);
  const [bidang, setBidang] = useState<any>(null);

  // Approval dialog state
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<any>(null);

  useEffect(() => {
    const fetchUserAndBidang = async () => {
      try {
        // Fetch user data
        const userResponse = await fetch("/api/auth/user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const { user: userData } = await userResponse.json();
        setUser(userData);

        const Bidang = userData.jabatan?.bidang;
        setBidang(Bidang);
      } catch (error) {
        console.error("Error fetching user/bidang data:", error);
        toast({
          title: "Error",
          description: "Gagal memuat data user",
          variant: "destructive",
        });
      }
    };

    fetchUserAndBidang();
  }, []);

  useEffect(() => {
    const fetchProgramsByBidang = async () => {
      if (!user?.jabatan?.bidang_id) return;

      setLoading(true);
      try {
        const response = await fetch(
          `/api/pengajuan/waket?bidang_id=${user.jabatan.bidang_id}&status=Menunggu_Approve_Waket`
        );
        if (!response.ok) throw new Error("Failed to fetch bidang programs");

        const data = await response.json();
        setPrograms(data.programKerja || data);
        setTotalPrograms(
          data.total || data.programKerja?.length || data.length || 0
        );
      } catch (err) {
        console.error("Error fetching bidang programs:", err);
        toast({
          title: "Error",
          description: "Gagal memuat program kerja bidang",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProgramsByBidang();
  }, [user]);

  const handleViewProgram = (program: any) => {
    router.push(`/proker/${program.id}`);
  };

  const handleApprove = (program: any) => {
    setSelectedProgram(program);
    setApprovalDialogOpen(true);
  };

  const handleStatusChanged = async () => {
    // Refresh data setelah approval
    setLoading(true);
    try {
      const response = await fetch(
        `/api/pengajuan/waket?bidang_id=${user.jabatan.bidang_id}`
      );
      if (!response.ok) throw new Error("Failed to refresh programs");

      const data = await response.json();
      setPrograms(data.programKerja || data);
    } catch (err) {
      console.error("Error refreshing programs:", err);
      toast({
        title: "Error",
        description: "Gagal memuat ulang data program",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setApprovalDialogOpen(false);
      setSelectedProgram(null);
    }
  };

  // Create columns with the actions
  const programColumns = PengajuanProgramColumn(handleViewProgram, handleApprove);

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">
              Daftar Pengajuan Proker {bidang?.nama || ""}
            </h1>
            <p className="text-gray-500 mt-1">Kelola Dan Verifikasi Proker</p>
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
            title={`Program Kerja Bidang ${bidang?.nama || ""}`}
            description={`Daftar program kerja dalam bidang ${
              bidang?.nama || ""
            }`}
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