/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface ProgramKerjaFormProps {
  pointRenstra: any;
  periode: any;
  programKerja?: any;
  onSubmit: (data: any) => Promise<void>;
  mode: "create" | "edit";
}

export function ProgramKerjaForm({
  pointRenstra,
  periode,
  programKerja,
  onSubmit,
  mode,
}: ProgramKerjaFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null); // State untuk menyimpan data user

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/auth/user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const { user: userData } = await response.json();
        setUser(userData); // Simpan data user ke state
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, []);

  // Initialize form with default values or existing data
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues:
      mode === "edit" && programKerja
        ? {
            nama: programKerja.nama,
            deskripsi: programKerja.deskripsi || "",
            strategi_pencapaian: programKerja.strategi_pencapaian || "",
            baseline: programKerja.baseline || "",
            waktu_mulai: programKerja.waktu_mulai
              ? format(new Date(programKerja.waktu_mulai), "yyyy-MM-dd")
              : "",
            waktu_selesai: programKerja.waktu_selesai
              ? format(new Date(programKerja.waktu_selesai), "yyyy-MM-dd")
              : "",
            anggaran: programKerja.anggaran
              ? Number(programKerja.anggaran)
              : "",
            volume: programKerja.volume || 1,
            indikator_proker: programKerja.indikator_proker || [
              { nama: "", target: "", satuan: "" },
            ],
            point_standar:
              programKerja.point_standar?.map((ps: any) => ps.id) || [],
          }
        : {
            nama: "",
            deskripsi: "",
            strategi_pencapaian: "",
            baseline: "",
            waktu_mulai: periode?.tanggal_mulai
              ? format(new Date(periode.tanggal_mulai), "yyyy-MM-dd")
              : "",
            waktu_selesai: periode?.tanggal_selesai
              ? format(new Date(periode.tanggal_selesai), "yyyy-MM-dd")
              : "",
            anggaran: "",
            volume: 1,
            indikator_proker: [{ nama: "", target: "", satuan: "" }],
            point_standar: [{ nama: "", point: 0 }],
          },
  });

  // Field array for dynamic indikator_proker fields
  const {
    fields: indikatorFields,
    append: appendIndikator,
    remove: removeIndikator,
  } = useFieldArray({
    control,
    name: "indikator_proker",
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "point_standar",
  });

  const onFormSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      // Prepare data for submission
      const formData = {
        ...data,
        point_renstra_id: pointRenstra.id,
        periode_proker_id: periode.id,
        user_id: user?.id, // Gunakan user.id dari state
        status: "Draft", // Default status for new programs
        progress: 0, // Default progress for new programs
        anggaran: data.anggaran ? data.anggaran.toString() : null,
        volume: Number(data.volume),
        waktu_mulai: new Date(data.waktu_mulai),
        waktu_selesai: new Date(data.waktu_selesai),
        point_standar: data.point_standar.map((ps: any) => ({
          nama: ps.nama,
          point: Number(ps.point),
        })),
      };

      await onSubmit(formData);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Detail Program</CardTitle>
            <CardDescription>
              Masukkan informasi dasar tentang program
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nama">
                  Nama Program <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="nama"
                  placeholder="Masukkan nama program"
                  {...register("nama", {
                    required: "Nama program wajib diisi",
                  })}
                />
                {errors.nama && (
                  <p className="text-sm text-red-500">
                    {errors.nama.message as string}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="deskripsi">Deskripsi</Label>
                <Textarea
                  id="deskripsi"
                  placeholder="Masukkan deskripsi program"
                  rows={3}
                  {...register("deskripsi")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="strategi_pencapaian">Strategi Pencapaian</Label>
                <Textarea
                  id="strategi_pencapaian"
                  placeholder="Masukkan strategi pencapaian"
                  rows={3}
                  {...register("strategi_pencapaian")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="baseline">Baseline</Label>
                <Input
                  id="baseline"
                  placeholder="Masukkan baseline"
                  {...register("baseline")}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="waktu_mulai">
                    Tanggal Mulai <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="waktu_mulai"
                    type="date"
                    {...register("waktu_mulai", {
                      required: "Tanggal mulai wajib diisi",
                    })}
                  />
                  {errors.waktu_mulai && (
                    <p className="text-sm text-red-500">
                      {errors.waktu_mulai.message as string}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="waktu_selesai">
                    Tanggal Selesai <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="waktu_selesai"
                    type="date"
                    {...register("waktu_selesai", {
                      required: "Tanggal selesai wajib diisi",
                    })}
                  />
                  {errors.waktu_selesai && (
                    <p className="text-sm text-red-500">
                      {errors.waktu_selesai.message as string}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="anggaran">Anggaran (Rp)</Label>
                  <Input
                    id="anggaran"
                    type="number"
                    placeholder="Masukkan jumlah anggaran"
                    {...register("anggaran", {
                      valueAsNumber: true,
                      validate: (value) =>
                        !value ||
                        Number(value) >= 0 ||
                        "Anggaran harus berupa angka positif",
                    })}
                  />
                  {errors.anggaran && (
                    <p className="text-sm text-red-500">
                      {errors.anggaran.message as string}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="volume">
                    Volume <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="volume"
                    type="number"
                    min="1"
                    {...register("volume", {
                      required: "Volume wajib diisi",
                      valueAsNumber: true,
                      validate: (value) =>
                        value > 0 || "Volume harus lebih besar dari 0",
                    })}
                  />
                  {errors.volume && (
                    <p className="text-sm text-red-500">
                      {errors.volume.message as string}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Indikator Program</CardTitle>
            <CardDescription>
              Tambahkan satu atau lebih indikator untuk program ini
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {indikatorFields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-1 gap-4 p-4 border rounded-md relative"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`indikator_proker.${index}.nama`}>
                      Nama Indikator <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id={`indikator_proker.${index}.nama`}
                      placeholder="Masukkan nama indikator"
                      {...register(`indikator_proker.${index}.nama` as const, {
                        required: "Nama indikator wajib diisi",
                      })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`indikator_proker.${index}.target`}>
                      Target <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id={`indikator_proker.${index}.target`}
                      placeholder="Masukkan target"
                      {...register(
                        `indikator_proker.${index}.target` as const,
                        {
                          required: "Target wajib diisi",
                        }
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`indikator_proker.${index}.satuan`}>
                      Satuan <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id={`indikator_proker.${index}.satuan`}
                      placeholder="Masukkan satuan (contoh: %, orang, dokumen)"
                      {...register(
                        `indikator_proker.${index}.satuan` as const,
                        {
                          required: "Satuan wajib diisi",
                        }
                      )}
                    />
                  </div>
                </div>

                {indikatorFields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 text-red-500 hover:text-red-700"
                    onClick={() => removeIndikator(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() =>
                appendIndikator({ nama: "", target: "", satuan: "" })
              }
            >
              <Plus className="mr-2 h-4 w-4" /> Tambah Indikator
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Point Standar</CardTitle>
            <CardDescription>
              Tambahkan satu atau lebih point standar untuk program ini
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-1 gap-4 p-4 border rounded-md relative"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`point_standar.${index}.nama`}>
                      Nama Point <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id={`point_standar.${index}.nama`}
                      placeholder="Masukkan nama point standar"
                      {...register(`point_standar.${index}.nama` as const, {
                        required: "Nama point wajib diisi",
                      })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`point_standar.${index}.point`}>
                      Nilai Point <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id={`point_standar.${index}.point`}
                      type="number"
                      placeholder="Masukkan nilai point"
                      {...register(`point_standar.${index}.point` as const, {
                        required: "Nilai point wajib diisi",
                        valueAsNumber: true,
                        validate: (value) =>
                          value > 0 || "Nilai point harus lebih besar dari 0",
                      })}
                    />
                  </div>
                </div>

                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 text-red-500 hover:text-red-700"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => append({ nama: "", point: 0 })}
            >
              <Plus className="mr-2 h-4 w-4" /> Tambah Point Standar
            </Button>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {mode === "create" ? "Membuat..." : "Memperbarui..."}
              </>
            ) : mode === "create" ? (
              "Buat Program"
            ) : (
              "Perbarui Program"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
