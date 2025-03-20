import { create } from "zustand"
import { v4 as uuidv4 } from "uuid"

export type ToastVariant = "default" | "success" | "destructive" | "warning" | "info"

export type ToastAction = {
  label: string
  href?: string
  onClick?: () => void
}

export type Toast = {
  id: string
  title?: string
  description?: string
  variant?: ToastVariant
  duration?: number
  action?: ToastAction
}

type ToastStore = {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, "id">) => void
  removeToast: (id: string) => void
  removeAllToasts: () => void
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = uuidv4()
    set((state) => ({
      toasts: [
        ...state.toasts,
        {
          id,
          title: toast.title,
          description: toast.description,
          variant: toast.variant || "default",
          duration: toast.duration || 5000,
          action: toast.action,
        },
      ],
    }))

    // Auto-dismiss toast after duration
    if (toast.duration !== Number.POSITIVE_INFINITY) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }))
      }, toast.duration || 5000)
    }
  },
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }))
  },
  removeAllToasts: () => {
    set({ toasts: [] })
  },
}))

