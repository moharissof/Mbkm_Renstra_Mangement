/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import type { Renstra, PeriodeRenstra } from "@/types/renstra"

interface RenstraDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (formData: Partial<Renstra>) => Promise<void>
  renstra: Renstra | null
  mode: "add" | "edit"
  periodes: PeriodeRenstra[]
}

export function RenstraDialog({ isOpen, onClose, onSave, renstra, mode, periodes }: RenstraDialogProps) {
  const [formData, setFormData] = useState<Partial<Renstra>>({
    nama: "",
    periode_id: "",
  })
  const [isSaving, setIsSaving] = useState(false)
  const { error } = useToast()

  // Reset form when dialog opens or renstra changes
  useEffect(() => {
    if (renstra && mode === "edit") {
      setFormData({
        nama: renstra.nama,
        periode_id: renstra.periode_id.toString(),
      })
    } else {
      setFormData({
        nama: "",
        periode_id: periodes.length > 0 ? periodes[0].id.toString() : "",
      })
    }
  }, [renstra, mode, isOpen, periodes])

  const handleChange = (field: keyof Partial<Renstra>, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async () => {
    // Validate form
    if (!formData.nama) {
      error("Validation Error", "Name is required")
      return
    }

    if (!formData.periode_id) {
      error("Validation Error", "Period is required")
      return
    }

    setIsSaving(true)
    try {
      await onSave(formData)
      onClose()
    } catch (error) {
      console.error("Error saving renstra:", error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Add New Renstra" : "Edit Renstra"}</DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Add a new strategic planning document."
              : "Edit the existing strategic planning document."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="nama" className="text-right">
              Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="nama"
              value={formData.nama}
              onChange={(e) => handleChange("nama", e.target.value)}
              className="col-span-3"
              placeholder="Enter renstra name"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="periode_id" className="text-right">
              Period <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.periode_id?.toString()}
              onValueChange={(value) => handleChange("periode_id", value)}
            >
              <SelectTrigger id="periode_id" className="col-span-3">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                {periodes.map((periode) => (
                  <SelectItem key={periode.id.toString()} value={periode.id.toString()}>
                    {periode.nama} ({periode.tahun_awal}-{periode.tahun_akhir})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : mode === "add" ? (
              "Add Renstra"
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

