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
import type { PointRenstra, SubRenstra} from "@/types/renstra"
import type { Bidang } from "@/types/user"
import { Slider } from "@/components/ui/slider"

interface PointRenstraDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (formData: Partial<PointRenstra>) => Promise<void>
  pointRenstra: PointRenstra | null
  mode: "add" | "edit"
  bidangOptions: Bidang[]
  subRenstra: SubRenstra | null
}

export function PointRenstraDialog({
  isOpen,
  onClose,
  onSave,
  pointRenstra,
  mode,
  bidangOptions,
  subRenstra,
}: PointRenstraDialogProps) {
  const [formData, setFormData] = useState<Partial<PointRenstra>>({
    nama: "",
    presentase: 0,
    bidang_id: "",
  })
  const [isSaving, setIsSaving] = useState(false)
  const { error } = useToast()

  // Reset form when dialog opens or pointRenstra changes
  useEffect(() => {
    if (pointRenstra && mode === "edit") {
      setFormData({
        nama: pointRenstra.nama,
        presentase: pointRenstra.presentase || 0,
        bidang_id: pointRenstra.bidang_id.toString(),
      })
    } else {
      setFormData({
        nama: "",
        presentase: 0,
        bidang_id: bidangOptions.length > 0 ? bidangOptions[0].id.toString() : "",
      })
    }
  }, [pointRenstra, mode, isOpen, bidangOptions])

  const handleChange = (field: keyof Partial<PointRenstra>, value: unknown) => {
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

    if (!formData.bidang_id) {
      error("Validation Error", "Department is required")
      return
    }

    setIsSaving(true)
    try {
      await onSave(formData)
      onClose()
    } catch (error) {
      console.error("Error saving point-renstra:", error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Add New Point Renstra" : "Edit Point Renstra"}</DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? `Add a new point to "${subRenstra?.nama}".`
              : `Edit the existing point in "${subRenstra?.nama}".`}
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
              placeholder="Enter point name"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="bidang_id" className="text-right">
              Department <span className="text-red-500">*</span>
            </Label>
            <Select value={formData.bidang_id?.toString()} onValueChange={(value) => handleChange("bidang_id", value)}>
              <SelectTrigger id="bidang_id" className="col-span-3">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {bidangOptions.map((bidang) => (
                  <SelectItem key={bidang.id.toString()} value={bidang.id.toString()}>
                    {bidang.nama} 
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="presentase" className="text-right">
              Completion %
            </Label>
            <div className="col-span-3 flex items-center gap-4">
              <Slider
                id="presentase"
                value={[formData.presentase || 0]}
                min={0}
                max={100}
                step={1}
                className="flex-1"
                onValueChange={(values) => handleChange("presentase", values[0])}
              />
              <div className="w-12 text-center font-medium">{formData.presentase || 0}%</div>
            </div>
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
              "Add Point"
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

