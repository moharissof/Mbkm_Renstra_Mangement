import { NextResponse } from "next/server";
import { prisma, serializeBigInt } from "@/lib/prisma";

export async function GET() {
  try {
    const periodeRenstra = await prisma.periode_renstra.findMany();
    const serializedData = serializeBigInt(periodeRenstra); // Serialize BigInt
    return NextResponse.json(serializedData);
  } catch (error) {
    console.error("Error fetching periode renstra:", error);
    return NextResponse.json(
      { error: "Failed to fetch periode renstra" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newPeriodeRenstra = await prisma.periode_renstra.create({
      data: body,
    });
    const Perioderenstra = serializeBigInt(newPeriodeRenstra); // Serialize BigInt
    return NextResponse.json(Perioderenstra, { status: 201 });
  } catch (error) {
    console.error("Error creating periode renstra:", error);
    return NextResponse.json(
      { error: "Failed to create periode renstra" },
      { status: 500 }
    );
  }
}
