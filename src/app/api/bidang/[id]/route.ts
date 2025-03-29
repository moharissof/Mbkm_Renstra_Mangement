// app/api/bidang/[id]/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { serializeBigInt } from "@/lib/prisma";

const prisma = new PrismaClient();
type Params = Promise<{ id: string }>;

// PUT: Update data bidang berdasarkan ID
export async function PUT(
  request: Request,
  { params }: { params: Params } // params sudah tersedia di sini
) {
  try {
    const { id } = await params; // Langsung akses params.id
    const body = await request.json();
    const { nama, deskripsi } = body;

    // Validasi input
    if (!nama) {
      return NextResponse.json(
        { error: "Nama bidang wajib diisi" },
        { status: 400 }
      );
    }

    // Update data di database
    const updatedBidang = await prisma.bidang.update({
      where: { id: BigInt(id) }, // Konversi id ke BigInt
      data: {
        nama,
        deskripsi,
      },
    });

    // Serialize data (konversi BigInt ke string)
    const serializedBidang = serializeBigInt(updatedBidang);

    return NextResponse.json(serializedBidang, { status: 200 });
  } catch (error) {
    console.error("Error updating bidang:", error);
    return NextResponse.json(
      { error: "Failed to update bidang" },
      { status: 500 }
    );
  }
}

// DELETE: Hapus data bidang berdasarkan ID
export async function DELETE(
  request: Request,
  { params }: { params: Params } // params sudah tersedia di sini
) {
  try {
    const { id } = await params; // Langsung akses params.id

    // Hapus bidang
    await prisma.bidang.delete({
      where: { id: BigInt(id) }, // Konversi id ke BigInt
    });

    return NextResponse.json(
      { message: "Bidang berhasil dihapus" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting bidang:", error);
    return NextResponse.json(
      { error: "Failed to delete bidang" },
      { status: 500 }
    );
  }
}
