/* eslint-disable @typescript-eslint/no-unused-vars */
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

interface FileEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  file: { file: string; link_drive: string } | null
  onEdit: (updatedFile: { file: string; link_drive: string }) => Promise<void>
}

export function FileEditDialog({ open, onOpenChange, file, onEdit }: FileEditDialogProps) {
  const { toast } = useToast()
  const [fileName, setFileName] = useState("")
  const [fileLink, setFileLink] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (file) {
      setFileName(file.file || "")
      setFileLink(file.link_drive || "")
    }
  }, [file])

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    if (!fileName || !fileLink) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      await onEdit({
        file: fileName,
        link_drive: fileLink,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update file",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!file) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit File</DialogTitle>
          <DialogDescription>Update the file details.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="fileName">File Name</Label>
            <Input
              id="fileName"
              placeholder="example.pdf"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fileLink">File Link</Label>
            <Input
              id="fileLink"
              placeholder="https://drive.google.com/file/..."
              value={fileLink}
              onChange={(e) => setFileLink(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

