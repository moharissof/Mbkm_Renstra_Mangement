"use client"

import { useEffect, useState } from "react"
import { useToastStore } from "@/hooks/use-toast-store"
import { Toast, ToastProvider, ToastTitle, ToastDescription } from "@/components/ui/toast"
import { ToastIcon } from "@/components/ui/toast-icon"

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <ToastProvider>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          variant={toast.variant}
          onClose={() => removeToast(toast.id)}
          className="flex items-start gap-3"
        >
          <ToastIcon variant={toast.variant} />
          <div className="flex-1">
            {toast.title && <ToastTitle>{toast.title}</ToastTitle>}
            {toast.description && <ToastDescription>{toast.description}</ToastDescription>}
          </div>
        </Toast>
      ))}
    </ToastProvider>
  )
}

