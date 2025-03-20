"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FaGoogle } from "react-icons/fa"
import type { LoginData } from "@/types/auth"
import { supabase } from "@/utils/supabaseClient"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password } as LoginData),
      })

      const data = await response.json()
      console.log(data)
      if (!response.ok) {
        throw new Error(data.error || "Login failed")
      }

      // Handle successful login
      router.push("/")
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred during login")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    })

    if (error) {
      setError(error.message)
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left side - Image */}
      <div className="relative hidden w-1/2 lg:block">
        <Image
          src="/images/ilustrasi.png"
          alt="Authentication"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Right side - Form */}
      <div className="flex w-full items-center justify-center bg-white px-6 lg:w-1/2">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-primary p-3">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-semibold tracking-tight">Login to your account</h2>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button variant="outline" className="relative w-full py-6 text-black" onClick={handleGoogleSignIn}>
            <FaGoogle className="absolute left-4 h-5 w-5" />
            Login with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                placeholder="Enter your email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 px-4"
                required
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 px-4"
                required
              />
            </div>
            <Button
              type="submit"
              className="h-12 w-full bg-primary text-base font-semibold hover:bg-purple-700"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <div className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-semibold text-primary hover:text-purple-700">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

