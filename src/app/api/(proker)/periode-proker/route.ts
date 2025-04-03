/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"
import prisma, { serializeBigInt } from "@/lib/prisma"



export async function GET(request: Request) {
  try {
    // Get URL and search params
    const { searchParams } = new URL(request.url)

    // Get query parameters
    const query = searchParams.get("query")?.toLowerCase() || ""
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    // Build filter conditions
    const where: any = {}

    if (query) {
      where.OR = [{ tahun: { contains: query, mode: "insensitive" } }]
    }

    // Get total count for pagination
    const total = await prisma.periode_proker.count({ where })

    // Fetch periode_proker items
    const periodeProker = await prisma.periode_proker.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        tahun: "desc",
      },
      include: {
        program_kerja: true,
      },
    })

    // Serialize BigInt values before sending the response
    const serializedData = serializeBigInt({
      periodeProker,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    })

    // Return response
    return NextResponse.json(serializedData)
  } catch (error) {
    console.error("Error fetching program periods:", error)
    return NextResponse.json({ error: "Failed to fetch program periods" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.tahun || !body.tanggal_mulai || !body.tanggal_selesai) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if year already exists
    const existingPeriod = await prisma.periode_proker.findFirst({
      where: { tahun: body.tahun },
    })

    if (existingPeriod) {
      return NextResponse.json({ error: "A period with this year already exists" }, { status: 400 })
    }

    // Create new periode_proker
    const newPeriodeProker = await prisma.periode_proker.create({
      data: {
        tahun: body.tahun,
        tanggal_mulai: new Date(body.tanggal_mulai),
        tanggal_selesai: new Date(body.tanggal_selesai),
        created_at: new Date(),
        updated_at: new Date(),
      },
    })

    // Serialize BigInt values before sending the response
    const serializedPeriodeProker = serializeBigInt(newPeriodeProker)

    return NextResponse.json(serializedPeriodeProker, { status: 201 })
  } catch (error) {
    console.error("Error creating program period:", error)
    return NextResponse.json({ error: "Failed to create program period" }, { status: 500 })
  }
}

