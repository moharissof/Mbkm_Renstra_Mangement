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
import type { SubRenstra } from "@/types/renstra"

interface SubRenstraDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (formData: Partial<SubRenstra>) => Promise<void>
  subRenstra: SubRenstra | null
  mode: "add" | "edit"
}

export function SubRenstraDialog({ isOpen, onClose, onSave, subRenstra, mode }: SubRenstraDialogProps) {
  const [formData, setFormData] = useState<Partial<SubRenstra>>({
    nama: "",
  })
  const [isSaving, setIsSaving] = useState(false)
  const { error } = useToast()

  // Reset form when dialog opens or subRenstra changes
  useEffect(() => {
    if (subRenstra && mode === "edit") {
      setFormData({
        nama: subRenstra.nama,
      })
    } else {
      setFormData({
        nama: "",
      })
    }
  }, [subRenstra, mode, isOpen])

  const handleChange = (field: keyof Partial<SubRenstra>, value: unknown) => {
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

    setIsSaving(true)
    try {
      await onSave(formData)
      onClose()
    } catch (error) {
      console.error("Error saving sub-renstra:", error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Add New Sub-Renstra" : "Edit Sub-Renstra"}</DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Add a new sub-strategic planning document."
              : "Edit the existing sub-strategic planning document."}
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
              placeholder="Enter sub-renstra name"
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
              "Add Sub-Renstra"
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

