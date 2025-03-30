import { NextResponse } from "next/server"
import prisma, { serializeBigInt } from "@/lib/prisma"
type Params = Promise<{ id: string }>;

export async function PUT(request: Request, { params }: { params: Params }) {
  try {
    const id = (await params).id
    const body = await request.json()

    // Validate status
    if (!body.status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 })
    }

    // Check if program_kerja exists
    const existingProgramKerja = await prisma.program_kerja.findUnique({
      where: { id: BigInt(id) },
    })

    if (!existingProgramKerja) {
      return NextResponse.json({ error: "Program kerja not found" }, { status: 404 })
    }

    // Validate status transition
    if (existingProgramKerja.status === "Draft" && body.status !== "Planning") {
      return NextResponse.json(
        { error: "Invalid status transition. Draft can only be changed to Planning" },
        { status: 400 },
      )
    }

    if (existingProgramKerja.status !== "Draft" && body.status === "Planning") {
      return NextResponse.json({ error: "Only Draft programs can be changed to Planning" }, { status: 400 })
    }

    // Update program_kerja status
    const updatedProgramKerja = await prisma.program_kerja.update({
      where: { id: BigInt(id) },
      data: {
        status: body.status,
        updated_at: new Date(),
      },
    })

    // Serialize BigInt values before sending the response
    const serializedProgramKerja = serializeBigInt(updatedProgramKerja)

    return NextResponse.json(serializedProgramKerja)
  } catch (error) {
    console.error("Error updating program kerja status:", error)
    return NextResponse.json({ error: "Failed to update program kerja status" }, { status: 500 })
  }
}

