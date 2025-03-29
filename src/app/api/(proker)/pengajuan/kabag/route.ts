/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server'
import { prisma, serializeBigInt } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    // Get URL and search params
    const { searchParams } = new URL(request.url)

    // Get query parameters
    const query = searchParams.get("query")?.toLowerCase() || ""
    const userId = searchParams.get("user_id")
    const status = searchParams.get("status")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    // 1. Get current user's position
    const currentUser = await prisma.users.findUnique({
      where: { id: userId || '' },
      select: { jabatan_id: true }
    })

    if (!currentUser?.jabatan_id) {
      return NextResponse.json(
        { error: "User position not found" },
        { status: 404 }
      )
    }

    // 2. Get all subordinate positions (recursive)
    const getSubordinateIds = async (positionId: bigint): Promise<bigint[]> => {
      const subordinates = await prisma.jabatan.findMany({
        where: { parent_id: positionId },
        select: { id: true }
      })

      let ids = subordinates.map((j: any) => j.id)
      
      for (const sub of subordinates) {
        const childIds = await getSubordinateIds(sub.id)
        ids = [...ids, ...childIds]
      }

      return ids
    }

    const subordinateIds = await getSubordinateIds(currentUser.jabatan_id)

    // 3. Get users in subordinate positions
    const subordinateUsers = await prisma.users.findMany({
      where: {
        jabatan_id: {
          in: subordinateIds
        }
      },
      select: {
        id: true
      }
    })

    const subordinateUserIds = subordinateUsers.map((u: any) => u.id)

    // 4. Build filter conditions
    const where: any = {
      user_id: {
        in: subordinateUserIds
      }
    }

    if (query) {
      where.OR = [
        { nama: { contains: query, mode: "insensitive" } },
        { deskripsi: { contains: query, mode: "insensitive" } },
      ]
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
            jabatan: {
              include: {
                bidang: true
              }
            },
          },
        },
      },
    })

    // Serialize BigInt values
    const serializedData = serializeBigInt({
      programKerja,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      subordinateCount: subordinateUserIds.length
    })

    return NextResponse.json(serializedData)
  } catch (error) {
    console.error("Error fetching subordinate programs:", error)
    return NextResponse.json(
      { error: "Failed to fetch subordinate programs" },
      { status: 500 }
    )
  }
}