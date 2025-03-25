import { NextResponse } from "next/server"
import prisma, { serializeBigInt } from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = await params.id

    // Find renstra by ID with related data
    const renstra = await prisma.renstra.findUnique({
      where: { id: BigInt(id) },
      include: {
        periode: true,
        sub_renstra: true,
        point_renstra: true,
      },
    })

    if (!renstra) {
      return NextResponse.json({ error: "Renstra not found" }, { status: 404 })
    }

    // Serialize BigInt values before sending the response
    const serializedRenstra = serializeBigInt(renstra)

    return NextResponse.json(serializedRenstra)
  } catch (error) {
    console.error("Error fetching renstra:", error)
    return NextResponse.json({ error: "Failed to fetch renstra" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()

    // Check if renstra exists
    const existingRenstra = await prisma.renstra.findUnique({
      where: { id: BigInt(id) },
    })

    if (!existingRenstra) {
      return NextResponse.json({ error: "Renstra not found" }, { status: 404 })
    }

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

    // Update renstra
    const updatedRenstra = await prisma.renstra.update({
      where: { id: BigInt(id) },
      data: {
        nama: body.nama,
        periode_id: periode_id,
        updated_at: new Date(),
      },
      include: {
        periode: true,
        sub_renstra: true,
        point_renstra: true,
      },
    })

    // Serialize BigInt values before sending the response
    const serializedRenstra = serializeBigInt(updatedRenstra)

    return NextResponse.json(serializedRenstra)
  } catch (error) {
    console.error("Error updating renstra:", error)
    return NextResponse.json({ error: "Failed to update renstra" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Check if renstra exists
    const existingRenstra = await prisma.renstra.findUnique({
      where: { id: BigInt(id) },
      include: {
        sub_renstra: true,
        point_renstra: true,
      },
    })

    if (!existingRenstra) {
      return NextResponse.json({ error: "Renstra not found" }, { status: 404 })
    }

    // Check if renstra has associated sub_renstra or point_renstra
    if (existingRenstra.sub_renstra.length > 0 || existingRenstra.point_renstra.length > 0) {
      return NextResponse.json(
        {
          error: "Cannot delete renstra with associated items",
          message: "This renstra has associated sub-renstra or point-renstra. Please delete them first.",
        },
        { status: 400 },
      )
    }

    // Delete renstra
    await prisma.renstra.delete({
      where: { id: BigInt(id) },
    })

    return NextResponse.json({ success: true, message: "Renstra deleted successfully" })
  } catch (error) {
    console.error("Error deleting renstra:", error)
    return NextResponse.json(
      { error: "Failed to delete renstra", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

