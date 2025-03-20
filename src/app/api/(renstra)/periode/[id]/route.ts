import { NextResponse } from "next/server";
import { prisma, serializeBigInt } from "@/lib/prisma";


export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
      
      const body = await request.json();
      const updatedPeriodeRenstra = await prisma.periode_renstra.update({
        where: { id: BigInt(params.id) },
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

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.periode_renstra.delete({
      where: { id: BigInt(params.id) },
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
