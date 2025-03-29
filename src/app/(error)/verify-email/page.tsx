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
    // Get the email from localStorage
    const storedEmail = localStorage.getItem("pendingVerificationEmail")
    if (storedEmail) {
      setEmail(storedEmail)
    }

    // Get the resend count and time from localStorage
    const storedCount = localStorage.getItem("resendCount")
    const storedTime = localStorage.getItem("lastResendTime")

    if (storedCount) {
      setResendCount(Number.parseInt(storedCount))
    }

    if (storedTime) {
      const lastTime = Number.parseInt(storedTime)
      const now = Date.now()
      const diff = now - lastTime

      // If less than 60 seconds have passed, disable resend and show countdown
      if (diff < 60000) {
        setResendDisabled(true)
        setCountdown(Math.ceil((60000 - diff) / 1000))

        // Start countdown timer
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

  // Function to resend verification email
  async function resendVerificationEmail() {
    if (!email) {
      setResendMessage("No email found. Please register again.")
      return
    }

    setIsResending(true)
    setResendMessage("")

    try {
      // Check if we've hit the rate limit (2 emails per hour) [^3]
      const newCount = resendCount + 1
      if (newCount > 2) {
        setResendMessage("You've reached the maximum number of resend attempts (2 per hour). Please try again later.")
        setIsResending(false)
        return
      }

      // Send sign-up request again to trigger a new confirmation email
      const { error } = await supabase.auth.signUp({
        email,
        password: "PLACEHOLDER", // This won't be used as the user already exists
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        // If user already exists, this is expected
        if (error.message.includes("already registered")) {
          // Use OTP sign-in to send a new verification email
          const { error: otpError } = await supabase.auth.signInWithOtp({
            email,
            options: {
              shouldCreateUser: false,
            },
          })

          if (otpError) {
            setResendMessage(`Error: ${otpError.message}`)
          } else {
            // Update resend count and time
            setResendCount(newCount)
            localStorage.setItem("resendCount", newCount.toString())
            localStorage.setItem("lastResendTime", Date.now().toString())

            // Disable resend button for 60 seconds
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

            setResendMessage("Verification email sent! Please check your inbox.")
          }
        } else {
          setResendMessage(`Error: ${error.message}`)
        }
      } else {
        // Update resend count and time
        setResendCount(newCount)
        localStorage.setItem("resendCount", newCount.toString())
        localStorage.setItem("lastResendTime", Date.now().toString())

        // Disable resend button for 60 seconds
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

        setResendMessage("Verification email sent! Please check your inbox.")
      }
    } catch (error) {
      setResendMessage("An unexpected error occurred. Please try again.")
      console.error("Error resending verification email:", error)
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
          <CardTitle className="text-2xl font-bold">Verify Your Email</CardTitle>
          <CardDescription className="text-gray-500">
            We&lsquo;ve sent a verification link to {email || "your email"}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-4">
            Please check your inbox and click the verification link to complete your registration. If you don&#39;t see the
            email, check your spam folder.
          </p>
          <div className="rounded-md bg-blue-50 p-4 text-sm text-blue-800">
            <p>The verification link will expire after a period of time.</p>
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
              <p>Resend attempts: {resendCount}/2 per hour</p>
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
              ? "Sending..."
              : resendDisabled
                ? `Resend available in ${countdown}s`
                : "Resend Verification Email"}
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/auth/register">Back to Registration</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

