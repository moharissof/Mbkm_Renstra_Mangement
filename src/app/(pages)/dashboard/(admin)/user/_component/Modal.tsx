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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import type { User, Jabatan } from "@/types/user";
import { Switch } from "@/components/ui/switch";

interface UserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: Partial<User>) => Promise<void>;
  user: User | null;
  mode: "add" | "edit";
  jabatan: Jabatan[];
}

export function UserDialog({ isOpen, onClose, onSave, user, mode, jabatan }: UserDialogProps) {
  const [formData, setFormData] = useState<Partial<User>>({
    name: "",
    email: "",
    nikp: "",
    no_telp: "",
    isVerified: false,
    jabatan_id: null,
  });
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Reset form when dialog opens or user changes
  useEffect(() => {
    if (user && mode === "edit") {
      setFormData({
        name: user.name,
        email: user.email,
        nikp: user.nikp || "",
        no_telp: user.no_telp,
        isVerified: user.isVerified,
        jabatan_id: user.jabatan_id ? user.jabatan_id.toString() : null, // Konversi ke string
      });
    } else {
      setFormData({
        name: "",
        email: "",
        nikp: "",
        no_telp: "",
        isVerified: false,
        jabatan_id: null,
      });
    }
  }, [user, mode, isOpen]);

  const handleChange = (field: keyof Partial<User>, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value === "none" ? null : value, // Handle "none" value
    }));
  };

  const handleSubmit = async () => {
    // Validate form
    if (!formData.name) {
      toast({
        title: "Nama diperlukan",
        description: "Silakan masukkan nama pengguna",
        variant: "destructive",
      });
      return;
    }

    if (!formData.email) {
      toast({
        title: "Email diperlukan",
        description: "Silakan masukkan email pengguna",
        variant: "destructive",
      });
      return;
    }

    if (!formData.no_telp) {
      toast({
        title: "Nomor telepon diperlukan",
        description: "Silakan masukkan nomor telepon pengguna",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      // Konversi jabatan_id ke string sebelum dikirim ke backend
      const dataToSave = {
        ...formData,
        jabatan_id: formData.jabatan_id ? formData.jabatan_id.toString() : null,
      };

      await onSave(dataToSave);
      onClose();
    } catch (error) {
      console.error("Error saving user:", error);
      toast({
        title: "Error",
        description: "Gagal menyimpan pengguna",
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
          <DialogTitle>{mode === "add" ? "Tambah Pengguna Baru" : "Edit Pengguna"}</DialogTitle>
          <DialogDescription>
            {mode === "add" ? "Tambahkan pengguna baru ke dalam sistem." : "Edit informasi pengguna yang sudah ada."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nama <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="col-span-3"
              placeholder="Masukkan nama pengguna"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="col-span-3"
              placeholder="email@example.com"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="nikp" className="text-right">
              NIKP
            </Label>
            <Input
              id="nikp"
              value={formData.nikp || ""}
              onChange={(e) => handleChange("nikp", e.target.value)}
              className="col-span-3"
              placeholder="Nomor Induk Kepegawaian"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="no_telp" className="text-right">
              No. Telepon <span className="text-red-500">*</span>
            </Label>
            <Input
              id="no_telp"
              value={formData.no_telp}
              onChange={(e) => handleChange("no_telp", e.target.value)}
              className="col-span-3"
              placeholder="Nomor telepon"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="jabatan" className="text-right">
              Jabatan
            </Label>
            <Select
              value={formData.jabatan_id?.toString() || ""}
              onValueChange={(value) => handleChange("jabatan_id", value || null)}
            >
              <SelectTrigger id="jabatan" className="col-span-3">
                <SelectValue placeholder="Pilih jabatan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Tidak Ada</SelectItem>
                {jabatan.map((item) => (
                  <SelectItem key={item.id.toString()} value={item.id.toString()}>
                    {item.nama}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="isVerified" className="text-right">
              Status Verifikasi
            </Label>
            <div className="flex items-center space-x-2 col-span-3">
              <Switch
                id="isVerified"
                checked={formData.isVerified}
                onCheckedChange={(checked) => handleChange("isVerified", checked)}
              />
              <Label htmlFor="isVerified" className="cursor-pointer">
                {formData.isVerified ? "Terverifikasi" : "Belum Terverifikasi"}
              </Label>
            </div>
          </div>

          {mode === "add" && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                Password <span className="text-red-500">*</span>
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password || ""}
                onChange={(e) => handleChange("password", e.target.value)}
                className="col-span-3"
                placeholder="Masukkan password"
              />
            </div>
          )}
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
              "Tambah Pengguna"
            ) : (
              "Simpan Perubahan"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}