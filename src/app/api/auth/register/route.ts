import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import { headers } from "next/headers";

import type { RegisterData } from "@/types/auth"

export async function POST(req: Request) {
  try {
    const body: RegisterData = await req.json()
    const { name, email, password } = body
    const origin = (await headers()).get("origin");

    const supabase = createClient()

    // Register user with Supabase Auth
    const { data: authData, error: authError } = await (await supabase).auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/api/auth/callback`,
        data: {
          name,
        },
      },
    })

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    if (!authData.user) {
      return NextResponse.json({ error: "User registration failed" }, { status: 400 })
    }

    // Create user in Prisma database 
    const users = await prisma.users.create({
      data: {
        id: authData.user.id,
        name,
        email,
        no_telp: "", // Add appropriate value for no_telp
        password, // Assuming you want to store the same password
      },
    })

    return NextResponse.json({ users }, { status: 201 })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

