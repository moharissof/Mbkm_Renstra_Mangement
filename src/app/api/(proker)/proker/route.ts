/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"
import prisma, { serializeBigInt } from "@/lib/prisma"
import { logAction } from '@/lib/logger'

export async function GET(request: Request) {
  try {
    // Get URL and search params
    const { searchParams } = new URL(request.url)

    // Get query parameters
    const query = searchParams.get("query")?.toLowerCase() || ""
    const userId = searchParams.get("user_id")
    const pointRenstraId = searchParams.get("point_renstra_id")
      ? BigInt(searchParams.get("point_renstra_id")!)
      : undefined
    const periodeId = searchParams.get("periode_proker_id") ? BigInt(searchParams.get("periode_proker_id")!) : undefined
    const status = searchParams.get("status")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    // Build filter conditions
    const where: any = {}

    if (query) {
      where.OR = [
        { nama: { contains: query, mode: "insensitive" } },
        { deskripsi: { contains: query, mode: "insensitive" } },
      ]
    }

    if (userId) {
      where.user_id = userId
    }

    if (pointRenstraId) {
      where.point_renstra_id = pointRenstraId
    }

    if (periodeId) {
      where.periode_proker_id = periodeId
    }

    if (status) {
      where.status = status
    }

    // Get total count for pagination
    const total = await prisma.program_kerja.count({ where })

    // Fetch program_kerja items
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
    })

    // Serialize BigInt values before sending the response
    const serializedData = serializeBigInt({
      programKerja,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    })

    // Return response
    return NextResponse.json(serializedData)
  } catch (error) {
    console.error("Error fetching program kerja:", error)
    return NextResponse.json({ error: "Failed to fetch program kerja" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    if (
      !body.nama ||
      !body.point_renstra_id ||
      !body.periode_proker_id ||
      !body.user_id ||
      !body.waktu_mulai ||
      !body.waktu_selesai ||
      !body.volume ||
      !body.indikator_proker 
    ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }
    
    // Start a transaction
    const result = await prisma.$transaction(async (tx : any) => {

      // Check role and user_id
      // Create program_kerja
      const newProgramKerja = await tx.program_kerja.create({
        data: {
          nama: body.nama,
          deskripsi: body.deskripsi,
          strategi_pencapaian: body.strategi_pencapaian,
          progress: 0,
          baseline: body.baseline,
          waktu_mulai: new Date(body.waktu_mulai),
          waktu_selesai: new Date(body.waktu_selesai),
          anggaran: body.anggaran ? BigInt(body.anggaran) : null,
          volume: body.volume,
          status: "Draft", // Default status for new programs
          user_id: body.user_id,
          point_renstra_id: BigInt(body.point_renstra_id),
          periode_proker_id: BigInt(body.periode_proker_id),
          created_at: new Date(),
          updated_at: new Date(),
        },
      })

      // Create indikator_proker entries
      const indikatorPromises = body.indikator_proker.map((indikator: any) =>
        tx.indikator_proker.create({
          data: {
            proker_id: newProgramKerja.id,
            nama: indikator.nama,
            target: indikator.target,
            satuan: indikator.satuan,
            created_at: new Date(),
            updated_at: new Date(),
          },
        }),
      )

      await Promise.all(indikatorPromises)

      // Create point_standar records if provided
      if (body.point_standar && body.point_standar.length > 0) {
        const pointStandarPromises = body.point_standar.map((pointStandar: any) =>
          tx.point_standar.create({
            data: {
              nama: pointStandar.nama,
              point: pointStandar.point,
              created_at: new Date(),
              updated_at: new Date(),
              program_kerja: {
                connect: { id: newProgramKerja.id },
              },
            },
          }),
        )

        await Promise.all(pointStandarPromises)
      }

      // Return the created program with its relations
      return await tx.program_kerja.findUnique({
        where: { id: newProgramKerja.id },
        include: {
          point_renstra: true,
          periode_proker: true,
          indikator_proker: true,
          point_standar: true,
          users: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      })
    })
    // Log activity
    await logAction({
      action: 'CREATE',
      entityType: 'ProgramKerja',
      entityId: result.id,
      userId: result.user_id,
      newData: result,
      request
    })
    // Serialize BigInt values before sending the response
    const serializedProgramKerja = serializeBigInt(result)

    return NextResponse.json(serializedProgramKerja, { status: 201 })
  } catch (error) {
    console.error("Error creating program kerja:", error)
    return NextResponse.json({ error: "Failed to create program kerja" }, { status: 500 })
  }
}

