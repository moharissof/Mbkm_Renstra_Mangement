/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { serializeBigInt } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { programId, status, alasan_penolakan } = await req.json()

    // Validasi program
    const program = await prisma.program_kerja.findUnique({
      where: { id: Number(programId) }
    })

    if (!program) {
      return NextResponse.json({ error: "Program tidak ditemukan" }, { status: 404 })
    }

    // if (program.status !== "Menunggu_Approve_Waket") {
    //   return NextResponse.json(
    //     { error: "Program tidak siap untuk approval kedua" },
    //     { status: 400 }
    //   )
    // }

    // Update status program langsung
    const updatedProgram = await prisma.program_kerja.update({
      where: { id: Number(programId) },
      data: {
        status: status ? "Disetujui" : "Ditolak",
        second_approval_status: status ? "Approved" : "Rejected",
        created_at: new Date(),
        alasan_penolakan: !status ? alasan_penolakan : null
      },
      include: {
        users: true,
        point_renstra: {
          include: {
            bidang: true
          }
        }
      }
    })
    const updatedProgramSerialize = serializeBigInt(updatedProgram)
    return NextResponse.json({
      success: true,
      program: updatedProgramSerialize
    })

  } catch (error: any) {
    console.error("Second approval error:", error)
    return NextResponse.json(
      { error: error.message || "Gagal memproses approval kedua" },
      { status: 500 }
    )
  }
}