/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/layout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, PlusCircle, Filter } from "lucide-react";
import { DataTableCard } from "@/components/DataTable/CardTable";
import { PengajuanProgramColumn } from "./_component/Column";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export default function ProgramKerjaBidangPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<{ id?: string; jabatan?: any }>({});
  const [loading, setLoading] = useState(true);
  const [programs, setPrograms] = useState<any[]>([]);
  const [totalPrograms, setTotalPrograms] = useState(0);
  const [bidang, setBidang] = useState<any>(null);
  const [periodes, setPeriodes] = useState<any[]>([]);
  const [selectedPeriode, setSelectedPeriode] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // Approval dialog state
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<any>(null);

  useEffect(() => {
    const fetchUserAndBidang = async () => {
      try {
        setLoading(true);
        const userResponse = await fetch("/api/auth/user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        
        if (!userResponse.ok) throw new Error("Failed to fetch user data");
        
        const { user: userData } = await userResponse.json();
        setUser(userData);
        setBidang(userData.jabatan?.bidang);
      } catch (error) {
        console.error("Error fetching user/bidang data:", error);
        toast({
          title: "Error",
          description: "Gagal memuat data user",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndBidang();
  }, []);

  useEffect(() => {
    const fetchPeriodes = async () => {
      try {
        const response = await fetch("/api/periode-proker");
        if (!response.ok) throw new Error("Failed to fetch periods");

        const data = await response.json();
        setPeriodes(data.periodeProker || data);
      } catch (err) {
        console.error("Error fetching periods:", err);
        toast({
          title: "Error",
          description: "Gagal memuat data periode",
          variant: "destructive",
        });
      }
    };

    fetchPeriodes();
  }, []);

  useEffect(() => {
    const fetchProgramsByBidang = async () => {
      if (!user?.jabatan?.bidang_id) return;

      setLoading(true);
      try {
        let url = `/api/history?bidang_id=${user.jabatan.bidang_id}`;
        
        if (selectedPeriode && selectedPeriode !== "all") {
          url += `&periode_proker_id=${selectedPeriode}`;
        }
        
        if (selectedStatus && selectedStatus !== "all") {
          url += `&status=${selectedStatus}`;
        }

        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch bidang programs");

        const data = await response.json();
        setPrograms(data.programKerja || []);
        setTotalPrograms(data.total || data.programKerja?.length || 0);
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
  }, [user, selectedPeriode, selectedStatus]);

  const handleViewProgram = (program: any) => {
    router.push(`/proker/${program.id}`);
  };

  const handleApprove = (program: any) => {
    setSelectedProgram(program);
    setApprovalDialogOpen(true);
  };

  const handleStatusChanged = async () => {
    try {
      setLoading(true);
      let url = `/api/history?bidang_id=${user.jabatan.bidang_id}`;
      
      if (selectedPeriode && selectedPeriode !== "all") {
        url += `&periode_proker_id=${selectedPeriode}`;
      }
      
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to refresh programs");

      const data = await response.json();
      setPrograms(data.programKerja || []);
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

  const programColumns = PengajuanProgramColumn(handleViewProgram, handleApprove);

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">
              Daftar History Proker
            </h1>
            <p className="text-gray-500 mt-1">Cari Dan Liat History</p>
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
                  value={selectedPeriode}
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
                  value={selectedStatus}
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
            title={`History Program Kerja ${bidang?.nama || ""}`}
            description={`Total ${totalPrograms} program kerja yang dicari`}
            searchColumn="nama"
            searchPlaceholder="Cari program..."
          />
        )}
      </div>
    </DashboardLayout>
  );
}