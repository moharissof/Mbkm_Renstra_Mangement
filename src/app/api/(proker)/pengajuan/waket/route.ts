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
    const bidangId = searchParams.get("bidang_id")
      ? BigInt(searchParams.get("bidang_id")!)
      : undefined
    const status = searchParams.get("status")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    // 1. Get current user's bidang (either from parameter or user's position)
    let targetBidangId = bidangId

    if (!targetBidangId && userId) {
      const userWithPosition = await prisma.users.findUnique({
        where: { id: userId },
        include: {
          jabatan: {
            select: {
              bidang_id: true
            }
          }
        }
      })
      targetBidangId = userWithPosition?.jabatan?.bidang_id
    }

    if (!targetBidangId) {
      return NextResponse.json(
        { error: "Bidang ID is required" },
        { status: 400 }
      )
    }

    // 2. Get all positions in the bidang
    const positionsInBidang = await prisma.jabatan.findMany({
      where: { bidang_id: targetBidangId },
      select: { id: true }
    })

    const positionIds = positionsInBidang.map(p => p.id)

    // 3. Get all users in these positions
    const usersInBidang = await prisma.users.findMany({
      where: {
        jabatan_id: {
          in: positionIds
        }
      },
      select: {
        id: true
      }
    })

    const userIdsInBidang = usersInBidang.map(u => u.id)

    // 4. Build filter conditions
    const where: any = {
      user_id: {
        in: userIdsInBidang
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
      bidangId: targetBidangId,
      userCount: userIdsInBidang.length,
      positionCount: positionIds.length
    })

    return NextResponse.json(serializedData)
  } catch (error) {
    console.error("Error fetching programs by bidang:", error)
    return NextResponse.json(
      { error: "Failed to fetch programs by bidang" },
      { status: 500 }
    )
  }
}