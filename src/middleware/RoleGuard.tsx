/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { PageLoader } from "@/components/ui/loader"
import type { Role } from "@/types/user"

interface RoleGuardProps {
  children: React.ReactNode
  allowedRoles: Role[]
}

export default function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const router = useRouter()
  const [hasAccess, setHasAccess] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAccess()
  }, [])

  async function checkAccess() {
    try {
      // Panggil API check-role
      const response = await fetch("/api/auth/role", {
        method: "POST",
      })

      // Jika response tidak OK, lempar error
      if (!response.ok) {
        throw new Error("Failed to fetch role")
      }

      // Parse data dari response
      const { role } = await response.json()

      // Periksa apakah role pengguna termasuk dalam allowedRoles
      if (role && allowedRoles.includes(role as Role)) {
        setHasAccess(true)
      } else {
        // Jika role tidak diizinkan, arahkan ke halaman unauthorized
        router.push("/error/401")
      }
    } catch (error) {
      console.error("Error checking access:", error)
      // Jika terjadi error, arahkan ke halaman login
      router.push("/login")
    } finally {
      setLoading(false)
    }
  }

  // Tampilkan loader saat proses pengecekan sedang berlangsung
  if (loading) {
    return <PageLoader />
  }

  // Render children jika pengguna memiliki akses
  return hasAccess ? children : null
}