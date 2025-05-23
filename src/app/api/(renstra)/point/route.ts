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
    const subRenstraId = searchParams.get("sub_renstra_id") ? BigInt(searchParams.get("sub_renstra_id")!) : undefined
    const bidangId = searchParams.get("bidang_id") ? BigInt(searchParams.get("bidang_id")!) : undefined
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

    if (subRenstraId) {
      where.sub_renstra_id = subRenstraId
    }

    if (bidangId) {
      where.bidang_id = bidangId
    }

    // Get total count for pagination
    const total = await prisma.point_renstra.count({ where })

    // Fetch point-renstra items
    const point_renstra = await prisma.point_renstra.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        created_at: "desc",
      },
      include: {
        bidang: true,
        sub_renstra: true,
      },
    })

    // Serialize BigInt values before sending the response
    const serializedData = serializeBigInt({
      point_renstra,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    })

    // Return response
    return NextResponse.json(serializedData)
  } catch (error) {
    console.error("Error fetching point-renstra:", error)
    return NextResponse.json({ error: "Failed to fetch point-renstra" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.nama || !body.renstra_id || !body.sub_renstra_id || !body.bidang_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Convert IDs to BigInt
    const renstra_id = BigInt(body.renstra_id)
    const sub_renstra_id = BigInt(body.sub_renstra_id)
    const bidang_id = BigInt(body.bidang_id)
    const presentase = body.presentase !== undefined ? Number(body.presentase) : null

    // Check if renstra exists
    const renstra = await prisma.renstra.findUnique({
      where: { id: renstra_id },
    })

    if (!renstra) {
      return NextResponse.json({ error: "Renstra not found" }, { status: 400 })
    }

    // Check if sub-renstra exists
    const subRenstra = await prisma.sub_renstra.findUnique({
      where: { id: sub_renstra_id },
    })

    if (!subRenstra) {
      return NextResponse.json({ error: "Sub-Renstra not found" }, { status: 400 })
    }

    // Check if bidang exists
    const bidang = await prisma.bidang.findUnique({
      where: { id: bidang_id },
    })

    if (!bidang) {
      return NextResponse.json({ error: "Bidang not found" }, { status: 400 })
    }

    // Create new point-renstra
    const newPointRenstra = await prisma.point_renstra.create({
      data: {
        nama: body.nama,
        renstra_id: renstra_id,
        sub_renstra_id: sub_renstra_id,
        bidang_id: bidang_id,
        presentase: presentase,
        created_at: new Date(),
        updated_at: new Date(),
      },
      include: {
        bidang: true,
        sub_renstra: true,
      },
    })

    // Serialize BigInt values before sending the response
    const serializedPointRenstra = serializeBigInt(newPointRenstra)

    return NextResponse.json(serializedPointRenstra, { status: 201 })
  } catch (error) {
    console.error("Error creating point-renstra:", error)
    return NextResponse.json({ error: "Failed to create point-renstra" }, { status: 500 })
  }
}

