// app/api/proker/[id]/resubmit/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
type Params = Promise<{ id: string }>;

export async function POST(
  request: Request,
  { params }: { params: Params }
) {
  try {
    const programId = await (await params).id;

    // Update status ke Planning (status awal)
    const updatedProgram = await prisma.program_kerja.update({
      where: { id: Number(programId) },
      data: {
        status: "Planning",
        alasan_penolakan: null,
        first_approval_status: null,
        second_approval_status: null,
      },
    });

    return NextResponse.json({ success: true, program: updatedProgram });
  } catch (error) {
    console.error("Error resubmitting program:", error);
    return NextResponse.json(
      { error: "Failed to resubmit program" },
      { status: 500 }
    );
  }
}