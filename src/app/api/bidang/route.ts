import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET: Ambil semua data bidang
export async function GET() {
  try {
    const bidang = await prisma.bidang.findMany();

    // Konversi BigInt ke string
    const serializedBidang = bidang.map((b: { id: bigint }) => ({
      ...b,
      id: b.id.toString(), // Convert BigInt to string
    }));
    
    console.log("Data bidang:", serializedBidang);
    return NextResponse.json(serializedBidang);
  } catch (error) {
    console.error("Error fetching bidang:", error);
    return NextResponse.json(
      { error: "Failed to fetch bidang" },
      { status: 500 }
    );
  }
} 

// POST: Tambah data bidang baru
export async function POST(request: Request) {
    try {
      const body = await request.json();
      const { nama, deskripsi } = body;
  
      // Validasi input
      if (!nama) {
        return NextResponse.json(
          { error: "Nama bidang wajib diisi" },
          { status: 400 }
        );
      }
  
      // Buat bidang baru
      const newBidang = await prisma.bidang.create({
        data: {
          nama,
          deskripsi,
        },
      });
  
      return NextResponse.json(newBidang, { status: 201 });
    } catch (error) {
      console.error("Error creating bidang:", error);
      return NextResponse.json(
        { error: "Failed to create bidang" },
        { status: 500 }
      );
    }
  }
