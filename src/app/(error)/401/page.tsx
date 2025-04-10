"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { AlertTriangle } from "lucide-react"

export default function UnauthorizedPage() {
  const router = useRouter()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="flex justify-center">
          <div className="rounded-full bg-red-100 p-4">
            <AlertTriangle className="h-12 w-12 text-red-600" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Access Denied</h2>
        <p className="mt-2 text-center text-gray-600">
          Ojo Macem - Macem Akses Seng Biso Kanggo Iro Hun Keplak rainiro
        </p>
        <div className="mt-6">
          <Button onClick={() => router.push("/")} className="w-full">
            Return to Dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}

