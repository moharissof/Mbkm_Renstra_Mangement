/* eslint-disable react/no-unescaped-entities */
"use client";

import type React from "react";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { Paperclip, Send } from "lucide-react";

interface ReportFormProps {
  programId: string;
  userId: string;
  initialProgress?: number; // Add initialProgress as an optional property
}

export default function ReportForm({ programId, userId }: ReportFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    laporan: "",
    realisasi: 0,
    link_file: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSliderChange = (value: number[]) => {
    setFormData((prev) => ({ ...prev, realisasi: value[0] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.laporan.trim()) {
      toast({
        title: "Error",
        description: "Isi laporan wajib diisi",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch(`/api/reports`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          program_kerja_id: programId,
          user_id: userId,
          ...formData,
        }),
      });

      if (!response.ok) {
        throw new Error("Gagal mengirim laporan");
      }

      toast({
        title: "Berhasil",
        description: "Laporan Anda telah terkirim",
      });

      // Reset form
      setFormData({
        laporan: "",
        realisasi: 0,
        link_file: "",
      });

      // Refresh the page to show the new report
      window.location.reload();
    } catch (error) {
      console.error("Error saat mengirim laporan:", error);
      toast({
        title: "Error",
        description: "Gagal mengirim laporan. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Buat Laporan Baru</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="laporan">Isi Laporan</Label>
            <Textarea
              id="laporan"
              name="laporan"
              placeholder="Bagikan progres, pencapaian, atau tantangan Anda..."
              value={formData.laporan}
              onChange={handleChange}
              rows={4}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="realisasi">Persentase Realisasi (%)</Label>
              <span className="text-sm font-medium">{formData.realisasi}%</span>
            </div>
            <Slider
              id="realisasi"
              min={0}
              max={100}
              step={1}
              value={[formData.realisasi]}
              onValueChange={handleSliderChange}
              className="py-4"
            />
          </div>

          <div className="space-y-2">
            <div className="flex flex-col gap-1">
              <Label htmlFor="link_file">Tautan File (Opsional)</Label>
              <p className="text-xs text-muted-foreground">
                <span className="font-medium">Petunjuk Google Drive:</span>
                <br />
                1. Buka{" "}
                <a
                  href="https://drive.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Google Drive
                </a>
                <br />
                2. Unggah file Anda
                <br />
                3. Klik kanan file → "Dapatkan tautan"
                <br />
                4. Pilih "Siapa saja dengan tautan ini"
                <br />
                5. Salin tautan dan tempel di bawah
              </p>
            </div>

            <div className="flex gap-2">
              <Input
                id="link_file"
                name="link_file"
                placeholder="Tempel tautan Google Drive Anda di sini"
                value={formData.link_file}
                onChange={handleChange}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() =>
                  window.open("https://drive.google.com", "_blank")
                }
                title="Buka Google Drive"
              >
                <Paperclip className="h-4 w-4" />
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              Pastikan file Anda sudah diatur ke "Siapa saja dengan tautan ini"
              di Google Drive
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2"
          >
            {isSubmitting ? "Mengirim..." : "Kirim Laporan"}
            <Send className="h-4 w-4" />
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
