/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Role } from "@/types/user"

// Define permissions for each role
const ROLE_PERMISSIONS: Record<Role, string[]> = {
  [Role.Admin]: [
    "users:read",
    "users:create",
    "users:update",
    "users:delete",
    "users:verify",
    "positions:read",
    "positions:create",
    "positions:update",
    "positions:delete",
    "dashboard:read",
    "reports:read",
    "reports:create",
    "settings:read",
    "settings:update",
  ],
  [Role.Ketua]: [
    "users:read",
    "users:verify",
    "positions:read",
    "dashboard:read",
    "reports:read",
    "reports:create",
    "settings:read",
  ],
  [Role.Waket_1]: ["users:read", "positions:read", "dashboard:read", "reports:read", "reports:create"],
  [Role.Waket_2]: ["users:read", "positions:read", "dashboard:read", "reports:read", "reports:create"],
  [Role.Kabag]: ["users:read", "dashboard:read", "reports:read", "reports:create"],
  [Role.Staff_Kabag]: ["dashboard:read", "reports:read"],
}

interface PermissionGuardProps {
  children: React.ReactNode
  requiredPermissions: string[]
  fallback?: React.ReactNode
}

export default function PermissionGuard({ children, requiredPermissions, fallback = null }: PermissionGuardProps) {
  const [hasPermission, setHasPermission] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkPermissions()
  }, [])

  async function checkPermissions() {
    try {
      // Panggil API check-role
      const response = await fetch("/api/auth/role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch role")
      }

      const { role } = await response.json()

      // Get permissions for this role
      const userPermissions = ROLE_PERMISSIONS[role as Role] || []

      // Check if user has all required permissions
      const hasAllPermissions = requiredPermissions.every((permission) => userPermissions.includes(permission))

      setHasPermission(hasAllPermissions)
    } catch (error) {
      console.error("Error checking permissions:", error)
      setHasPermission(false)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return null // Don't show loader for permission checks
  }

  return hasPermission ? children : fallback
}