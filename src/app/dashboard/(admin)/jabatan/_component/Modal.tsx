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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { type Jabatan, Role, type Bidang } from "@/types/user";

interface PositionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: Partial<Jabatan>) => Promise<void>;
  position: Jabatan | null;
  mode: "add" | "edit";
  allPositions: Jabatan[];
  bidangList: Bidang[];
}

export function PositionDialog({
  isOpen,
  onClose,
  onSave,
  position,
  mode,
  allPositions,
  bidangList,
}: PositionDialogProps) {
  const [formData, setFormData] = useState<Partial<Jabatan>>({
    nama: "",
    deskripsi: "",
    role: Role.Staff_Kabag,
    bidang_id: null,
    parent_id: null,
  });
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Reset form when dialog opens or position changes
  useEffect(() => {
    if (position && mode === "edit") {
      setFormData({
        nama: position.nama,
        deskripsi: position.deskripsi || "",
        role: position.role,
        bidang_id: position.bidang_id,
        parent_id: position.parent_id || null,
      });
    } else {
      setFormData({
        nama: "",
        deskripsi: "",
        role: Role.Staff_Kabag,
        bidang_id: null,
        parent_id: null,
      });
    }
  }, [position, mode, isOpen]);

  const handleChange = (field: keyof Partial<Jabatan>, value: string | Role | Bidang | bigint | null) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value === "none" ? null : value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.nama) {
      toast({
        title: "Nama jabatan diperlukan",
        description: "Silakan masukkan nama jabatan",
        variant: "destructive",
      });
      return;
    }

    if (!formData.role) {
      toast({
        title: "Role diperlukan",
        description: "Silakan pilih role untuk jabatan ini",
        variant: "destructive",
      });
      return;
    }

    if (!formData.bidang_id) {
      toast({
        title: "Bidang diperlukan",
        description: "Silakan pilih bidang untuk jabatan ini",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      await onSave({
        ...formData,
        bidang_id: formData.bidang_id,
      });
      onClose();
    } catch (error) {
      console.error("Error saving position:", error);
      toast({
        title: "Error",
        description: "Gagal menyimpan jabatan",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Filter out the current position from parent options to prevent circular references
  const parentOptions = allPositions.filter((p) => {
    if (mode === "edit" && position) {
      return p.id.toString() !== position.id.toString() && p.parent_id?.toString() !== position.id.toString();
    }
    return true;
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Tambah Jabatan Baru" : "Edit Jabatan"}</DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Tambahkan jabatan baru ke dalam struktur organisasi."
              : "Edit detail jabatan yang sudah ada."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Nama Jabatan */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="nama" className="text-right">
              Nama <span className="text-red-500">*</span>
            </Label>
            <Input
              id="nama"
              value={formData.nama}
              onChange={(e) => handleChange("nama", e.target.value)}
              className="col-span-3"
              placeholder="Masukkan nama jabatan"
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
              placeholder="Deskripsi singkat tentang jabatan ini"
              rows={3}
            />
          </div>

          {/* Role */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">
              Role <span className="text-red-500">*</span>
            </Label>
            <Select value={formData.role} onValueChange={(value) => handleChange("role", value as Role)}>
              <SelectTrigger id="role" className="col-span-3">
                <SelectValue placeholder="Pilih role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={Role.Admin}>Admin</SelectItem>
                <SelectItem value={Role.Ketua}>Ketua</SelectItem>
                <SelectItem value={Role.Waket_1}>Wakil Ketua 1</SelectItem>
                <SelectItem value={Role.Waket_2}>Wakil Ketua 2</SelectItem>
                <SelectItem value={Role.Kabag}>Kepala Bagian</SelectItem>
                <SelectItem value={Role.Staff_Kabag}>Staff Kabag</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bidang */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="bidang" className="text-right">
              Bidang <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.bidang_id?.toString() || ""}
              onValueChange={(value) => handleChange("bidang_id", BigInt(value))}
            >
              <SelectTrigger id="bidang" className="col-span-3">
                <SelectValue placeholder="Pilih bidang" />
              </SelectTrigger>
              <SelectContent>
                {bidangList.map((bidang) => (
                  <SelectItem key={bidang.id.toString()} value={bidang.id.toString()}>
                    {bidang.nama}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Jabatan Atasan */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="parent" className="text-right">
              Jabatan Atasan
            </Label>
            <Select
              value={formData.parent_id?.toString() || "none"}
              onValueChange={(value) => handleChange("parent_id", value === "none" ? null : BigInt(value))}
            >
              <SelectTrigger id="parent" className="col-span-3">
                <SelectValue placeholder="Pilih jabatan atasan (opsional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Tidak Ada</SelectItem>
                {parentOptions.map((p) => (
                  <SelectItem key={p.id.toString()} value={p.id.toString()}>
                    {p.nama}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              "Tambah Jabatan"
            ) : (
              "Simpan Perubahan"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}