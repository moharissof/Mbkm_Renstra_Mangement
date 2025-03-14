/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"
import prisma, { serializeBigInt } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    // Get URL and search params
    const { searchParams } = new URL(request.url)

    // Get query parameters
    const role = searchParams.get("role")
    const bidang = searchParams.get("bidang")
    const parentId = searchParams.get("parent_id") ? BigInt(searchParams.get("parent_id")!) : undefined

    // Build filter conditions
    const where: any = {}

    if (role) {
      where.role = role
    }

    if (bidang) {
      where.bidang = bidang
    }

    if (parentId !== undefined) {
      where.parent_id = parentId
    }

    // Get all jabatan (positions)
    const jabatan = await prisma.jabatan.findMany({
      where,
      include: {
        parent: true,
        children: true,
      },
      orderBy: {
        nama: "asc",
      },
    })

    // Serialize BigInt values before sending the response
    const serializedJabatan = serializeBigInt(jabatan)

    return NextResponse.json(serializedJabatan)
  } catch (error) {
    console.error("Error fetching jabatan:", error)
    return NextResponse.json({ error: "Failed to fetch jabatan" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.nama || !body.role || !body.bidang) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Convert parent_id to BigInt if provided
    const parent_id = body.parent_id ? BigInt(body.parent_id) : null

    // Create new jabatan
    const newJabatan = await prisma.jabatan.create({
      data: {
        nama: body.nama,
        deskripsi: body.deskripsi || null,
        role: body.role,
        parent_id: parent_id,
        bidang: body.bidang,
        created_at: new Date(),
        updated_at: new Date(),
      },
      include: {
        parent: true,
      },
    })

    // Serialize BigInt values before sending the response
    const serializedJabatan = serializeBigInt(newJabatan)

    return NextResponse.json(serializedJabatan, { status: 201 })
  } catch (error) {
    console.error("Error creating jabatan:", error)
    return NextResponse.json({ error: "Failed to create jabatan" }, { status: 500 })
  }
}

