import { NextResponse } from "next/server"
import prisma, { serializeBigInt } from "@/lib/prisma"
import { Role } from "@/types/user"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Get query parameters
    const role = searchParams.get("role");
    const bidang = searchParams.get("bidang");
    const parentId = searchParams.get("parent_id");

    // Build filter conditions
    const where: {
      role?: typeof Role[keyof typeof Role]; // Use Role enum type
      bidang_id?: bigint;
      parent_id?: bigint | null;
    } = {};

    if (role) {
      // Ensure role is a valid value in the Role enum
      if (Object.values(Role).includes(role as Role)) {
        where.role = role as Role;
      } else {
        return NextResponse.json(
          { error: "Invalid role value" },
          { status: 400 }
        );
      }
    }

    if (bidang) {
      where.bidang_id = BigInt(bidang); // Convert bidang to BigInt
    }

    if (parentId) {
      where.parent_id = BigInt(parentId); // Convert parentId to BigInt
    }

    // Get all jabatan (positions) with related bidang
    const jabatan = await prisma.jabatan.findMany({
      where,
      include: {
        parent: true,
        children: true,
        bidang: true, // Include the bidang relation
      },
      orderBy: {
        nama: "asc",
      },
    });

    // Serialize BigInt values before sending the response
    const serializedJabatan = serializeBigInt(jabatan);
    console.log("Data jabatan:", serializedJabatan);
    return NextResponse.json(serializedJabatan);
  } catch (error) {
    console.error("Error fetching jabatan:", error);
    return NextResponse.json(
      { error: "Failed to fetch jabatan" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.nama || !body.role || !body.bidang_id) {
      return NextResponse.json(
        { error: "Missing required fields: nama, role, bidang_id" },
        { status: 400 }
      );
    }

    // Validate role
    if (!Object.values(Role).includes(body.role)) {
      return NextResponse.json(
        { error: "Invalid role value" },
        { status: 400 }
      );
    }

    // Convert parent_id to BigInt if provided
    const parent_id = body.parent_id ? BigInt(body.parent_id) : null;
    const bidang_id = BigInt(body.bidang_id); // Convert bidang_id to BigInt

    // Create new jabatan
    const newJabatan = await prisma.jabatan.create({
      data: {
        nama: body.nama,
        deskripsi: body.deskripsi || null,
        role: body.role,
        parent_id: parent_id,
        bidang_id: bidang_id,
        created_at: new Date(),
        updated_at: new Date(),
      },
      include: {
        parent: true,
      },
    });

    // Serialize BigInt values before sending the response
    const serializedJabatan = serializeBigInt(newJabatan);

    return NextResponse.json(serializedJabatan, { status: 201 });
  } catch (error) {
    console.error("Error creating jabatan:", error);
    return NextResponse.json(
      { error: "Failed to create jabatan" },
      { status: 500 }
    );
  }
}
