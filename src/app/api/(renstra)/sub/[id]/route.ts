import { NextResponse } from "next/server"
import prisma, { serializeBigInt } from "@/lib/prisma"
type Params = Promise<{ id: string }>;

export async function GET(request: Request, { params }: { params: Params }) {
  try {
    const id = (await params).id

    // Find sub-renstra by ID with related data
    const subRenstra = await prisma.sub_renstra.findUnique({
      where: { id: BigInt(id) },
      include: {
        renstra: true,
        point_renstra: {
          include: {
            bidang: true,
          },
        },
      },
    })

    if (!subRenstra) {
      return NextResponse.json({ error: "Sub-Renstra not found" }, { status: 404 })
    }

    // Serialize BigInt values before sending the response
    const serializedSubRenstra = serializeBigInt(subRenstra)

    return NextResponse.json(serializedSubRenstra)
  } catch (error) {
    console.error("Error fetching sub-renstra:", error)
    return NextResponse.json({ error: "Failed to fetch sub-renstra" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Params }) {
  try {
    const id = (await params).id
    const body = await request.json()

    // Check if sub-renstra exists
    const existingSubRenstra = await prisma.sub_renstra.findUnique({
      where: { id: BigInt(id) },
    })

    if (!existingSubRenstra) {
      return NextResponse.json({ error: "Sub-Renstra not found" }, { status: 404 })
    }

    // Validate required fields
    if (!body.nama) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Update sub-renstra
    const updatedSubRenstra = await prisma.sub_renstra.update({
      where: { id: BigInt(id) },
      data: {
        nama: body.nama,
        updated_at: new Date(),
      },
      include: {
        renstra: true,
        point_renstra: {
          include: {
            bidang: true,
          },
        },
      },
    })

    // Serialize BigInt values before sending the response
    const serializedSubRenstra = serializeBigInt(updatedSubRenstra)

    return NextResponse.json(serializedSubRenstra)
  } catch (error) {
    console.error("Error updating sub-renstra:", error)
    return NextResponse.json({ error: "Failed to update sub-renstra" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Params }) {
  try {
    const id = (await params).id

    // Check if sub-renstra exists
    const existingSubRenstra = await prisma.sub_renstra.findUnique({
      where: { id: BigInt(id) },
      include: {
        point_renstra: true,
      },
    })

    if (!existingSubRenstra) {
      return NextResponse.json({ error: "Sub-Renstra not found" }, { status: 404 })
    }

    // Check if sub-renstra has associated point_renstra
    if (existingSubRenstra.point_renstra.length > 0) {
      return NextResponse.json(
        {
          error: "Cannot delete sub-renstra with associated items",
          message: "This sub-renstra has associated point-renstra. Please delete them first.",
        },
        { status: 400 },
      )
    }

    // Delete sub-renstra
    await prisma.sub_renstra.delete({
      where: { id: BigInt(id) },
    })

    return NextResponse.json({ success: true, message: "Sub-Renstra deleted successfully" })
  } catch (error) {
    console.error("Error deleting sub-renstra:", error)
    return NextResponse.json(
      { error: "Failed to delete sub-renstra", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

