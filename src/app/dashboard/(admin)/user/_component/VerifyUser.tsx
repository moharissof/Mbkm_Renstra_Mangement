"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import type { Jabatan } from "@/types/user"

interface VerifyUserDialogProps {
  isOpen: boolean
  onClose: () => void
  onVerify: (jabatanId: string) => Promise<void>
  user: {
    id: string
    name: string
    email: string
  }
  jabatan: Jabatan[]
}

export function VerifyUserDialog({ isOpen, onClose, onVerify, user, jabatan }: VerifyUserDialogProps) {
  const [selectedJabatan, setSelectedJabatan] = useState<string>("")
  const [isVerifying, setIsVerifying] = useState(false)
  const { toast } = useToast()

  const handleVerify = async () => {
    if (!selectedJabatan) {
      toast({
        title: "Jabatan diperlukan",
        description: "Silakan pilih jabatan untuk pengguna ini",
        variant: "destructive",
      })
      return
    }

    setIsVerifying(true)
    try {
      await onVerify(selectedJabatan)
      toast({
        title: "Pengguna berhasil diverifikasi",
        description: `${user.name} telah diverifikasi dan jabatan telah ditetapkan`,
        variant: "success",
      })
      onClose()
    } catch (error) {
      console.error("Error verifying user:", error)
      toast({
        title: "Gagal memverifikasi pengguna",
        description:
          error instanceof Error
            ? `Error: ${error.message}`
            : "Terjadi kesalahan saat memverifikasi pengguna. Silakan coba lagi.",
        variant: "destructive",
      })
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Verifikasi Pengguna</DialogTitle>
          <DialogDescription>
            Tetapkan jabatan untuk pengguna ini untuk menyelesaikan proses verifikasi.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <h4 className="font-medium">Pengguna</h4>
            <div className="rounded-md bg-gray-50 p-3">
              <div className="font-medium">{user.name}</div>
              <div className="text-sm text-gray-500">{user.email}</div>
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="jabatan"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Jabatan <span className="text-red-500">*</span>
            </label>
            <Select value={selectedJabatan} onValueChange={setSelectedJabatan}>
              <SelectTrigger id="jabatan" className="w-full">
                <SelectValue placeholder="Pilih jabatan" />
              </SelectTrigger>
              <SelectContent>
                {jabatan.map((item) => (
                  <SelectItem key={item.id.toString()} value={item.id.toString()}>
                    {item.nama}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isVerifying}>
            Batal
          </Button>
          <Button onClick={handleVerify} disabled={isVerifying || !selectedJabatan}>
            {isVerifying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Memverifikasi...
              </>
            ) : (
              "Verifikasi Pengguna"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

