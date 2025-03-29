import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldAlert, Phone } from "lucide-react"
import Link from "next/link"

export default function VerificationRequired() {
  // WhatsApp API configuration
  const adminPhoneNumber = "6285784161309" // Replace with your admin's WhatsApp number
  const defaultMessage = "Halo admin, saya ingin memverifikasi akun saya. Bisakah Anda membantu?"

  const whatsappUrl = `https://wa.me/${adminPhoneNumber}?text=${encodeURIComponent(defaultMessage)}`

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="mx-auto max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <ShieldAlert className="h-8 w-8 text-red-500" />
          </div>
          <CardTitle className="text-2xl font-bold">Verifikasi Diperlukan</CardTitle>
          <CardDescription className="text-gray-500">Akun Anda memerlukan verifikasi admin untuk melanjutkan</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-4">
            Anda tidak memiliki izin untuk mengakses halaman ini. Silakan hubungi administrator untuk memverifikasi akun Anda sebelum melanjutkan.
          </p>
          <div className="rounded-md bg-amber-50 p-4 text-sm text-amber-800">
            <p>Jika Anda merasa ini adalah kesalahan, silakan hubungi administrator sistem.</p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2 sm:flex-row">
          <Button className="w-full flex items-center gap-2" asChild>
            <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <Phone className="h-4 w-4" />
              Hubungi Admin via WhatsApp
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}