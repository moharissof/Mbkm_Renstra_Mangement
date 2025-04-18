/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Loader2 } from "lucide-react"; // Import loader icon

export function VerificationDialog({
  program,
  isOpen,
  onClose,
  onVerify,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  program: any;
  isOpen: boolean;
  onClose: () => void;
  onVerify: (verified: boolean) => void;
  
}) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false); // State untuk loading
  const handleVerification = async (verified: boolean) => {
    setIsSubmitting(true); // Aktifkan loading
    try {
      await onVerify(verified); // Tunggu proses verifikasi selesai
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memverifikasi program",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false); // Matikan loading baik sukses maupun gagal
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Verifikasi Penyelesaian Program</DialogTitle>
          <DialogDescription>
            Program <strong>{program.nama}</strong> telah mencapai 100% progress.Dan telah diajukan untuk
            verifikasi. Verifikasi bahwa program ini benar-benar telah selesai?
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-500">Penanggung Jawab</h4>
            <p>{program.users?.name || "-"}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500">Laporan Terakhir</h4>
            <p>
              {program.laporan?.[0]?.created_at
                ? new Date(program.laporan[0].created_at).toLocaleDateString()
                : "-"}
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleVerification(false)}
            className="text-red-600 border-red-600 hover:bg-red-50"
            disabled={isSubmitting} // Disable tombol saat loading
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Memproses...
              </>
            ) : (
              "Tolak"
            )}
          </Button>
          <Button 
            onClick={() => handleVerification(true)}
            disabled={isSubmitting} // Disable tombol saat loading
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Memproses...
              </>
            ) : (
              "Verifikasi Selesai"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}