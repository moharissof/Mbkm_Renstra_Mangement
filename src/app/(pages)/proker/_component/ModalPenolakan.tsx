/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { X, AlertCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface RejectionReasonModalProps {
  program: any
  isOpen: boolean
  onClose: () => void
}

export function RejectionReasonModal({ program, isOpen, onClose }: RejectionReasonModalProps) {
  if (!program) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Alasan Penolakan</DialogTitle>
          <DialogDescription>Program kerja ini ditolak dengan alasan berikut:</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="flex items-start gap-3 p-3 bg-red-50 rounded-md border border-red-100">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-red-700">
              <p className="font-medium">Catatan Penolakan:</p>
              <p>
                {program.alasan_penolakan ||
                  "Program tidak memenuhi kriteria yang ditetapkan. Silakan periksa kembali detail program dan pastikan sesuai dengan pedoman yang berlaku."}
              </p>
            </div>
          </div>

          {program && (
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Detail Program:</h3>
              <p className="text-sm font-medium">{program.nama}</p>
              <p className="text-xs text-muted-foreground mt-1">{program.point_renstra?.bidang?.nama}</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={onClose}>
            <X className="mr-2 h-4 w-4" />
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
