/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"
import prisma, { serializeBigInt } from "@/lib/prisma"

type Params = Promise<{ id: string }>;

export async function GET(request: Request, { params }: { params: Params }) {
  try {
    const id = (await params).id

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

export async function PUT(request: Request, { params }: { params: Params }) {
  try {
    const id = (await params).id
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
        // Delete existing point_standar records for this program
        await tx.point_standar.deleteMany({
          where: {
            program_kerja: {
              some: {
                id: BigInt(id),
              },
            },
          },
        })

        // Create new point_standar records
        if (body.point_standar.length > 0) {
          const pointStandarPromises = body.point_standar.map((pointStandar: any) =>
            tx.point_standar.create({
              data: {
                nama: pointStandar.nama,
                point: pointStandar.point,
                created_at: new Date(),
                updated_at: new Date(),
                program_kerja: {
                  connect: { id: BigInt(id) },
                },
              },
            }),
          )

          await Promise.all(pointStandarPromises)
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

export async function DELETE(request: Request, { params }: { params: Params }) {
  try {
    const id = (await params).id

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

      // Delete related point_standar
      await tx.point_standar.deleteMany({
        where: {
          program_kerja: {
            some: {
              id: BigInt(id),
            },
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

