"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/Dashboard/_layout";
import { DataTableCard } from "@/components/DataTable/CardTable";
import { createBidangColumns } from "./_component/Column"; // Ensure casing matches
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react"; // Only keep used imports
import { type Bidang, Role } from "@/types/user"; // Import Role
import { useToast } from "@/hooks/use-toast";
import { BidangDialog } from "./_component/Modal";
import RoleGuard from "@/middleware/RoleGuard";
import { PageLoader, TableLoader } from "@/components/ui/loader";

export default function BidangPage() {
  const [bidangList, setBidangList] = useState<Bidang[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Bidang dialog state
  const [bidangDialogOpen, setBidangDialogOpen] = useState(false);
  const [selectedBidang, setSelectedBidang] = useState<Bidang | null>(null);
  const [mode, setMode] = useState<"add" | "edit">("add");

  // Track if component is mounted

  // Fetch bidang data
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
        toast({
          title: "Error",
          description: "Gagal mengambil data bidang",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBidang();
  }, [toast]);

  // Handle add bidang
  const handleAddBidang = () => {
    setSelectedBidang(null);
    setMode("add");
    setBidangDialogOpen(true);
  };

  // Handle edit bidang
  const handleEditBidang = (bidang: Bidang) => {
    setSelectedBidang(bidang);
    setMode("edit");
    setBidangDialogOpen(true);
  };

  // Handle delete bidang
  const handleDeleteBidang = async (bidang: Bidang) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus bidang "${bidang.nama}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/bidang/${bidang.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete bidang");
      }

      toast({
        title: "Berhasil",
        description: `Bidang ${bidang.nama} telah dihapus`,
        variant: "success",
      });

      fetchBidang();
    } catch (error) {
      console.error("Error deleting bidang:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to delete bidang",
        variant: "destructive",
      });
    }
  };

  // Handle save bidang (add/edit)
  const handleSaveBidang = async (formData: Partial<Bidang>) => {
    try {
      if (mode === "add") {
        const response = await fetch("/api/bidang", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to create bidang");
        }

        toast({
          title: "Berhasil",
          description: `Bidang ${formData.nama} telah dibuat`,
          variant: "success",
        });
      } else if (selectedBidang) {
        const response = await fetch(`/api/bidang/${selectedBidang.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to update bidang");
        }

        toast({
          title: "Berhasil",
          description: `Bidang ${formData.nama} telah diperbarui`,
          variant: "success",
        });
      }

      fetchBidang();
    } catch (error) {
      console.error("Error saving bidang:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to save bidang",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Create columns with the actions
  const bidangColumns = createBidangColumns(handleEditBidang, handleDeleteBidang);

  return (
    <RoleGuard allowedRoles={[Role.Admin]}>
      {loading && bidangList.length === 0 ? (
        <DashboardLayout>
          <PageLoader />
        </DashboardLayout>
      ) : (
        <DashboardLayout>
          <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">Bidang</h1>
                <p className="text-gray-500 mt-1">
                  Kelola bidang dalam struktur organisasi
                </p>
              </div>
              <Button onClick={handleAddBidang}>
                <PlusCircle className="mr-2 h-4 w-4" /> Tambah Bidang
              </Button>
            </div>

            {loading && bidangList.length > 0 ? (
              <TableLoader />
            ) : (
              <DataTableCard
                columns={bidangColumns}
                data={bidangList}
                title="Manajemen Bidang"
                description="Kelola bidang dalam struktur organisasi."
                searchColumn="nama"
                searchPlaceholder="Cari bidang..."
                extraActions={
                  <Button size="sm" className="h-10" onClick={handleAddBidang}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Bidang Baru
                  </Button>
                }
              />
            )}
          </div>

          {/* Bidang Dialog for Add/Edit */}
          <BidangDialog
            isOpen={bidangDialogOpen}
            onClose={() => setBidangDialogOpen(false)}
            onSave={handleSaveBidang}
            bidang={selectedBidang}
            mode={mode}
          />
        </DashboardLayout>
      )}
    </RoleGuard>
  );
}

function fetchBidang() {
    throw new Error("Function not implemented.");
}
