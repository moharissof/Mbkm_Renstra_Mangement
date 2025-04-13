/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import prisma, { serializeBigInt } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    // Get URL and search params
    const { searchParams } = new URL(request.url);

    // Get query parameters
    const query = searchParams.get("query")?.toLowerCase() || "";
    const userId = searchParams.get("user_id");
    const pointRenstraId = searchParams.get("point_renstra_id")
      ? BigInt(searchParams.get("point_renstra_id")!)
      : undefined;
    const periodeId = searchParams.get("periode_proker_id")
      ? BigInt(searchParams.get("periode_proker_id")!)
      : undefined;
    const status = searchParams.get("status"); // Status yang diminta
    const page = Number.parseInt(searchParams.get("page") || "1");
    const limit = Number.parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Build filter conditions
    const where: any = {};

    // Filter by query (nama atau deskripsi)
    if (query) {
      where.OR = [
        { nama: { contains: query, mode: "insensitive" } },
        { deskripsi: { contains: query, mode: "insensitive" } },
      ];
    }

    // Filter by user_id
    if (userId) {
      where.user_id = userId;
    }

    // Filter by point_renstra_id
    if (pointRenstraId) {
      where.point_renstra_id = pointRenstraId;
    }

    // Filter by periode_proker_id
    if (periodeId) {
      where.periode_proker_id = periodeId;
    }

    // Filter by status (jika ada parameter status)
    if (status) {
      // Jika status mengandung koma, split menjadi array
      const statuses = status.includes(',') 
        ? status.split(',') 
        : [status];
      
      where.status = {
        in: statuses
      };
    }

    // Get total count for pagination
    const total = await prisma.program_kerja.count({ where });

    // Fetch program_kerja items with related data
    const programKerja = await prisma.program_kerja.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        created_at: "desc",
      },
      include: {
        point_renstra: {
          include: {
            bidang: true,
            sub_renstra: {
              include: {
                renstra: true,
              },
            },
          },
        },
        periode_proker: true,
        indikator_proker: true,
        point_standar: true,
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            jabatan: true,
          },
        },
      },
    });

    // Serialize BigInt values before sending the response
    const serializedData = serializeBigInt({
      programKerja,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });

    // Return response
    return NextResponse.json(serializedData);
  } catch (error) {
    console.error("Error fetching program kerja:", error);
    return NextResponse.json(
      { error: "Failed to fetch program kerja" },
      { status: 500 }
    );
  }
}