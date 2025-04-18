import { NextResponse } from "next/server";
import prisma , {serializeBigInt} from "@/lib/prisma";
type Params = Promise<{ id: string }>;
export async function POST(request: Request, { params }: { params: Params }) {
  try {
    const id = (await params).id;
    const { verified } = await request.json();

    // Validasi input
    if (typeof verified !== "boolean") {
      return NextResponse.json(
        { error: "Data verifikasi tidak valid" },
        { status: 400 }
      );
    }

    // Cek apakah proker ada dan progress 100%
    const proker = await prisma.program_kerja.findUnique({
      where: { id: BigInt(id) },
      select: { progress: true },
    });

    if (!proker) {
      return NextResponse.json(
        { error: "Program kerja tidak ditemukan" },
        { status: 404 }
      );
    }

    if (proker.progress !== 100) {
      return NextResponse.json(
        { error: "Program kerja belum mencapai 100% progress" },
        { status: 400 }
      );
    }

    // Update status proker
    const updatedProker = await prisma.program_kerja.update({
      where: { id: BigInt(id) },
      data: {
        status: verified ? "Pengajuan_penyelesaian" : "On_Progress",
        updated_at: new Date(),
      },
      include: {
        users: {
          select: {
            name: true,
          },
        },
      },
    });
    const SerializeProker = serializeBigInt(updatedProker);
    return NextResponse.json(SerializeProker);
  } catch (error) {
    console.error("Error verifying proker:", error);
    return NextResponse.json(
      { error: "Gagal memverifikasi program kerja" },
      { status: 500 }
    );
  }
}
