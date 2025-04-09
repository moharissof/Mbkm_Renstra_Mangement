"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Save } from "lucide-react"

interface PasswordFormProps {
  userId: string
}

export function PasswordForm({ userId }: PasswordFormProps) {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate form
      if (!formData.currentPassword) {
        throw new Error("Kata sandi saat ini tidak boleh kosong")
      }

      if (!formData.newPassword) {
        throw new Error("Kata sandi baru tidak boleh kosong")
      }

      if (formData.newPassword.length < 8) {
        throw new Error("Kata sandi baru minimal 8 karakter")
      }

      if (formData.newPassword !== formData.confirmPassword) {
        throw new Error("Konfirmasi kata sandi tidak cocok")
      }

      // Update password
      const response = await fetch(`/api/profile/${userId}/password/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Gagal memperbarui kata sandi")
      }

      // Reset form
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })

      toast({
        title: "Kata sandi berhasil diperbarui",
        description: "Kata sandi Anda telah diperbarui",
        variant: "success",
      })
    } catch (error) {
      console.error("Error updating password:", error)
      toast({
        title: "Gagal memperbarui kata sandi",
        description: error instanceof Error ? error.message : "Terjadi kesalahan saat memperbarui kata sandi",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="currentPassword" className="text-right">
            Kata Sandi Saat Ini <span className="text-red-500">*</span>
          </Label>
          <Input
            id="currentPassword"
            name="currentPassword"
            type="password"
            value={formData.currentPassword}
            onChange={handleChange}
            className="col-span-3"
            placeholder="Masukkan kata sandi saat ini"
            required
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="newPassword" className="text-right">
            Kata Sandi Baru <span className="text-red-500">*</span>
          </Label>
          <Input
            id="newPassword"
            name="newPassword"
            type="password"
            value={formData.newPassword}
            onChange={handleChange}
            className="col-span-3"
            placeholder="Masukkan kata sandi baru"
            required
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="confirmPassword" className="text-right">
            Konfirmasi Kata Sandi <span className="text-red-500">*</span>
          </Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="col-span-3"
            placeholder="Konfirmasi kata sandi baru"
            required
          />
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
              Perbarui Kata Sandi
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
