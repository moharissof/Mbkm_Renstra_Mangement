import { CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'

type ToastIconProps = {
  variant?: "default" | "success" | "destructive" | "warning" | "info"
  className?: string
}

export function ToastIcon({ variant = "default", className }: ToastIconProps) {
  const iconClasses = "h-5 w-5"
  
  switch (variant) {
    case "success":
      return <CheckCircle className={`text-green-600 ${iconClasses} ${className}`} />
    case "destructive":
      return <AlertCircle className={`text-red-600 ${iconClasses} ${className}`} />
    case "warning":
      return <AlertTriangle className={`text-yellow-600 ${iconClasses} ${className}`} />
    case "info":
      return <Info className={`text-blue-600 ${iconClasses} ${className}`} />
    default:
      return <Info className={`text-gray-600 ${iconClasses} ${className}`} />
  }
}
