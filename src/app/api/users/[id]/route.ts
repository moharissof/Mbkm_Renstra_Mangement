/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Find user by ID with jabatan
    const user = await prisma.users.findUnique({
      where: { id },
      include: {
        jabatan: {
          include: {
            parent: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = user

    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()

    // Check if user exists
    const existingUser = await prisma.users.findUnique({
      where: { id },
    })

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if email is being changed and if it already exists
    if (body.email && body.email !== existingUser.email) {
      const emailExists = await prisma.users.findFirst({
        where: {
          email: body.email,
          id: { not: id },
        },
      })

      if (emailExists) {
        return NextResponse.json({ error: "Email already exists" }, { status: 400 })
      }
    }

    // Convert jabatan_id to BigInt if provided
    const jabatan_id = body.jabatan_id ? BigInt(body.jabatan_id) : undefined

    // Update user
    const updatedUser = await prisma.users.update({
      where: { id },
      data: {
        nikp: body.nikp !== undefined ? body.nikp : undefined,
        name: body.name !== undefined ? body.name : undefined,
        email: body.email !== undefined ? body.email : undefined,
        photo: body.photo !== undefined ? body.photo : undefined,
        no_telp: body.no_telp !== undefined ? body.no_telp : undefined,
        isVerified: body.isVerified !== undefined ? body.isVerified : undefined,
        password: body.password !== undefined ? body.password : undefined, // Note: In a real app, you should hash this password
        jabatan_id: jabatan_id !== undefined ? jabatan_id : undefined,
        last_login_at: body.last_login_at !== undefined ? body.last_login_at : undefined,
        updated_at: new Date(),
      },
      include: {
        jabatan: {
          include: {
            parent: true,
          },
        },
      },
    })

    // Remove password from response
    const { password, ...userWithoutPassword } = updatedUser

    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Check if user exists
    const existingUser = await prisma.users.findUnique({
      where: { id },
    })

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Delete user
    await prisma.users.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 })
  }
}

