"use client";
import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/layout";

import { Button } from "@/components/ui/button";
import { ArrowLeft, PlusCircle, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Renstra, SubRenstra, PointRenstra } from "@/types/renstra";
import { Bidang } from "@/types/user";
import { SubRenstraList } from "../_component/SubRenstra";
import { SubRenstraDialog } from "../_component/ModalSub";
import { PointRenstraDialog } from "../_component/ModalPoint";
import RoleGuard from "@/middleware/RoleGuard";
import { Role } from "@/types/user";
import { PageLoader } from "@/components/ui/loader";

export default function RenstraDetailPage() {
  const params = useParams();
  const router = useRouter();
  const renstraId = params.id as string;
  const { success, error: showError } = useToast();

  const [renstra, setRenstra] = useState<Renstra | null>(null);
  const [subRenstraItems, setSubRenstraItems] = useState<SubRenstra[]>([]);
  const [bidangOptions, setBidangOptions] = useState<Bidang[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dialog states
  const [subRenstraDialogOpen, setSubRenstraDialogOpen] = useState(false);
  const [selectedSubRenstra, setSelectedSubRenstra] =
    useState<SubRenstra | null>(null);
  const [subRenstraDialogMode, setSubRenstraDialogMode] = useState<
    "add" | "edit"
  >("add");

  const [pointRenstraDialogOpen, setPointRenstraDialogOpen] = useState(false);
  const [selectedPointRenstra, setSelectedPointRenstra] =
    useState<PointRenstra | null>(null);
  const [pointRenstraDialogMode, setPointRenstraDialogMode] = useState<
    "add" | "edit"
  >("add");
  const [selectedSubRenstraForPoint, setSelectedSubRenstraForPoint] =
    useState<SubRenstra | null>(null);

  // Track if component is mounted
  const isMounted = useRef(false);

  const fetchRenstra = async () => {
    try {
      const response = await fetch(`/api/renstra/${renstraId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch renstra");
      }
      const data = await response.json();
      setRenstra(data);
    } catch (err) {
      console.error("Error fetching renstra:", err);
      showError("Error", "Failed to fetch renstra details. Please try again.");
    }
  };

  const fetchSubRenstra = async () => {
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/sub?renstra_id=${renstraId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch sub-renstra data");
      }

      const data = await response.json();

      if (isMounted.current) {
        setSubRenstraItems(data.sub_renstra || data);
      }
    } catch (err) {
      if (isMounted.current) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error(err);
        showError(
          "Error",
          "Failed to fetch sub-renstra data. Please try again."
        );
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  const fetchBidangOptions = async () => {
    try {
      const response = await fetch("/api/bidang");
      if (!response.ok) {
        throw new Error("Failed to fetch bidang options");
      }
      const data = await response.json();
      setBidangOptions(data.bidang || data);
    } catch (err) {
      console.error("Error fetching bidang options:", err);
      showError("Error", "Failed to fetch bidang options. Please try again.");
    }
  };

  const handleAddSubRenstra = () => {
    setSelectedSubRenstra(null);
    setSubRenstraDialogMode("add");
    setSubRenstraDialogOpen(true);
  };

  const handleEditSubRenstra = (subRenstra: SubRenstra) => {
    setSelectedSubRenstra(subRenstra);
    setSubRenstraDialogMode("edit");
    setSubRenstraDialogOpen(true);
  };

  const handleDeleteSubRenstra = async (subRenstra: SubRenstra) => {
    if (!confirm(`Are you sure you want to delete "${subRenstra.nama}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/sub-renstra/${subRenstra.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete sub-renstra");
      }

      success(
        "Success",
        `Sub-Renstra "${subRenstra.nama}" has been deleted successfully.`
      );

      fetchSubRenstra();
    } catch (error) {
      console.error("Error deleting sub-renstra:", error);
      showError(
        "Error",
        error instanceof Error ? error.message : "Failed to delete sub-renstra"
      );
    }
  };

  const handleAddPointRenstra = (subRenstra: SubRenstra) => {
    setSelectedPointRenstra(null);
    setSelectedSubRenstraForPoint(subRenstra);
    setPointRenstraDialogMode("add");
    setPointRenstraDialogOpen(true);
  };

  const handleEditPointRenstra = (
    pointRenstra: PointRenstra,
    subRenstra: SubRenstra
  ) => {
    setSelectedPointRenstra(pointRenstra);
    setSelectedSubRenstraForPoint(subRenstra);
    setPointRenstraDialogMode("edit");
    setPointRenstraDialogOpen(true);
  };

  const handleDeletePointRenstra = async (pointRenstra: PointRenstra) => {
    if (!confirm(`Are you sure you want to delete "${pointRenstra.nama}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/point/${pointRenstra.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete point-renstra");
      }

      success(
        "Success",
        `Point Renstra "${pointRenstra.nama}" has been deleted successfully.`
      );

      fetchSubRenstra();
    } catch (error) {
      console.error("Error deleting point-renstra:", error);
      showError(
        "Error",
        error instanceof Error
          ? error.message
          : "Failed to delete point-renstra"
      );
    }
  };

  const handleSaveSubRenstra = async (formData: Partial<SubRenstra>) => {
    try {
      if (subRenstraDialogMode === "add") {
        const response = await fetch("/api/sub", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            renstra_id: renstraId,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to create sub-renstra");
        }

        success(
          "Success",
          `Sub-Renstra "${formData.nama}" has been created successfully.`
        );
      } else {
        const response = await fetch(
          `/api/sub-renstra/${selectedSubRenstra?.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to update sub-renstra");
        }

        success(
          "Success",
          `Sub-Renstra "${formData.nama}" has been updated successfully.`
        );
      }

      setSubRenstraDialogOpen(false);
      fetchSubRenstra();
    } catch (error) {
      console.error("Error saving sub-renstra:", error);
      showError(
        "Error",
        error instanceof Error ? error.message : "Failed to save sub-renstra"
      );
      throw error;
    }
  };

  const handleSavePointRenstra = async (formData: Partial<PointRenstra>) => {
    try {
      if (pointRenstraDialogMode === "add") {
        const response = await fetch("/api/point", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            renstra_id: renstraId,
            sub_renstra_id: selectedSubRenstraForPoint?.id,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to create point-renstra");
        }

        success(
          "Success",
          `Point Renstra "${formData.nama}" has been created successfully.`
        );
      } else {
        const response = await fetch(`/api/point/${selectedPointRenstra?.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to update point-renstra");
        }

        success(
          "Success",
          `Point Renstra "${formData.nama}" has been updated successfully.`
        );
      }

      setPointRenstraDialogOpen(false);
      fetchSubRenstra();
    } catch (error) {
      console.error("Error saving point-renstra:", error);
      showError(
        "Error",
        error instanceof Error ? error.message : "Failed to save point-renstra"
      );
      throw error;
    }
  };

  useEffect(() => {
    isMounted.current = true;
    fetchRenstra();
    fetchSubRenstra();
    fetchBidangOptions();

    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [renstraId]);

  return (
    <RoleGuard allowedRoles={[Role.Admin, Role.Waket_1, Role.Waket_2]}>
      {/* Jika loading dan users kosong, tampilkan PageLoader */}
      {loading && subRenstraItems.length === 0 ? (
        <DashboardLayout>
          <PageLoader />
        </DashboardLayout>
      ) : (
        <DashboardLayout>
          <div className="p-6 space-y-6">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push("/dashboard/renstra")}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                  </Button>
                  <div>
                    <h1 className="text-2xl font-bold">
                      {renstra?.nama || "Loading..."}
                    </h1>
                    <p className="text-gray-500 mt-1">
                      {renstra?.periode
                        ? `${renstra.periode.nama} (${renstra.periode.tahun_awal}-${renstra.periode.tahun_akhir})`
                        : ""}
                    </p>
                  </div>
                </div>
                <Button onClick={handleAddSubRenstra}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Tambah Sub-Renstra
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-sm text-gray-500">Total Sub-Renstra</div>
                <div className="text-2xl font-bold mt-1">
                  {subRenstraItems.length}
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-sm text-gray-500">Total Point Renstra</div>
                <div className="text-2xl font-bold mt-1">
                  {subRenstraItems.reduce(
                    (total, item) => total + (item.point_renstra?.length || 0),
                    0
                  )}
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-sm text-gray-500">Average Completion</div>
                <div className="text-2xl font-bold mt-1">
                  {subRenstraItems.length > 0
                    ? `${Math.round(
                        subRenstraItems.reduce((total, item) => {
                          const points = item.point_renstra || [];
                          const avgPercentage =
                            points.length > 0
                              ? points.reduce(
                                  (sum, point) => sum + (point.presentase || 0),
                                  0
                                ) / points.length
                              : 0;
                          return total + avgPercentage;
                        }, 0) / subRenstraItems.length
                      )}%`
                    : "0%"}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 mb-4">
              <Button variant="outline" size="sm" onClick={fetchSubRenstra}>
                <RefreshCw className="mr-2 h-4 w-4" /> Refresh
              </Button>
            </div>

            {error ? (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                Error: {error}. Coba Lagi.
              </div>
            ) : (
              <SubRenstraList
                subRenstraItems={subRenstraItems}
                onEditSubRenstra={handleEditSubRenstra}
                onDeleteSubRenstra={handleDeleteSubRenstra}
                onAddPointRenstra={handleAddPointRenstra}
                onEditPointRenstra={handleEditPointRenstra}
                onDeletePointRenstra={handleDeletePointRenstra}
              />
            )}
          </div>

          {/* Sub-Renstra Dialog */}
          <SubRenstraDialog
            isOpen={subRenstraDialogOpen}
            onClose={() => setSubRenstraDialogOpen(false)}
            onSave={handleSaveSubRenstra}
            subRenstra={selectedSubRenstra}
            mode={subRenstraDialogMode}
          />

          {/* Point-Renstra Dialog */}
          <PointRenstraDialog
            isOpen={pointRenstraDialogOpen}
            onClose={() => setPointRenstraDialogOpen(false)}
            onSave={handleSavePointRenstra}
            pointRenstra={selectedPointRenstra}
            mode={pointRenstraDialogMode}
            bidangOptions={bidangOptions}
            subRenstra={selectedSubRenstraForPoint}
          />
        </DashboardLayout>
      )}
    </RoleGuard>
  );
}
