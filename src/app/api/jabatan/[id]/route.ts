import { NextResponse } from "next/server"
import prisma, { serializeBigInt } from "@/lib/prisma"
import { Role } from "@/types/user"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Find position by ID with parent and children
    const position = await prisma.jabatan.findUnique({
      where: { id: BigInt(id) },
      include: {
        parent: true,
        children: true,
      },
    })

    if (!position) {
      return NextResponse.json({ error: "Position not found" }, { status: 404 })
    }

    // Serialize BigInt values before sending the response
    const serializedPosition = serializeBigInt(position)

    return NextResponse.json(serializedPosition)
  } catch (error) {
    console.error("Error fetching position:", error)
    return NextResponse.json({ error: "Failed to fetch position" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.id || !body.nama || !body.role || !body.bidang_id) {
      return NextResponse.json(
        { error: "Missing required fields: id, nama, role, bidang_id" },
        { status: 400 }
      );
    }

    // Validate role
    if (!Object.values(Role).includes(body.role)) {
      return NextResponse.json(
        { error: "Invalid role value" },
        { status: 400 }
      );
    }

    // Convert parent_id to BigInt if provided
    const parent_id = body.parent_id ? BigInt(body.parent_id) : null;
    const bidang_id = BigInt(body.bidang_id); // Convert bidang_id to BigInt

    // Update jabatan
    const updatedJabatan = await prisma.jabatan.update({
      where: { id: BigInt(body.id) },
      data: {
        nama: body.nama,
        deskripsi: body.deskripsi || null,
        role: body.role,
        parent_id: parent_id,
        bidang_id: bidang_id,
        updated_at: new Date(),
      },
      include: {
        parent: true,
      },
    });

    // Serialize BigInt values before sending the response
    const serializedJabatan = serializeBigInt(updatedJabatan);

    return NextResponse.json(serializedJabatan);
  } catch (error) {
    console.error("Error updating jabatan:", error);
    return NextResponse.json(
      { error: "Failed to update jabatan" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Check if position exists
    const existingPosition = await prisma.jabatan.findUnique({
      where: { id: BigInt(id) },
      include: {
        children: true,
      },
    })

    if (!existingPosition) {
      return NextResponse.json({ error: "Position not found" }, { status: 404 })
    }

    // Check if position has children
    if (existingPosition.children && existingPosition.children.length > 0) {
      return NextResponse.json(
        {
          error: "Cannot delete position with children",
          message: "This position has subordinate positions. Please reassign or delete them first.",
        },
        { status: 400 },
      )
    }

    // Check if position is assigned to any users
    const usersWithPosition = await prisma.users.findMany({
      where: { jabatan_id: BigInt(id) },
    })

    if (usersWithPosition.length > 0) {
      return NextResponse.json(
        {
          error: "Cannot delete position assigned to users",
          message: "This position is assigned to one or more users. Please reassign them first.",
        },
        { status: 400 },
      )
    }

    // Delete position
    await prisma.jabatan.delete({
      where: { id: BigInt(id) },
    })

    return NextResponse.json({ success: true, message: "Position deleted successfully" })
  } catch (error) {
    console.error("Error deleting position:", error)
    return NextResponse.json(
      { error: "Failed to delete position", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

