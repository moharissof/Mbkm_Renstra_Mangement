/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { PlayCircle, AlertCircle } from "lucide-react"
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

interface StartProgramDialogProps {
  program: any
  isOpen: boolean
  onClose: () => void
  onProgramStarted: (program: any) => void
}

export function StartProgramDialog({ program, isOpen, onClose, onProgramStarted }: StartProgramDialogProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const handleStartProgram = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/unlock/${program.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to start program")
      }

      const updatedProgram = await response.json()
      onProgramStarted(updatedProgram)
      onClose()
    } catch (error) {
      console.error("Error starting program:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to start program",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Start Program</DialogTitle>
          <DialogDescription>
            Are you ready to start working on this program? This will change the status to "On_Progress".
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="rounded-lg bg-blue-50 p-4 border border-blue-100">
            <h3 className="font-medium text-blue-800 mb-2">{program?.nama}</h3>
            <p className="text-sm text-blue-700">
              {program?.deskripsi?.substring(0, 100)}
              {program?.deskripsi?.length > 100 ? "..." : ""}
            </p>
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">Important Note</p>
                <p className="text-muted-foreground">
                  Once you start this program, you'll need to regularly update its progress until completion.
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleStartProgram} disabled={loading}>
            {loading ? (
              "Starting..."
            ) : (
              <>
                <PlayCircle className="mr-2 h-4 w-4" />
                Start Program
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

