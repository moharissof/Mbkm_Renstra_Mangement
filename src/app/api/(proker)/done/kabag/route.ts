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

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      )
    }

    // 1. Get current user's position and subordinates
    const currentUser = await prisma.users.findUnique({
      where: { id: userId },
      include: {
        jabatan: {
          include: {
            bidang: true,
            parent: true,
            children: true
          }
        }
      }
    })

    if (!currentUser?.jabatan) {
      return NextResponse.json(
        { error: "User position not found" },
        { status: 404 }
      )
    }

    // 2. Get all subordinate IDs (including current user)
    let subordinateIds: string[] = [userId]

    if (currentUser.jabatan.children?.length > 0) {
      const subordinates = await prisma.users.findMany({
        where: {
          jabatan_id: {
            in: currentUser.jabatan.children.map(p => p.id)
          }
        },
        select: { id: true }
      })
      subordinateIds = [...subordinateIds, ...subordinates.map(u => u.id)]
    }

    // 3. Build filter conditions
    const where: any = {
      user_id: { in: subordinateIds },
      progress: 100, // Only programs with 100% progress
      NOT: {
        status: {
          in: ['Done', 'Pengajuan_penyelesaian'] // Exclude these statuses
        }
      }
    }

    // Add search query filter if provided
    if (query) {
      where.OR = [
        { nama: { contains: query, mode: "insensitive" } },
        { deskripsi: { contains: query, mode: "insensitive" } },
      ]
    }

    // Override status filter if specific status is requested
    if (status) {
      where.status = status
      delete where.NOT // Remove the status exclusion when specific status is requested
    }

    // 4. Get total count for pagination
    const total = await prisma.program_kerja.count({ where })

    // 5. Fetch program items with pagination
    const programKerja = await prisma.program_kerja.findMany({
      where,
      skip,
      take: limit,
      orderBy: { created_at: "desc" },
      include: {
        point_renstra: {
          include: {
            bidang: true,
            sub_renstra: { include: { renstra: true } }
          }
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
                bidang: true,
                parent: true
              }
            }
          }
        },
        laporan: {
          orderBy: { created_at: 'desc' },
          take: 1,
          select: {
            id: true,
            realisasi: true,
            created_at: true,
            laporan: true
          }
        }
      }
    })

    // 6. Prepare response data
    const responseData = {
      programKerja,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      currentUser: {
        id: currentUser.id,
        name: currentUser.name,
        position: currentUser.jabatan
      },
      subordinateCount: subordinateIds.length - 1, // Exclude self
      filters: {
        query,
        status: status || '100%_progress_excluding_done_and_pengajuan'
      }
    }

    // 7. Serialize and return response
    return NextResponse.json(serializeBigInt(responseData))

  } catch (error) {
    console.error("Error fetching programs:", error)
    return NextResponse.json(
      { error: "Failed to fetch programs" },
      { status: 500 }
    )
  }
}