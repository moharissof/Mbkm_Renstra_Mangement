import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoaderProps {
  size?: "sm" | "md" | "lg"
  className?: string
  text?: string
}

export function Loader({ size = "md", className, text }: LoaderProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  }

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
      {text && <p className="mt-2 text-sm text-gray-500">{text}</p>}
    </div>
  )
}

export function PageLoader() {
  return (
    <div className="flex h-[calc(100vh-64px)] items-center justify-center">
      <div className="flex flex-col items-center">
        <Loader size="lg" text="Memuat data..." />
        <p className="mt-4 text-xs text-gray-400">Jika loader tidak hilang, coba refresh halaman</p>
      </div>
    </div>
  )
}

export function TableLoader() {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-8">
      <div className="flex flex-col items-center justify-center py-12">
        <Loader size="lg" text="Memuat data..." />
      </div>
    </div>
  )
}

