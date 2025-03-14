import { useToastStore, type Toast } from "./use-toast-store"

type ToastOptions = Omit<Toast, "id">

export function useToast() {
  const { addToast, removeToast, removeAllToasts, toasts } = useToastStore()

  return {
    toast: (options: ToastOptions) => {
      addToast(options)
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

