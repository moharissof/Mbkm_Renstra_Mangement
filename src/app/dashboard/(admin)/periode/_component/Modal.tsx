"use client";

import { useEffect, useState } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { type PeriodeRenstra } from "@/types/renstra";

interface PeriodeRenstraDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: Partial<PeriodeRenstra>) => Promise<void>;
  periodeRenstra: PeriodeRenstra | null;
  mode: "add" | "edit";
}

export function PeriodeRenstraDialog({
  isOpen,
  onClose,
  onSave,
  periodeRenstra,
  mode,
}: PeriodeRenstraDialogProps) {
  const [formData, setFormData] = useState<Partial<PeriodeRenstra>>({
    nama: "",
    tahun_awal: 0,
    tahun_akhir: 0,
  });
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Reset form when dialog opens or periodeRenstra changes
  useEffect(() => {
    if (periodeRenstra && mode === "edit") {
      setFormData({
        nama: periodeRenstra.nama,
        tahun_awal: periodeRenstra.tahun_awal,
        tahun_akhir: periodeRenstra.tahun_akhir,
      });
    } else {
      setFormData({
        nama: "",
        tahun_awal: 0,
        tahun_akhir: 0,
      });
    }
  }, [periodeRenstra, mode, isOpen]);

  const handleChange = (field: keyof Partial<PeriodeRenstra>, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.nama || !formData.tahun_awal || !formData.tahun_akhir) {
      toast({
        title: "Data tidak lengkap",
        description: "Silakan lengkapi semua field",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("Error saving periode renstra:", error);
      toast({
        title: "Error",
        description: "Gagal menyimpan periode renstra",
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
          <DialogTitle>{mode === "add" ? "Tambah Periode Renstra Baru" : "Edit Periode Renstra"}</DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Tambahkan periode renstra baru ke dalam sistem."
              : "Edit detail periode renstra yang sudah ada."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="nama" className="text-right">
              Nama <span className="text-red-500">*</span>
            </Label>
            <Input
              id="nama"
              value={formData.nama}
              onChange={(e) => handleChange("nama", e.target.value)}
              className="col-span-3"
              placeholder="Masukkan nama periode renstra"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tahun_awal" className="text-right">
              Tahun Awal <span className="text-red-500">*</span>
            </Label>
            <Input
              id="tahun_awal"
              type="number"
              value={formData.tahun_awal}
              onChange={(e) => handleChange("tahun_awal", parseInt(e.target.value))}
              className="col-span-3"
              placeholder="Masukkan tahun awal"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tahun_akhir" className="text-right">
              Tahun Akhir <span className="text-red-500">*</span>
            </Label>
            <Input
              id="tahun_akhir"
              type="number"
              value={formData.tahun_akhir}
              onChange={(e) => handleChange("tahun_akhir", parseInt(e.target.value))}
              className="col-span-3"
              placeholder="Masukkan tahun akhir"
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
              "Tambah Periode Renstra"
            ) : (
              "Simpan Perubahan"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}