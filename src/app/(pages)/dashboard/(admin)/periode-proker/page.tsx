/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect, useRef } from "react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { DataTableCard } from "@/components/DataTable/CardTable";
import { createPeriodeProkerColumns } from "./_component/Column";
import { Button } from "@/components/ui/button";
import { PlusCircle, RefreshCw } from "lucide-react";
import { PeriodeProkerDialog } from "./_component/Modal";
import { useToast } from "@/hooks/use-toast";
import type { PeriodeProker } from "@/types/proker";
import RoleGuard from "@/middleware/RoleGuard";
import { PageLoader } from "@/components/ui/loader";
import { Role } from "@/types/user";

export default function PeriodeProkerPage() {
  const [periodeProkerItems, setPeriodeProkerItems] = useState<PeriodeProker[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState(0);

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPeriodeProker, setSelectedPeriodeProker] =
    useState<PeriodeProker | null>(null);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const { success, error: showError } = useToast();

  // Track if component is mounted
  const isMounted = useRef(false);

  const fetchPeriodeProker = async () => {
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/periode-proker`);

      if (!response.ok) {
        throw new Error("Failed to fetch program periods");
      }

      const data = await response.json();

      if (isMounted.current) {
        setPeriodeProkerItems(data.periodeProker || data);
        setTotalItems(
          data.total || data.periodeProker?.length || data.length || 0
        );
      }
    } catch (err) {
      if (isMounted.current) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error(err);
        showError(
          "Error",
          "Failed to fetch program periods. Please try again."
        );
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  const handleAddPeriodeProker = () => {
    setSelectedPeriodeProker(null);
    setDialogMode("add");
    setDialogOpen(true);
  };

  const handleEditPeriodeProker = (periodeProker: PeriodeProker) => {
    setSelectedPeriodeProker(periodeProker);
    setDialogMode("edit");
    setDialogOpen(true);
  };

  const handleDeletePeriodeProker = async (periodeProker: PeriodeProker) => {
    if (
      !confirm(
        `Are you sure you want to delete the period "${periodeProker.tahun}"?`
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/periode-proker/${periodeProker.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete program period");
      }

      success(
        "Success",
        `Program period "${periodeProker.tahun}" has been deleted successfully.`
      );

      fetchPeriodeProker();
    } catch (error) {
      console.error("Error deleting program period:", error);
      showError(
        "Error",
        error instanceof Error
          ? error.message
          : "Failed to delete program period"
      );
    }
  };

  const handleSavePeriodeProker = async (formData: Partial<PeriodeProker>) => {
    try {
      if (dialogMode === "add") {
        const response = await fetch("/api/periode-proker", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to create program period");
        }

        success(
          "Success",
          `Program period "${formData.tahun}" has been created successfully.`
        );
      } else {
        const response = await fetch(
          `/api/periode-proker/${selectedPeriodeProker?.id}`,
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
          throw new Error(errorData.error || "Failed to update program period");
        }

        success(
          "Success",
          `Program period "${formData.tahun}" has been updated successfully.`
        );
      }

      setDialogOpen(false);
      fetchPeriodeProker();
    } catch (error) {
      console.error("Error saving program period:", error);
      showError(
        "Error",
        error instanceof Error ? error.message : "Failed to save program period"
      );
      throw error;
    }
  };

  useEffect(() => {
    isMounted.current = true;
    fetchPeriodeProker();

    return () => {
      isMounted.current = false;
    };
  }, []);

  // Create columns with the actionsnpx
  const periodeProkerColumns = createPeriodeProkerColumns(
    handleEditPeriodeProker,
    handleDeletePeriodeProker
  );

  // Count program kerja by period
  const programsCount = periodeProkerItems.reduce(
    (total, period) => total + (period.program_kerja?.length || 0),
    0
  );

  return (
    <RoleGuard allowedRoles={[Role.Admin]}>
      {loading && periodeProkerItems.length === 0 ? (
        <DashboardLayout>
          <PageLoader />
        </DashboardLayout>
      ) : (
        <DashboardLayout>
          <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">Periode Proker</h1>
                <p className="text-gray-500 mt-1">Kelola Periode Proker Anda</p>
              </div>
              <Button onClick={handleAddPeriodeProker}>
                <PlusCircle className="mr-2 h-4 w-4" /> Tambah Periode
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-sm text-gray-500">Total Periode</div>
                <div className="text-2xl font-bold mt-1">{totalItems}</div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-sm text-gray-500">Active Periode</div>
                <div className="text-2xl font-bold mt-1">
                  {
                    periodeProkerItems.filter(
                      (p) =>
                        new Date(p.tanggal_mulai) <= new Date() &&
                        new Date(p.tanggal_selesai) >= new Date()
                    ).length
                  }
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-sm text-gray-500">Total Program Kerja</div>
                <div className="text-2xl font-bold mt-1">{programsCount}</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 mb-4">
              <Button variant="outline" size="sm" onClick={fetchPeriodeProker}>
                <RefreshCw className="mr-2 h-4 w-4" /> Refresh
              </Button>
            </div>

            {error ? (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                Error: {error}. Please try again.
              </div>
            ) : (
              <DataTableCard
                columns={periodeProkerColumns}
                data={periodeProkerItems}
                title="Periode Proker Management"
                description="Manage program work periods and their associated programs."
                searchColumn="tahun"
                searchPlaceholder="Search by year..."
                extraActions={
                  <Button
                    size="sm"
                    className="h-10"
                    onClick={handleAddPeriodeProker}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" /> Tambah Periode
                  </Button>
                }
              />
            )}
          </div>

          {/* Period Dialog */}
          <PeriodeProkerDialog
            isOpen={dialogOpen}
            onClose={() => setDialogOpen(false)}
            onSave={handleSavePeriodeProker}
            periodeProker={selectedPeriodeProker}
            mode={dialogMode}
          />
        </DashboardLayout>
      )}
    </RoleGuard>
  );
}
