/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"
import prisma, { serializeBigInt } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    // Get URL and search params
    const { searchParams } = new URL(request.url)

    // Get query parameters
    const query = searchParams.get("query")?.toLowerCase() || ""
    const periodeId = searchParams.get("periode_id") ? BigInt(searchParams.get("periode_id")!) : undefined
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    // Build filter conditions
    const where: any = {}

    if (query) {
      where.OR = [{ nama: { contains: query, mode: "insensitive" } }]
    }

    if (periodeId) {
      where.periode_id = periodeId
    }

    // Get total count for pagination
    const total = await prisma.renstra.count({ where })

    // Fetch renstra items
    const renstra = await prisma.renstra.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        created_at: "desc",
      },
      include: {
        periode: true,
        sub_renstra: true,
        point_renstra: true,
      },
    })

    // Serialize BigInt values before sending the response
    const serializedData = serializeBigInt({
      renstra,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    })

    // Return response
    return NextResponse.json(serializedData)
  } catch (error) {
    console.error("Error fetching renstra:", error)
    return NextResponse.json({ error: "Failed to fetch renstra" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.nama || !body.periode_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Convert periode_id to BigInt
    const periode_id = BigInt(body.periode_id)

    // Check if periode exists
    const periode = await prisma.periode_renstra.findUnique({
      where: { id: periode_id },
    })

    if (!periode) {
      return NextResponse.json({ error: "Period not found" }, { status: 400 })
    }

    // Create new renstra
    const newRenstra = await prisma.renstra.create({
      data: {
        nama: body.nama,
        periode_id: periode_id,
        created_at: new Date(),
        updated_at: new Date(),
      },
      include: {
        periode: true,
      },
    })

    // Serialize BigInt values before sending the response
    const serializedRenstra = serializeBigInt(newRenstra)

    return NextResponse.json(serializedRenstra, { status: 201 })
  } catch (error) {
    console.error("Error creating renstra:", error)
    return NextResponse.json({ error: "Failed to create renstra" }, { status: 500 })
  }
}

