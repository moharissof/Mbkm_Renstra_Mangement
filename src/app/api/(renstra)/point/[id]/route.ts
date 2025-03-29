import { NextResponse } from "next/server"
import prisma, { serializeBigInt } from "@/lib/prisma"
type Params = Promise<{ id: string }>;

export async function GET(request: Request, { params }: { params: Params }) {
  try {
    const id = (await params).id;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    // Safely convert id to BigInt
    const pointRenstra = await prisma.point_renstra.findUnique({
      where: { id: BigInt(id) },
      include: {
        renstra: true,
        sub_renstra: true,
        bidang: true,
      },
    });

    if (!pointRenstra) {
      return NextResponse.json({ error: "Point-Renstra not found" }, { status: 404 });
    }

    // Serialize BigInt values before sending the response
    const serializedPointRenstra = serializeBigInt(pointRenstra);

    return NextResponse.json(serializedPointRenstra);
  } catch (error) {
    console.error("Error fetching point-renstra:", error);
    return NextResponse.json({ error: "Failed to fetch point-renstra" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Params }) {
  try {
    const id = (await params).id
    const body = await request.json()

    // Check if point-renstra exists
    const existingPointRenstra = await prisma.point_renstra.findUnique({
      where: { id: BigInt(id) },
    })

    if (!existingPointRenstra) {
      return NextResponse.json({ error: "Point-Renstra not found" }, { status: 404 })
    }

    // Validate required fields
    if (!body.nama || !body.bidang_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Convert IDs to BigInt
    const bidang_id = BigInt(body.bidang_id)
    const presentase = body.presentase !== undefined ? Number(body.presentase) : null

    // Check if bidang exists
    const bidang = await prisma.bidang.findUnique({
      where: { id: bidang_id },
    })

    if (!bidang) {
      return NextResponse.json({ error: "Bidang not found" }, { status: 400 })
    }

    // Update point-renstra
    const updatedPointRenstra = await prisma.point_renstra.update({
      where: { id: BigInt(id) },
      data: {
        nama: body.nama,
        bidang_id: bidang_id,
        presentase: presentase,
        updated_at: new Date(),
      },
      include: {
        renstra: true,
        sub_renstra: true,
        bidang: true,
      },
    })

    // Serialize BigInt values before sending the response
    const serializedPointRenstra = serializeBigInt(updatedPointRenstra)

    return NextResponse.json(serializedPointRenstra)
  } catch (error) {
    console.error("Error updating point-renstra:", error)
    return NextResponse.json({ error: "Failed to update point-renstra" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Params }) {
  try {
    const id = (await params).id

    // Check if point-renstra exists
    const existingPointRenstra = await prisma.point_renstra.findUnique({
      where: { id: BigInt(id) },
    })

    if (!existingPointRenstra) {
      return NextResponse.json({ error: "Point-Renstra not found" }, { status: 404 })
    }

    // Delete point-renstra
    await prisma.point_renstra.delete({
      where: { id: BigInt(id) },
    })

    return NextResponse.json({ success: true, message: "Point-Renstra deleted successfully" })
  } catch (error) {
    console.error("Error deleting point-renstra:", error)
    return NextResponse.json(
      { error: "Failed to delete point-renstra", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

