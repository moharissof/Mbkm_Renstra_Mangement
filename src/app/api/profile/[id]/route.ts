/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server"
import prisma, { serializeBigInt } from "@/lib/prisma"
type Params = Promise<{ id: string }>;
export async function GET(request: Request, { params }: { params: Params }) {
  try {
    // Check if ID is valid
    const id = (await params).id
    // Find user by ID with jabatan
    const user = await prisma.users.findUnique({
      where: { id: id },
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

    // Serialize BigInt values before sending the response
    const serializedUser = serializeBigInt(userWithoutPassword)

    return NextResponse.json(serializedUser)
  } catch (error) {
    console.error("Error fetching profile:", error)
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Params } )  {
  try {
    const id = (await params).id
    const body = await request.json()
    // Check if user exists
    const existingUser = await prisma.users.findUnique({
      where: { id: id },
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

    // Update user (only allowed fields)
    const updatedUser = await prisma.users.update({
      where: { id: id },
      data: {
        nikp: body.nikp !== undefined ? body.nikp : undefined,
        name: body.name !== undefined ? body.name : undefined,
        email: body.email !== undefined ? body.email : undefined,
        photo: body.photo !== undefined ? body.photo : undefined,
        no_telp: body.no_telp !== undefined ? body.no_telp : undefined,
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

    // Serialize BigInt values before sending the response
    const serializedUser = serializeBigInt(userWithoutPassword)

    return NextResponse.json(serializedUser)
  } catch (error) {
    console.error("Error updating profile:", error)
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}
