import { useToastStore, type Toast, type ToastAction } from "./use-toast-store"

type ToastOptions = Omit<Toast, "id">

export function useToast() {
  const { addToast, removeToast, removeAllToasts, toasts } = useToastStore()

  return {
    toast: (options: ToastOptions) => {
      addToast(options)
    },
    success: (title: string, description?: string, action?: ToastAction) => {
      addToast({
        title,
        description,
        variant: "success",
        action,
      })
    },
    error: (title: string, description?: string, action?: ToastAction) => {
      addToast({
        title,
        description,
        variant: "destructive",
        action,
      })
    },
    warning: (title: string, description?: string, action?: ToastAction) => {
      addToast({
        title,
        description,
        variant: "warning",
        action,
      })
    },
    info: (title: string, description?: string, action?: ToastAction) => {
      addToast({
        title,
        description,
        variant: "info",
        action,
      })
    },
    dismiss: (id: string) => {
      removeToast(id)
    },
    dismissAll: () => {
      removeAllToasts()
    },
    toasts,
  }
}

