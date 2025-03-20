"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { type Bidang } from "@/types/user";

interface BidangDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: Partial<Bidang>) => Promise<void>;
  bidang: Bidang | null;
  mode: "add" | "edit";
}

export function BidangDialog({
  isOpen,
  onClose,
  onSave,
  bidang,
  mode,
}: BidangDialogProps) {
  const [formData, setFormData] = useState<Partial<Bidang>>({
    nama: "",
    deskripsi: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Reset form when dialog opens or bidang changes
  useEffect(() => {
    if (bidang && mode === "edit") {
      setFormData({
        nama: bidang.nama,
        deskripsi: bidang.deskripsi || "",
      });
    } else {
      setFormData({
        nama: "",
        deskripsi: "",
      });
    }
  }, [bidang, mode, isOpen]);

  const handleChange = (field: keyof Partial<Bidang>, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.nama) {
      toast({
        title: "Nama bidang diperlukan",
        description: "Silakan masukkan nama bidang",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("Error saving bidang:", error);
      toast({
        title: "Error",
        description: "Gagal menyimpan bidang",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Tambah Bidang Baru" : "Edit Bidang"}</DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Tambahkan bidang baru ke dalam struktur organisasi."
              : "Edit detail bidang yang sudah ada."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Nama Bidang */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="nama" className="text-right">
              Nama <span className="text-red-500">*</span>
            </Label>
            <Input
              id="nama"
              value={formData.nama}
              onChange={(e) => handleChange("nama", e.target.value)}
              className="col-span-3"
              placeholder="Masukkan nama bidang"
            />
          </div>

          {/* Deskripsi */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="deskripsi" className="text-right">
              Deskripsi
            </Label>
            <Textarea
              id="deskripsi"
              value={formData.deskripsi || ""}
              onChange={(e) => handleChange("deskripsi", e.target.value)}
              className="col-span-3"
              placeholder="Deskripsi singkat tentang bidang ini"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Batal
          </Button>
          <Button onClick={handleSubmit} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : mode === "add" ? (
              "Tambah Bidang"
            ) : (
              "Simpan Perubahan"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}