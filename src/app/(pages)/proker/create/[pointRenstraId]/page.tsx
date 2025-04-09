/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/Dashboard/layout";
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
import { PointRenstra } from "@/types/renstra";
import { PeriodeRenstra } from "@/types/renstra";

export default function CreateProgramKerjaPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { success, error: showError } = useToast();

  const pointRenstraId = params.pointRenstraId as string;
  const periodeId = searchParams.get("periode");

  const [loading, setLoading] = useState(true);
  const [pointRenstra, setPointRenstra] = useState<PointRenstra | null>(null);
  const [periode, setPeriode] = useState<PeriodeRenstra | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch point renstra details
        const pointResponse = await fetch(`/api/point/${pointRenstraId}`);
        if (!pointResponse.ok) throw new Error("Failed to fetch point renstra");
        const pointData = await pointResponse.json();
        setPointRenstra(pointData);

        // Fetch periode details
        if (periodeId) {
          const periodeResponse = await fetch(
            `/api/periode/${periodeId}`
          );
          if (!periodeResponse.ok) throw new Error("Failed to fetch period");
          const periodeData = await periodeResponse.json();
          setPeriode(periodeData);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        showError("Error", "Failed to fetch required data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (formData: any) => {
    try {
      const response = await fetch("/api/proker", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create program");
      }

      const data = await response.json();
      console.log("Program created:", data);
      success("Success", "Program kerja has been created successfully");

      // Redirect to program list or detail page
      router.push("/proker");
    } catch (err) {
      console.error("Error creating program:", err);
      showError(
        "Error",
        err instanceof Error ? err.message : "Failed to create program"
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

  if (!pointRenstra || !periode) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-gray-500 mb-4">
                Required data not found. Please go back and try again.
              </p>
              <Button
                onClick={() =>
                  router.push("/proker/renstra")
                }
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
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
            <h1 className="text-2xl font-bold">Buat Program Kerja</h1>
            <p className="text-gray-500 mt-1">
              Buat Program Kerja Sesuai dengan Point Renstra Terpilih
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => router.push("/proker/renstra")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Point Renstra Terpilih</CardTitle>
            <CardDescription>
              Anda sedang membuat program untuk point renstra berikut
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Point Renstra
                </h3>
                <p className="font-medium">{pointRenstra.nama}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Bidang</h3>
                <p className="font-medium">
                  {pointRenstra.bidang?.nama}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Sub Renstra
                </h3>
                <p className="font-medium">{pointRenstra.sub_renstra?.nama}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Periode</h3>
                <p className="font-medium">{periode.nama} - {periode.tahun_awal} sampai {periode.tahun_akhir} </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <ProgramKerjaForm
          pointRenstra={pointRenstra}
          periode={periode}
          onSubmit={handleSubmit}
          mode="create"
        />
      </div>
    </DashboardLayout>
  );
}
