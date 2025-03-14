/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server"
import prisma, { serializeBigInt } from "@/lib/prisma"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    
    // Check if the request body is empty
    let body;
    try {
      body = await request.json()
    } catch (error) {
      console.error("Error parsing request body:", error)
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }

    // Validate required fields
    if (!body || !body.jabatan_id) {
      return NextResponse.json({ error: "Jabatan ID is required for verification" }, { status: 400 })
    }

    // Check if user exists
    const existingUser = await prisma.users.findUnique({
      where: { id },
    })

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if jabatan exists
    const jabatan = await prisma.jabatan.findUnique({
      where: { id: BigInt(body.jabatan_id) },
    })

    if (!jabatan) {
      return NextResponse.json({ error: "Jabatan not found" }, { status: 404 })
    }

    // Update user to verified status and set jabatan
    const updatedUser = await prisma.users.update({
      where: { id },
      data: {
        isVerified: true,
        jabatan_id: BigInt(body.jabatan_id),
        updated_at: new Date(),
      },
      include: {
        jabatan: true,
      },
    })

    // Remove password from response
    const { password, ...userWithoutPassword } = updatedUser

    // Serialize BigInt values before sending the response
    const serializedUser = serializeBigInt(userWithoutPassword)

    return NextResponse.json(serializedUser)
  } catch (error) {
    console.error("Error verifying user:", error)
    return NextResponse.json({ error: "Failed to verify user", details: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
