/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/Dashboard/layout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, PlusCircle, Check, X, FileText, Eye } from "lucide-react";
import { DataTableCard } from "@/components/DataTable/CardTable";
import { VerificationDialog } from "../_component/VerificationModal";

interface ProgramKerja {
  id: string;
  nama: string;
  progress: number;
  status: string;
  user: {
    name: string;
  };
  point_renstra: {
    bidang: {
      nama: string;
    };
  };
  laporan?: Array<{
    id: string;
    created_at: string;
    progress: number;
    description: string;
  }>;
  // Add other fields as needed
}

export default function ProgramVerificationPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<{ id?: string; jabatan?: any }>({});
  const [loading, setLoading] = useState(true);
  const [programs, setPrograms] = useState<ProgramKerja[]>([]);
  const [totalPrograms, setTotalPrograms] = useState(0);
  const [bidang, setBidang] = useState<any>(null);

  // Verification dialog state
  const [verificationDialogOpen, setVerificationDialogOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<ProgramKerja | null>(null);

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

        // Only allow Kabag, Waket, or Ketua to access this page
        const allowedRoles = ["Kabag", "Waket_1", "Waket_2", "Ketua"];
        if (!allowedRoles.includes(userData.jabatan?.role)) {
          router.push("/dashboard");
          return;
        }

        const bidang = userData.jabatan?.bidang;
        setBidang(bidang);
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
    const fetchCompletedPrograms = async () => {
      if (!user?.jabatan?.bidang_id) return;

      setLoading(true);
      try {
        // Fetch programs with 100% progress but not yet verified
        const response = await fetch(
          `/api/done?bidang_id=${user.jabatan?.bidang_id}&completed=true`
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const { programKerja, total } = await response.json();
        
        console.log("Fetched programs:", programKerja);
        console.log("First program:", programKerja[0]);
        
        setPrograms(programKerja);
        setTotalPrograms(total);
      } catch (err) {
        console.error("Error fetching completed programs:", err);
        toast({
          title: "Error",
          description: "Gagal memuat program yang perlu verifikasi",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedPrograms();
  }, [user]);

  const handleViewProgram = (program: ProgramKerja) => {
    router.push(`/proker/${program.id}/reports`);
  };

  const handleVerify = (program: ProgramKerja) => {
    setSelectedProgram(program);
    setVerificationDialogOpen(true);
  };

  const handleVerificationCompleted = async (verified: boolean) => {
    if (!selectedProgram) return;

    try {
      const response = await fetch(`/api/done/${selectedProgram.id}/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to verify program");

      // Refresh the list after verification
      const updatedResponse = await fetch(
        `/api/program-kerja?bidang_id=${user.jabatan?.bidang_id}&completed=true`
      );
      const { programKerja, total } = await updatedResponse.json();
      setPrograms(programKerja);
      setTotalPrograms(total);

      toast({
        title: "Berhasil",
        description: verified
          ? "Program telah diverifikasi dan diselesaikan"
          : "Program dikembalikan untuk penyempurnaan",
      });
    } catch (err) {
      console.error("Error verifying program:", err);
      toast({
        title: "Error",
        description: "Gagal memverifikasi program",
        variant: "destructive",
      });
    } finally {
      setVerificationDialogOpen(false);
      setSelectedProgram(null);
    }
  };

  // Custom columns for verification page
  const verificationColumns = [
    {
      accessorKey: "nama",
      header: "Nama Program",
      cell: ({ row }: any) => {
        const program = row.original;
        return (
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="font-medium">{program.nama}</div>
              <div className="text-xs text-gray-500">
                {program.point_renstra?.bidang?.nama}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "users.name",
      header: "Penanggung Jawab",
    },
    {
      accessorKey: "progress",
      header: "Progress",
      cell: ({ row }: any) => (
        <div className="flex items-center gap-2">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-green-600 h-2.5 rounded-full"
              style={{ width: `${row.original.progress}%` }}
            ></div>
          </div>
          <span className="text-sm font-medium">{row.original.progress}%</span>
        </div>
      ),
    },
    {
      accessorKey: "lastReport",
      header: "Laporan Terakhir",
      cell: ({ row }: any) => {
        const lastReport = row.original.laporan?.[0];
        return lastReport
          ? new Date(lastReport.created_at).toLocaleDateString()
          : "-";
      },
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }: any) => {
        const program = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleViewProgram(program)}
            >
              <Eye className="h-4 w-4 mr-1" />
              Lihat
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-green-600 border-green-600 hover:bg-green-50"
              onClick={() => handleVerify(program)}
            >
              <Check className="h-4 w-4 mr-1" />
              Verifikasi
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Verifikasi Penyelesaian Proker</h1>
            <p className="text-gray-500 mt-1">
              Verifikasi program yang telah mencapai 100% progress
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : programs.length === 0 ? (
          <div className="text-center py-8">
            <p>Tidak ada program yang perlu diverifikasi</p>
          </div>
        ) : (
          <DataTableCard
            columns={verificationColumns}
            data={programs}
            title={`Program yang Perlu Verifikasi`}
            description={`Daftar program kerja yang telah selesai dan perlu verifikasi`}
            searchColumn="nama"
            searchPlaceholder="Cari program..."
          />
        )}

        {selectedProgram && (
          <VerificationDialog
            program={selectedProgram}
            isOpen={verificationDialogOpen}
            onClose={() => setVerificationDialogOpen(false)}
            onVerify={handleVerificationCompleted}
          />
        )}
      </div>
    </DashboardLayout>
  );
}