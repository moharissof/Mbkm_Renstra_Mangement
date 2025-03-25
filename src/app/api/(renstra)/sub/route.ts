/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"
import prisma, { serializeBigInt } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    // Get URL and search params
    const { searchParams } = new URL(request.url)

    // Get query parameters
    const query = searchParams.get("query")?.toLowerCase() || ""
    const renstraId = searchParams.get("renstra_id") ? BigInt(searchParams.get("renstra_id")!) : undefined
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "100")
    const skip = (page - 1) * limit

    // Build filter conditions
    const where: any = {}

    if (query) {
      where.OR = [{ nama: { contains: query, mode: "insensitive" } }]
    }

    if (renstraId) {
      where.renstra_id = renstraId
    }

    // Get total count for pagination
    const total = await prisma.sub_renstra.count({ where })

    // Fetch sub-renstra items
    const sub_renstra = await prisma.sub_renstra.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        created_at: "desc",
      },
      include: {
        point_renstra: {
          include: {
            bidang: true,
          },
        },
      },
    })

    // Serialize BigInt values before sending the response
    const serializedData = serializeBigInt({
      sub_renstra,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    })

    // Return response
    return NextResponse.json(serializedData)
  } catch (error) {
    console.error("Error fetching sub-renstra:", error)
    return NextResponse.json({ error: "Failed to fetch sub-renstra" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.nama || !body.renstra_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Convert renstra_id to BigInt
    const renstra_id = BigInt(body.renstra_id)

    // Check if renstra exists
    const renstra = await prisma.renstra.findUnique({
      where: { id: renstra_id },
    })

    if (!renstra) {
      return NextResponse.json({ error: "Renstra not found" }, { status: 400 })
    }

    // Create new sub-renstra
    const newSubRenstra = await prisma.sub_renstra.create({
      data: {
        nama: body.nama,
        renstra_id: renstra_id,
        created_at: new Date(),
        updated_at: new Date(),
      },
      include: {
        point_renstra: true,
      },
    })

    // Serialize BigInt values before sending the response
    const serializedSubRenstra = serializeBigInt(newSubRenstra)

    return NextResponse.json(serializedSubRenstra, { status: 201 })
  } catch (error) {
    console.error("Error creating sub-renstra:", error)
    return NextResponse.json({ error: "Failed to create sub-renstra" }, { status: 500 })
  }
}

