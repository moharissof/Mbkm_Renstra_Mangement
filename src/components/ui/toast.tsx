"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const ToastProvider = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "fixed top-4 right-4 z-[100] flex max-h-screen w-full flex-col-reverse gap-2 sm:max-w-[420px]",
        className,
      )}
      {...props}
    />
  ),
)
ToastProvider.displayName = "ToastProvider"

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full flex-col space-y-1 overflow-hidden rounded-lg border p-4 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full",
  {
    variants: {
      variant: {
        default: "border bg-white text-gray-800",
        success: "border-green-200 bg-green-50 text-green-800",
        destructive: "border-red-200 bg-red-50 text-red-800",
        warning: "border-yellow-200 bg-yellow-50 text-yellow-800",
        info: "border-blue-200 bg-blue-50 text-blue-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

const Toast = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> &
    VariantProps<typeof toastVariants> & {
      onClose?: () => void
    }
>(({ className, variant, onClose, ...props }, ref) => {
  return (
    <div ref={ref} className={cn(toastVariants({ variant }), className)} {...props}>
      {props.children}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute right-2 top-2 rounded-md p-1 text-gray-500 opacity-0 transition-opacity hover:text-gray-900 focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
})
Toast.displayName = "Toast"

const ToastTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("font-medium text-base leading-none tracking-tight", className)} {...props} />
  ),
)
ToastTitle.displayName = "ToastTitle"

const ToastDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("text-sm mt-1", className)} {...props} />,
)
ToastDescription.displayName = "ToastDescription"

const ToastAction = React.forwardRef<HTMLAnchorElement, React.ComponentPropsWithoutRef<"a">>(
  ({ className, children, ...props }, ref) => (
    <a ref={ref} className={cn("text-sm text-gray-500 mt-1 hover:underline", className)} {...props}>
      {children}
    </a>
  ),
)
ToastAction.displayName = "ToastAction"

export { Toast, ToastProvider, ToastTitle, ToastDescription, ToastAction }

