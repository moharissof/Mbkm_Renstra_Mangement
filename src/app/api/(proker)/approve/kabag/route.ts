/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createNotification } from "@/services/Notification";
import { serializeBigInt } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { programId, status, alasan_penolakan } = await req.json();

    // Validasi program
    const program = await prisma.program_kerja.findUnique({
      where: { id: Number(programId) },
      include: {
        users: true,
      },
    });

    if (!program) {
      return NextResponse.json(
        { error: "Program tidak ditemukan" },
        { status: 404 }
      );
    }

    if (program.status !== "Planning") {
      return NextResponse.json(
        { error: "Program tidak siap untuk approval pertama" },
        { status: 400 }
      );
    }

    // Update status program
    const updatedProgram = await prisma.program_kerja.update({
      where: { id: Number(programId) },
      data: {
        status: status ? "Menunggu_Approve_Waket" : "Ditolak",
        first_approval_status: status ? "Approved" : "Rejected",
        created_at: new Date(),
        alasan_penolakan: !status ? alasan_penolakan : null,
      },
      include: {
        users: true,
        point_renstra: {
          include: {
            bidang: true,
          },
        },
      },
    });

    // Create notification based on status
    const updatedProgramSerialized = serializeBigInt(updatedProgram);
    const relatedEntityId = Number(updatedProgramSerialized.id);
    
    if (status) {
      // Notification for approval
      await createNotification({
        title: updatedProgramSerialized.nama,
        message: "Program kerja Anda telah disetujui pada tahap pertama",
        type: "Approval",
        senderId: updatedProgramSerialized.user_id,
        recipientId: program.users.id, // assuming creator is stored in users relation
        relatedEntity: "ProgramKerja",
        relatedEntityId: relatedEntityId,
      });
    } else {
      // Notification for rejection
      await createNotification({
        title: updatedProgramSerialized.nama,
        message: `Program kerja Anda ditolak pada tahap pertama. Alasan: ${alasan_penolakan}`,
        type: "Rejection",
        senderId: updatedProgramSerialized.user_id,
        recipientId: program.users.id, // assuming creator is stored in users relation
        relatedEntity: "ProgramKerja",
        relatedEntityId: relatedEntityId,
      });
    }

    return NextResponse.json({
      success: true,
      program: updatedProgramSerialized,
    });
  } catch (error: any) {
    console.error("First approval error:", error);
    return NextResponse.json(
      { error: error.message || "Gagal memproses approval pertama" },
      { status: 500 }
    );
  }
}