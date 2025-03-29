import { NextResponse } from "next/server"
import prisma, { serializeBigInt } from "@/lib/prisma"
type Params = Promise<{ id: string }>;
export async function GET(request: Request, { params }: { params: Params }) {
  try {
    const id = (await params).id

    // Find periode_proker by ID with related data
    const periodeProker = await prisma.periode_proker.findUnique({
      where: { id: BigInt(id) },
      include: {
        program_kerja: true,
      },
    })

    if (!periodeProker) {
      return NextResponse.json({ error: "Program period not found" }, { status: 404 })
    }

    // Serialize BigInt values before sending the response
    const serializedPeriodeProker = serializeBigInt(periodeProker)

    return NextResponse.json(serializedPeriodeProker)
  } catch (error) {
    console.error("Error fetching program period:", error)
    return NextResponse.json({ error: "Failed to fetch program period" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Params }) {
  try {
    const id = (await params).id
    const body = await request.json()

    // Check if periode_proker exists
    const existingPeriodeProker = await prisma.periode_proker.findUnique({
      where: { id: BigInt(id) },
    })

    if (!existingPeriodeProker) {
      return NextResponse.json({ error: "Program period not found" }, { status: 404 })
    }

    // Validate required fields
    if (!body.tahun || !body.tanggal_mulai || !body.tanggal_selesai) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if year is being changed and if it already exists
    if (body.tahun !== existingPeriodeProker.tahun) {
      const yearExists = await prisma.periode_proker.findFirst({
        where: {
          tahun: body.tahun,
          id: { not: BigInt(id) },
        },
      })

      if (yearExists) {
        return NextResponse.json({ error: "A period with this year already exists" }, { status: 400 })
      }
    }

    // Update periode_proker
    const updatedPeriodeProker = await prisma.periode_proker.update({
      where: { id: BigInt(id) },
      data: {
        tahun: body.tahun,
        tanggal_mulai: new Date(body.tanggal_mulai),
        tanggal_selesai: new Date(body.tanggal_selesai),
        updated_at: new Date(),
      },
      include: {
        program_kerja: true,
      },
    })

    // Serialize BigInt values before sending the response
    const serializedPeriodeProker = serializeBigInt(updatedPeriodeProker)

    return NextResponse.json(serializedPeriodeProker)
  } catch (error) {
    console.error("Error updating program period:", error)
    return NextResponse.json({ error: "Failed to update program period" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Params }) {
  try {
    const id = (await params).id

    // Check if periode_proker exists
    const existingPeriodeProker = await prisma.periode_proker.findUnique({
      where: { id: BigInt(id) },
      include: {
        program_kerja: true,
      },
    })

    if (!existingPeriodeProker) {
      return NextResponse.json({ error: "Program period not found" }, { status: 404 })
    }

    // Check if periode_proker has associated program_kerja
    if (existingPeriodeProker.program_kerja.length > 0) {
      return NextResponse.json(
        {
          error: "Cannot delete program period with associated programs",
          message: "This period has associated programs. Please delete them first.",
        },
        { status: 400 },
      )
    }

    // Delete periode_proker
    await prisma.periode_proker.delete({
      where: { id: BigInt(id) },
    })

    return NextResponse.json({ success: true, message: "Program period deleted successfully" })
  } catch (error) {
    console.error("Error deleting program period:", error)
    return NextResponse.json(
      { error: "Failed to delete program period", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

