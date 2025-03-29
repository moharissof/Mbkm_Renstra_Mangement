/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Check, X, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

interface ApprovalDialogProps {
  program: any;
  isOpen: boolean;
  onClose: () => void;
  onStatusChanged: () => void;
  approvalLevel: 1 | 2; // 1 for kabag, 2 for waket
}

export function ApprovalDialog({
  program,
  isOpen,
  onClose,
  onStatusChanged,
  approvalLevel,
}: ApprovalDialogProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);

  const handleApproval = async (approved: boolean) => {
    if (!program) return;

    setIsLoading(true);
    try {
      const endpoint = approvalLevel === 1 
        ? "/api/approve/kabag" 
        : "/api/approve/waket";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          programId: program.id, // Mengirim ID program dalam body
          status: approved,
          alasan_penolakan: !approved ? rejectionReason : null,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Gagal memproses approval");
      }

      const successMessage = approved
        ? approvalLevel === 1
          ? "Program berhasil disetujui dan akan dilanjutkan ke Wakil Ketua"
          : "Program berhasil disetujui"
        : "Program berhasil ditolak";

      toast({
        title: approved ? "Disetujui" : "Ditolak",
        description: successMessage,
        variant: approved ? "success" : "default",
      });

      onStatusChanged();
      onClose();
    } catch (error) {
      console.error("Error processing approval:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Gagal memproses approval",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsRejecting(false);
      setRejectionReason("");
    }
  };

  const getDialogContent = () => {
    if (isRejecting) {
      return (
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 bg-red-50 rounded-md border border-red-100">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-red-700">
              <p className="font-medium">Alasan Penolakan</p>
              <p>
                Silakan berikan alasan penolakan program kerja ini untuk
                memberikan feedback kepada pembuat program.
              </p>
            </div>
          </div>
          <Textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Masukkan alasan penolakan..."
            className="min-h-[100px]"
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsRejecting(false)}
              disabled={isLoading}
            >
              <X className="mr-2 h-4 w-4" />
              Batal
            </Button>
            <Button
              onClick={() => handleApproval(false)}
              disabled={isLoading || !rejectionReason}
              variant="destructive"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
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
                  <X className="mr-2 h-4 w-4" />
                  Tolak Program
                </>
              )}
            </Button>
          </div>
        </div>
      );
    }

    return (
      <>
        <div className="py-4">
          <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-md border border-amber-100">
            <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-amber-700">
              <p className="font-medium">Konfirmasi Approval</p>
              <p>
                {approvalLevel === 1
                  ? "Sebagai Kabag, Anda menyetujui program ini untuk dilanjutkan ke Wakil Ketua."
                  : "Sebagai Wakil Ketua, Anda menyetujui program ini untuk dilaksanakan."}
              </p>
            </div>
          </div>

          {program && (
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Detail Program:</h3>
              <p className="text-sm font-medium">{program.nama}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {program.point_renstra?.bidang?.nama}
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            <X className="mr-2 h-4 w-4" />
            Batal
          </Button>
          <Button
            variant="destructive"
            onClick={() => setIsRejecting(true)}
            disabled={isLoading}
          >
            <X className="mr-2 h-4 w-4" />
            Tolak
          </Button>
          <Button
            onClick={() => handleApproval(true)}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
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
                Setujui
              </>
            )}
          </Button>
        </div>
      </>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {approvalLevel === 1 ? "Approval Kabag" : "Approval Wakil Ketua"}
          </DialogTitle>
          <DialogDescription>
            {approvalLevel === 1
              ? "Anda akan menyetujui program ini untuk dilanjutkan ke Wakil Ketua"
              : "Anda akan menyetujui program ini untuk dilaksanakan"}
          </DialogDescription>
        </DialogHeader>

        {getDialogContent()}
      </DialogContent>
    </Dialog>
  );
}