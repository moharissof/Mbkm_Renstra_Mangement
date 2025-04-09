/* eslint-disable @next/next/no-img-element */
"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Save, Upload } from "lucide-react"
import type { User } from "@/types/user"

interface ProfileFormProps {
  user: User
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    nikp: user.nikp || "",
    no_telp: user.no_telp || "",
    photo: user.photo || "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(user.photo || null)
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setPhotoFile(file)

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate form
      if (!formData.name) {
        throw new Error("Nama tidak boleh kosong")
      }

      if (!formData.email) {
        throw new Error("Email tidak boleh kosong")
      }

      if (!formData.no_telp) {
        throw new Error("Nomor telepon tidak boleh kosong")
      }

      // Upload photo if changed
      let photoUrl = formData.photo
      if (photoFile) {
        const uploadFormData = new FormData()
        uploadFormData.append("file", photoFile)

        const uploadResponse = await fetch("/api/upload/profile-photo", {
          method: "POST",
          body: uploadFormData,
        })

        if (!uploadResponse.ok) {
          throw new Error("Gagal mengunggah foto profil")
        }

        const uploadData = await uploadResponse.json()
        photoUrl = uploadData.url
      }

      // Update profile
      const response = await fetch(`/api/profile/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          photo: photoUrl,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Gagal memperbarui profil")
      }

      toast({
        title: "Profil berhasil diperbarui",
        description: "Informasi profil Anda telah diperbarui",
        variant: "success",
      })
      window.location.reload() // Reload the page to reflect changes
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Gagal memperbarui profil",
        description: error instanceof Error ? error.message : "Terjadi kesalahan saat memperbarui profil",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div className="h-24 w-24 rounded-full bg-blue-600 flex items-center justify-center overflow-hidden border-4 border-white shadow-md">
              <img
                src={photoPreview || user.photo || "/images/orang.png"}
                alt={user.name}
                className="h-full w-full object-cover"
              />
            </div>
            <label
              htmlFor="photo-upload"
              className="absolute bottom-0 right-0 bg-white rounded-full p-1.5 shadow-md cursor-pointer hover:bg-gray-100"
            >
              <Upload className="h-4 w-4" />
              <input id="photo-upload" type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
            </label>
          </div>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Nama <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="col-span-3"
            placeholder="Masukkan nama lengkap"
            required
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="email" className="text-right">
            Email <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="col-span-3"
            placeholder="Masukkan alamat email"
            required
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="nikp" className="text-right">
            NIKP
          </Label>
          <Input
            id="nikp"
            name="nikp"
            value={formData.nikp}
            onChange={handleChange}
            className="col-span-3"
            placeholder="Masukkan NIKP (opsional)"
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="no_telp" className="text-right">
            No. Telepon <span className="text-red-500">*</span>
          </Label>
          <Input
            id="no_telp"
            name="no_telp"
            value={formData.no_telp}
            onChange={handleChange}
            className="col-span-3"
            placeholder="Masukkan nomor telepon"
            required
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right">Jabatan</Label>
          <div className="col-span-3">
            <div className="p-2.5 bg-gray-50 border border-gray-200 rounded-md text-gray-500">
              {user.jabatan?.nama || "Tidak ada jabatan"} <span className="text-xs">(tidak dapat diubah)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Simpan Perubahan
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
