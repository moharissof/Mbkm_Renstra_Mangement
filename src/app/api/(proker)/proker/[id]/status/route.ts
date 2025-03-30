import { NextResponse } from "next/server"
import prisma, { serializeBigInt } from "@/lib/prisma"
type Params = Promise<{ id: string }>;

export async function PUT(request: Request, { params }: { params: Params }) {
  try {
    const id = (await params).id
    const body = await request.json()
    console.log("Request body:", body)

    // Validate status
    if (!body.status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 })
    } 


    const first_approval_status = body.status === "Menunggu_Approve_Waket" ? "Approve" : null;

    // Check if program_kerja exists
    const existingProgramKerja = await prisma.program_kerja.findUnique({
      where: { id: BigInt(id) },
    })

    if (!existingProgramKerja) {
      return NextResponse.json({ error: "Program kerja not found" }, { status: 404 })
    }


    // Update program_kerja status
    const updatedProgramKerja = await prisma.program_kerja.update({
      where: { id: BigInt(id) },
      data: {
        first_approval_status: first_approval_status,
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

