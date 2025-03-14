/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"
import prisma, { serializeBigInt } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    // Get URL and search params
    const { searchParams } = new URL(request.url)

    // Get query parameters
    const query = searchParams.get("query")?.toLowerCase() || ""
    const role = searchParams.get("role")
    const bidang = searchParams.get("bidang")
    const jabatanId = searchParams.get("jabatan_id") ? BigInt(searchParams.get("jabatan_id")!) : undefined
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    // Build filter conditions
    const where: any = {}

    if (query) {
      where.OR = [
        { name: { contains: query, mode: "insensitive" } },
        { email: { contains: query, mode: "insensitive" } },
        { nikp: { contains: query, mode: "insensitive" } },
      ]
    }

    if (jabatanId) {
      where.jabatan_id = jabatanId
    }

    // If role or bidang is specified, filter by jabatan
    if (role || bidang) {
      where.jabatan = {}

      if (role) {
        where.jabatan.role = role
      }

      if (bidang) {
        where.jabatan.bidang = bidang
      }
    }

    // Get total count for pagination
    const total = await prisma.users.count({ where })

    // Fetch users with their jabatan
    const users = await prisma.users.findMany({
      where,
      include: {
        jabatan: {
          include: {
            parent: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: {
        name: "asc",
      },
    })

    // Serialize BigInt values before sending the response
    const serializedData = serializeBigInt({
      users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    })

    // Return response
    return NextResponse.json(serializedData)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.email || !body.no_telp || !body.password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if email already exists
    const existingUser = await prisma.users.findFirst({
      where: { email: body.email },
    })

    if (existingUser) {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 })
    }

    // Convert jabatan_id to BigInt if provided
    const jabatan_id = body.jabatan_id ? BigInt(body.jabatan_id) : null

    // Create new user
    const newUser = await prisma.users.create({
      data: {
        nikp: body.nikp || null,
        name: body.name,
        email: body.email,
        photo: body.photo || null,
        no_telp: body.no_telp,
        isVerified: body.isVerified || false,
        password: body.password, // Note: In a real app, you should hash this password
        jabatan_id: jabatan_id,
        last_login_at: body.last_login_at || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      include: {
        jabatan: true,
      },
    })

    // Remove password from response
    const { password, ...userWithoutPassword } = newUser

    // Serialize BigInt values before sending the response
    const serializedUser = serializeBigInt(userWithoutPassword)

    return NextResponse.json(serializedUser, { status: 201 })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}

