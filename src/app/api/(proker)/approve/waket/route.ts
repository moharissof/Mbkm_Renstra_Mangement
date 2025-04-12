/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { createNotification } from "@/services/Notification"
import { serializeBigInt } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { programId, status, alasan_penolakan } = await req.json()

    // Validasi program
    const program = await prisma.program_kerja.findUnique({
      where: { id: Number(programId) },
      include: {
        users: true // Include creator data for notification
      }
    })

    if (!program) {
      return NextResponse.json({ error: "Program tidak ditemukan" }, { status: 404 })
    }

    // Update status program
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

    // Serialize program data
    const updatedProgramSerialize = serializeBigInt(updatedProgram)

    // Create notification based on approval status
    if (status) {
      // Approval notification
      await createNotification({
        title: updatedProgramSerialize.nama,
        message: "Program kerja Anda telah disetujui pada tahap kedua",
        type: "Approval",
        senderId: updatedProgramSerialize.user_id,
        recipientId: program.users.id, // Send to creator
        relatedEntity: "ProgramKerja",
        relatedEntityId: Number(updatedProgramSerialize.id)
      })
    } else {
      // Rejection notification
      await createNotification({
        title: updatedProgramSerialize.nama,
        message: `Program kerja Anda ditolak pada tahap kedua. Alasan: ${alasan_penolakan}`,
        type: "Rejection",
        senderId: updatedProgramSerialize.user_id,
        recipientId: program.users.id, // Send to creator
        relatedEntity: "ProgramKerja",
        relatedEntityId: Number(updatedProgramSerialize.id)
      })
    }

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