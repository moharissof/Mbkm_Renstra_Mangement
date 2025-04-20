"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, RefreshCw } from "lucide-react"
import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import Link from "next/link"

export default function VerifyEmailPage() {
  const [email, setEmail] = useState<string | null>(null)
  const [isResending, setIsResending] = useState(false)
  const [resendMessage, setResendMessage] = useState("")
  const [resendCount, setResendCount] = useState(0)
  const [resendDisabled, setResendDisabled] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const supabase = createClientComponentClient()

  useEffect(() => {
    // Ambil email dari localStorage
    const storedEmail = localStorage.getItem("pendingVerificationEmail")
    if (storedEmail) {
      setEmail(storedEmail)
    }

    // Ambil jumlah dan waktu pengiriman ulang dari localStorage
    const storedCount = localStorage.getItem("resendCount")
    const storedTime = localStorage.getItem("lastResendTime")

    if (storedCount) {
      setResendCount(Number.parseInt(storedCount))
    }

    if (storedTime) {
      const lastTime = Number.parseInt(storedTime)
      const now = Date.now()
      const diff = now - lastTime

      // Jika kurang dari 60 detik, nonaktifkan tombol kirim ulang
      if (diff < 60000) {
        setResendDisabled(true)
        setCountdown(Math.ceil((60000 - diff) / 1000))

        // Mulai hitung mundur
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer)
              setResendDisabled(false)
              return 0
            }
            return prev - 1
          })
        }, 1000)

        return () => clearInterval(timer)
      }
    }
  }, [])

  // Fungsi untuk mengirim ulang email verifikasi
  async function resendVerificationEmail() {
    if (!email) {
      setResendMessage("Email tidak ditemukan. Silakan daftar kembali.")
      return
    }

    setIsResending(true)
    setResendMessage("")

    try {
      // Cek batas pengiriman (2 email per jam)
      const newCount = resendCount + 1
      if (newCount > 2) {
        setResendMessage("Anda telah mencapai batas pengiriman ulang (2 per jam). Silakan coba lagi nanti.")
        setIsResending(false)
        return
      }

      // Kirim permintaan pendaftaran ulang
      const { error } = await supabase.auth.signUp({
        email,
        password: "PLACEHOLDER", // Tidak akan digunakan
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        // Jika pengguna sudah terdaftar
        if (error.message.includes("already registered")) {
          // Gunakan OTP untuk mengirim email verifikasi baru
          const { error: otpError } = await supabase.auth.signInWithOtp({
            email,
            options: {
              shouldCreateUser: false,
            },
          })

          if (otpError) {
            setResendMessage(`Error: ${otpError.message}`)
          } else {
            // Update jumlah dan waktu pengiriman
            setResendCount(newCount)
            localStorage.setItem("resendCount", newCount.toString())
            localStorage.setItem("lastResendTime", Date.now().toString())

            // Nonaktifkan tombol untuk 60 detik
            setResendDisabled(true)
            setCountdown(60)

            const timer = setInterval(() => {
              setCountdown((prev) => {
                if (prev <= 1) {
                  clearInterval(timer)
                  setResendDisabled(false)
                  return 0
                }
                return prev - 1
              })
            }, 1000)

            setResendMessage("Email verifikasi telah dikirim! Silakan periksa inbox Anda.")
          }
        } else {
          setResendMessage(`Error: ${error.message}`)
        }
      } else {
        // Update jumlah dan waktu pengiriman
        setResendCount(newCount)
        localStorage.setItem("resendCount", newCount.toString())
        localStorage.setItem("lastResendTime", Date.now().toString())

        // Nonaktifkan tombol untuk 60 detik
        setResendDisabled(true)
        setCountdown(60)

        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer)
              setResendDisabled(false)
              return 0
            }
            return prev - 1
          })
        }, 1000)

        setResendMessage("Email verifikasi telah dikirim! Silakan periksa inbox Anda.")
      }
    } catch (error) {
      setResendMessage("Terjadi kesalahan. Silakan coba lagi.")
      console.error("Gagal mengirim ulang email verifikasi:", error)
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="mx-auto max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
            <Mail className="h-8 w-8 text-blue-500" />
          </div>
          <CardTitle className="text-2xl font-bold">Verifikasi Email Anda</CardTitle>
          <CardDescription className="text-gray-500">
            Kami telah mengirim tautan verifikasi ke {email || "email Anda"}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-4">
            Silakan periksa inbox Anda dan klik tautan verifikasi untuk menyelesaikan pendaftaran. Jika tidak menemukan email,
            periksa folder spam.
          </p>
          <div className="rounded-md bg-blue-50 p-4 text-sm text-blue-800">
            <p>Tautan verifikasi akan kedaluwarsa setelah beberapa waktu.</p>
          </div>

          {resendMessage && (
            <div
              className={`mt-4 rounded-md p-4 text-sm ${
                resendMessage.includes("Error") ? "bg-red-50 text-red-800" : "bg-green-50 text-green-800"
              }`}
            >
              <p>{resendMessage}</p>
            </div>
          )}

          {resendCount > 0 && (
            <div className="mt-4 text-sm text-gray-500">
              <p>Percobaan pengiriman ulang: {resendCount}/2 per jam</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button
            className="flex w-full items-center justify-center gap-2"
            onClick={resendVerificationEmail}
            disabled={isResending || resendDisabled}
          >
            <RefreshCw className="h-4 w-4" />
            {isResending
              ? "Mengirim..."
              : resendDisabled
                ? `Tunggu ${countdown} detik`
                : "Kirim Ulang Email Verifikasi"}
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/auth/register">Kembali ke Pendaftaran</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}