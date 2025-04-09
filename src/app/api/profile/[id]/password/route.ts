/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { createClient } from "@/lib/supabase/server"


type Params = Promise<{ id: string }>;

export async function POST(request: Request, { params }: { params: Params } ) {
  try {
    const supabase = await createClient()
    const id = (await params).id
    const body = await request.json()
    const { currentPassword, newPassword } = body
    // Check if user exists
    const user = await prisma.users.findUnique({
      where: { id: id},
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Verify current password
    const isPasswordValid = currentPassword === user.password

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 })
    }

    // Hash new password
    // Update password in Supabase Auth
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    })
    
    if (error) {
      console.error("Supabase auth update error:", error)
      return NextResponse.json({ error: "Failed to update password in authentication system" }, { status: 500 })
    }
    // Update password
    await prisma.users.update({
      where: { id: id },
      data: {
        password: newPassword,
        updated_at: new Date(),
      },
    })
    console.log("Password updated successfully", newPassword)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error changing password:", error)
    return NextResponse.json({ error: "Failed to change password" }, { status: 500 })
  }
}
