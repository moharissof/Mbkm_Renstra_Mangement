import { NextResponse } from "next/server";
import { prisma, serializeBigInt } from "@/lib/prisma";
type Params = Promise<{ id: string }>;

export async function GET(request: Request, { params }: { params: Params }) {
  try {
    const periodeRenstra = await prisma.periode_renstra.findUnique({
      where: { id: BigInt((await params).id) },
      include: {
        renstra: true // Anda bisa menambahkan relasi lain jika diperlukan
      }
    });

    if (!periodeRenstra) {
      return NextResponse.json(
        { error: "Periode renstra not found" },
        { status: 404 }
      );
    }

    const serializedData = serializeBigInt(periodeRenstra);
    return NextResponse.json(serializedData);
  } catch (error) {
    console.error("Error fetching periode renstra:", error);
    return NextResponse.json(
      { error: "Failed to fetch periode renstra" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: { params: Params  }) {
    try {
      
      const body = await request.json();
      const updatedPeriodeRenstra = await prisma.periode_renstra.update({
        where: { id: BigInt((await params).id) },
        data: body,
      });

      const updatePeriodeSerialize = serializeBigInt(updatedPeriodeRenstra);

      return NextResponse.json(updatePeriodeSerialize);
    } catch (error) {
      console.error("Error updating periode renstra:", error);
      return NextResponse.json(
        { error: "Failed to update periode renstra" },
        { status: 500 }
      );
    }
  }

export async function DELETE(request: Request, { params }: { params: Params }) {
  try {
    await prisma.periode_renstra.delete({
      where: { id: BigInt((await params).id) },
    });
    return NextResponse.json({ message: "Periode renstra deleted successfully" });
  } catch (error) {
    console.error("Error deleting periode renstra:", error);
    return NextResponse.json(
      { error: "Failed to delete periode renstra" },
      { status: 500 }
    );
  }
}
