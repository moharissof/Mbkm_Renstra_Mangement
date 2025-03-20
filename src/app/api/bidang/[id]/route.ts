// app/api/bidang/[id]/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// PUT: Perbarui data bidang berdasarkan ID
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { nama, deskripsi } = body;

    // Validasi input
    if (!nama) {
      return NextResponse.json(
        { error: "Nama bidang wajib diisi" },
        { status: 400 }
      );
    }

    // Perbarui bidang
    const updatedBidang = await prisma.bidang.update({
      where: { id: BigInt(id) },
      data: {
        nama,
        deskripsi,
      },
    });

    return NextResponse.json(updatedBidang);
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
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Hapus bidang
    await prisma.bidang.delete({
      where: { id: BigInt(id) },
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