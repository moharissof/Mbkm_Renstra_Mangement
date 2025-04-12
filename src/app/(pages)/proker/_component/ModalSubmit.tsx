/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { Check, X, RefreshCw } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface ResubmitProgramModalProps {
  program: any
  isOpen: boolean
  onClose: () => void
  onResubmitted: () => void
}

export function ResubmitProgramModal({ program, isOpen, onClose, }: ResubmitProgramModalProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleResubmit = async () => {
    if (!program) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/proker/${program.id}/resubmit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "Planning",
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to resubmit program")
      }

      toast({
        title: "Program Resubmitted",
        description: "Program has been resubmitted for review",
        variant: "success",
      })
      onClose()
    } catch (error) {
      console.error("Error resubmitting program:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to resubmit program",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Submit Ulang Program</DialogTitle>
          <DialogDescription>Ajukan kembali program yang telah ditolak untuk ditinjau ulang</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-md border border-blue-100 mb-4">
            <RefreshCw className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-700">
              <p className="font-medium">Catatan Penting:</p>
              <p>
                Pastikan Anda telah memperbaiki program sesuai dengan alasan penolakan sebelumnya. Program yang diajukan
                ulang akan kembali ke status Perencanaan.
              </p>
            </div>
          </div>

          {program && (
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">Detail Program:</h3>
              <p className="text-sm font-medium">{program.nama}</p>
              <p className="text-xs text-muted-foreground mt-1">{program.point_renstra?.bidang?.nama}</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            <X className="mr-2 h-4 w-4" />
            Batal
          </Button>
          <Button onClick={handleResubmit} disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Memproses...
              </span>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Submit Ulang
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
