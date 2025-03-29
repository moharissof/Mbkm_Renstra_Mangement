import { NextResponse } from "next/server"
import prisma, { serializeBigInt } from "@/lib/prisma"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Check if program_kerja exists
    const existingProgram = await prisma.program_kerja.findUnique({
      where: { id: BigInt(id) },
    })

    if (!existingProgram) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 })
    }

    // Check if the program is in "Disetujui" status
    if (existingProgram.status !== "Disetujui") {
      return NextResponse.json({ error: "Only approved programs can be started" }, { status: 400 })
    }

    // Update the program status to "On_Progress"
    const updatedProgram = await prisma.program_kerja.update({
      where: { id: BigInt(id) },
      data: {
        status: "On_Progress",
        updated_at: new Date(),
      },
      include: {
        point_renstra: {
          include: {
            bidang: true,
            sub_renstra: {
              include: {
                renstra: true,
              },
            },
          },
        },
        periode_proker: true,
        indikator_proker: true,
        point_standar: true,
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            jabatan: true,
          },
        },
      },
    })


    // Serialize BigInt values before sending the response
    const serializedProgram = serializeBigInt(updatedProgram)

    return NextResponse.json(serializedProgram)
  } catch (error) {
    console.error("Error starting program:", error)
    return NextResponse.json(
      { error: "Failed to start program", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

