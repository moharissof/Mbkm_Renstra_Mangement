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
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import type { PeriodeProker } from "@/types/proker"
import { format } from "date-fns"

interface PeriodeProkerDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (formData: Partial<PeriodeProker>) => Promise<void>
  periodeProker: PeriodeProker | null
  mode: "add" | "edit"
}

export function PeriodeProkerDialog({ isOpen, onClose, onSave, periodeProker, mode }: PeriodeProkerDialogProps) {
  const [formData, setFormData] = useState<Partial<PeriodeProker>>({
    tahun: "",
    tanggal_mulai: new Date(),
    tanggal_selesai: new Date(),
  })
  const [isSaving, setIsSaving] = useState(false)
  const { error } = useToast()

  // Reset form when dialog opens or periodeProker changes
  useEffect(() => {
    if (periodeProker && mode === "edit") {
      setFormData({
        tahun: periodeProker.tahun,
        tanggal_mulai: new Date(periodeProker.tanggal_mulai),
        tanggal_selesai: new Date(periodeProker.tanggal_selesai),
      })
    } else {
      const currentYear = new Date().getFullYear()
      setFormData({
        tahun: currentYear.toString(),
        tanggal_mulai: new Date(currentYear, 0, 1), // January 1st of current year
        tanggal_selesai: new Date(currentYear, 11, 31), // December 31st of current year
      })
    }
  }, [periodeProker, mode, isOpen])

  const handleChange = (field: keyof Partial<PeriodeProker>, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async () => {
    // Validate form
    if (!formData.tahun) {
      error("Validation Error", "Year is required")
      return
    }

    if (!formData.tanggal_mulai) {
      error("Validation Error", "Start date is required")
      return
    }

    if (!formData.tanggal_selesai) {
      error("Validation Error", "End date is required")
      return
    }

    // Validate that end date is after start date
    if (new Date(formData.tanggal_mulai!) > new Date(formData.tanggal_selesai!)) {
      error("Validation Error", "End date must be after start date")
      return
    }

    setIsSaving(true)
    try {
      await onSave(formData)
      onClose()
    } catch (error) {
      console.error("Error saving program period:", error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Add New Program Period" : "Edit Program Period"}</DialogTitle>
          <DialogDescription>
            {mode === "add" ? "Add a new program work period." : "Edit the existing program work period."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tahun" className="text-right">
              Year <span className="text-red-500">*</span>
            </Label>
            <Input
              id="tahun"
              value={formData.tahun}
              onChange={(e) => handleChange("tahun", e.target.value)}
              className="col-span-3"
              placeholder="Enter year (e.g., 2024)"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tanggal_mulai" className="text-right">
              Start Date <span className="text-red-500">*</span>
            </Label>
            <Input
              id="tanggal_mulai"
              type="date"
              value={formData.tanggal_mulai ? format(new Date(formData.tanggal_mulai), "yyyy-MM-dd") : ""}
              onChange={(e) => handleChange("tanggal_mulai", new Date(e.target.value))}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tanggal_selesai" className="text-right">
              End Date <span className="text-red-500">*</span>
            </Label>
            <Input
              id="tanggal_selesai"
              type="date"
              value={formData.tanggal_selesai ? format(new Date(formData.tanggal_selesai), "yyyy-MM-dd") : ""}
              onChange={(e) => handleChange("tanggal_selesai", new Date(e.target.value))}
              className="col-span-3"
            />
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
              "Add Period"
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

