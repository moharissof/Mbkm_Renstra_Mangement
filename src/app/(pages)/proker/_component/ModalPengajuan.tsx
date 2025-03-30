/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Check, X, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface StatusChangeDialogProps {
  program: any;
  isOpen: boolean;
  role: string;
  onClose: () => void;
  onStatusChanged: () => void;
}

export function StatusChangeDialog({
  program,
  isOpen,
  role,
  onClose,
  onStatusChanged,
}: StatusChangeDialogProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleStatusChange = async () => {
    if (!program) return;
    const status = role === "Kabag" ? "Menunggu_Approve_Waket" : "Planning";
    setIsLoading(true);
    try {
      const response = await fetch(`/api/proker/${program.id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: status,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update program status");
      }

      toast({
        title: "Status Updated",
        description: "Program status has been changed to Planning",
        variant: "success",
      });

      onStatusChanged();
      onClose();
    } catch (error) {
      console.error("Error updating program status:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update program status",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ubah Status Program</DialogTitle>
          <DialogDescription>
            Apakah Anda yakin ingin mengubah status dari Draft ke Perencanaan?
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-md border border-amber-100">
            <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-amber-700">
              <p className="font-medium">Catatan Penting:</p>
              <p>
                Mengubah status ke Perencanaan berarti program siap untuk
                ditinjau. Anda tidak akan dapat mengembalikannya ke Draft.
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

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            <X className="mr-2 h-4 w-4" />
            Batal
          </Button>
          <Button onClick={handleStatusChange} disabled={isLoading}>
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
                Ubah ke Perencanaan
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
