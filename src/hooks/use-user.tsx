"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/utils/supabaseClient"
import { User, Role } from "@/types/user"


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

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadUser() {
      try {
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser()

        if (!authUser) {
          setUser(null)
          return
        }

        const { data, error } = await supabase
          .from("users")
          .select(`
            *,
            jabatan:jabatan_id (
              *,
              parent:parent_id (*)
            )
          `)
          .eq("id", authUser.id)
          .single()

        if (error) {
          console.error("Error fetching user data:", error)
          setUser(null)
          return
        }

        setUser(data as User)
      } catch (error) {
        console.error("Error in useUser hook:", error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    loadUser()

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        loadUser()
      } else if (event === "SIGNED_OUT") {
        setUser(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  function hasPermission(permission: string): boolean {
    if (!user?.jabatan?.role) return false
    const userRole = user.jabatan.role as Role
    return ROLE_PERMISSIONS[userRole]?.includes(permission) || false
  }

  async function signOut() {
    await supabase.auth.signOut()
    setUser(null)
  }

  return {
    user,
    loading,
    hasPermission,
    signOut,
    isAdmin: user?.jabatan?.role === Role.Admin,
  }
}

