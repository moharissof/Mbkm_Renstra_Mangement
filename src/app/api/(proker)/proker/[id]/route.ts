/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"
import prisma, { serializeBigInt } from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Find program_kerja by ID with related data
    const programKerja = await prisma.program_kerja.findUnique({
      where: { id: BigInt(id) },
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

    if (!programKerja) {
      return NextResponse.json({ error: "Program kerja not found" }, { status: 404 })
    }

    // Serialize BigInt values before sending the response
    const serializedProgramKerja = serializeBigInt(programKerja)

    return NextResponse.json(serializedProgramKerja)
  } catch (error) {
    console.error("Error fetching program kerja:", error)
    return NextResponse.json({ error: "Failed to fetch program kerja" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()

    // Check if program_kerja exists
    const existingProgramKerja = await prisma.program_kerja.findUnique({
      where: { id: BigInt(id) },
      include: {
        indikator_proker: true,
        point_standar: true,
      },
    })

    if (!existingProgramKerja) {
      return NextResponse.json({ error: "Program kerja not found" }, { status: 404 })
    }

    // Start a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update program_kerja
      const updatedProgramKerja = await tx.program_kerja.update({
        where: { id: BigInt(id) },
        data: {
          nama: body.nama,
          deskripsi: body.deskripsi,
          strategi_pencapaian: body.strategi_pencapaian,
          baseline: body.baseline,
          waktu_mulai: new Date(body.waktu_mulai),
          waktu_selesai: new Date(body.waktu_selesai),
          anggaran: body.anggaran ? BigInt(body.anggaran) : null,
          volume: body.volume,
          progress: body.progress !== undefined ? body.progress : existingProgramKerja.progress,
          status: body.status || existingProgramKerja.status,
          first_approval_status: body.first_approval_status,
          status_periode_first: body.status_periode_first,
          second_approval_status: body.second_approval_status,
          status_periode_second: body.status_periode_second,
          alasan_penolakan: body.alasan_penolakan,
          updated_at: new Date(),
        },
      })

      // Handle indikator_proker updates
      if (body.indikator_proker) {
        // Delete existing indicators
        await tx.indikator_proker.deleteMany({
          where: { proker_id: BigInt(id) },
        })

        // Create new indicators
        const indikatorPromises = body.indikator_proker.map((indikator: any) =>
          tx.indikator_proker.create({
            data: {
              proker_id: updatedProgramKerja.id,
              nama: indikator.nama,
              target: indikator.target,
              satuan: indikator.satuan,
              created_at: new Date(),
              updated_at: new Date(),
            },
          }),
        )

        await Promise.all(indikatorPromises)
      }

      // Handle point_standar updates
      if (body.point_standar) {
        // Disconnect all existing point_standar
        await tx.program_kerja.update({
          where: { id: BigInt(id) },
          data: {
            point_standar: {
              set: [], // Clear existing connections
            },
          },
        })

        // Connect new point_standar
        if (body.point_standar.length > 0) {
          await tx.program_kerja.update({
            where: { id: BigInt(id) },
            data: {
              point_standar: {
                connect: body.point_standar.map((ps: any) => ({ id: BigInt(typeof ps === "object" ? ps.id : ps) })),
              },
            },
          })
        }
      }

      // Return the updated program with its relations
      return await tx.program_kerja.findUnique({
        where: { id: updatedProgramKerja.id },
        include: {
          point_renstra: true,
          periode_proker: true,
          indikator_proker: true,
          point_standar: true,
          users: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      })
    })

    // Serialize BigInt values before sending the response
    const serializedProgramKerja = serializeBigInt(result)

    return NextResponse.json(serializedProgramKerja)
  } catch (error) {
    console.error("Error updating program kerja:", error)
    return NextResponse.json({ error: "Failed to update program kerja" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Check if program_kerja exists
    const existingProgramKerja = await prisma.program_kerja.findUnique({
      where: { id: BigInt(id) },
    })

    if (!existingProgramKerja) {
      return NextResponse.json({ error: "Program kerja not found" }, { status: 404 })
    }

    // Start a transaction
    await prisma.$transaction(async (tx) => {
      // Delete related indikator_proker
      await tx.indikator_proker.deleteMany({
        where: { proker_id: BigInt(id) },
      })

      // Disconnect point_standar
      await tx.program_kerja.update({
        where: { id: BigInt(id) },
        data: {
          point_standar: {
            set: [], // Clear existing connections
          },
        },
      })

      // Delete program_kerja
      await tx.program_kerja.delete({
        where: { id: BigInt(id) },
      })
    })

    return NextResponse.json({ success: true, message: "Program kerja deleted successfully" })
  } catch (error) {
    console.error("Error deleting program kerja:", error)
    return NextResponse.json(
      { error: "Failed to delete program kerja", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

