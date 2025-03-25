/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/Dashboard/_layout";
import { ProgramKerjaForm } from "../../_component/Form";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function EditProgramKerjaPage() {
  const params = useParams();
  const router = useRouter();
  const { success, error: showError } = useToast();

  const programId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [programKerja, setProgramKerja] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/proker/${programId}`);
        if (!response.ok) throw new Error("Failed to fetch program kerja");
        const data = await response.json();
        setProgramKerja(data);
      } catch (err) {
        console.error("Error fetching data:", err);
        showError("Error", "Failed to fetch program data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [programId]);

  const handleSubmit = async (formData: any) => {
    try {
      const response = await fetch(`/api/proker/${programId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update program");
      }

      const data = await response.json();
      console.log("Program updated:", data);
      success("Success", "Program kerja has been updated successfully");
      router.push(`/proker/${programId}`);
    } catch (err) {
      console.error("Error updating program:", err);
      showError(
        "Error",
        err instanceof Error ? err.message : "Failed to update program"
      );
      throw err;
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6 flex justify-center items-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!programKerja) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-gray-500 mb-4">
                Program tidak ditemukan. Silakan kembali dan coba lagi.
              </p>
              <Button onClick={() => router.push("/proker")}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Edit Program Kerja</h1>
            <p className="text-gray-500 mt-1">
              Edit program kerja yang sudah ada
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => router.push(`/proker/${programId}`)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Point Renstra Terpilih</CardTitle>
            <CardDescription>
              Anda sedang mengedit program untuk point renstra berikut
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Point Renstra
                </h3>
                <p className="font-medium">{programKerja.point_renstra?.nama}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Bidang</h3>
                <p className="font-medium">
                  {programKerja.point_renstra?.bidang?.nama} ({programKerja.point_renstra?.bidang?.kode})
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Sub Renstra
                </h3>
                <p className="font-medium">{programKerja.point_renstra?.sub_renstra?.nama}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Periode</h3>
                <p className="font-medium">{programKerja.periode_proker?.tahun}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <ProgramKerjaForm
          pointRenstra={programKerja.point_renstra}
          periode={programKerja.periode_proker}
          programKerja={programKerja}
          onSubmit={handleSubmit}
          mode="edit"
        />
      </div>
    </DashboardLayout>
  );
}