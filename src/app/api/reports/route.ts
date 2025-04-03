import { type NextRequest, NextResponse } from "next/server"
import prisma, { serializeBigInt } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const programId = searchParams.get('programId')

    if (!programId) {
      return NextResponse.json(
        { error: 'Program ID is required' },
        { status: 400 }
      )
    }

    const reports = await prisma.laporan.findMany({
      where: {
        program_kerja_id: BigInt(programId)
      },
      include: {
        users: true,
        program_kerja: {
          include: {
            point_renstra: {
              include: {
                bidang: true
              }
            }
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    })
    const serializedReports = serializeBigInt(reports)

    return NextResponse.json(serializedReports)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    
    const body = await request.json()
    const { program_kerja_id, user_id, laporan, realisasi, link_file } = body

    if (!program_kerja_id || !user_id || !laporan) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Verify the program exists
    const program = await prisma.program_kerja.findUnique({
      where: {
        id: BigInt(program_kerja_id),
      },
    })

    if (!program) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 })
    }

    // Create the report
    const report = await prisma.laporan.create({
      data: {
        program_kerja_id: BigInt(program_kerja_id),
        user_id,
        laporan,
        realisasi: realisasi || 0,
        link_file: link_file || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
    })

    // Update the program progress if realisasi is provided
    if (realisasi) {
      await prisma.program_kerja.update({
        where: {
          id: BigInt(program_kerja_id),
        },
        data: {
          progress: realisasi,
        },
      })
    } 
    const reportSerialized = serializeBigInt(report)
    return NextResponse.json({
      ...reportSerialized,
      id: report.id.toString(),
      program_kerja_id: report.program_kerja_id.toString(),
    })
  } catch (error) {
    console.error("Error creating report:", error)
    return NextResponse.json({ error: "Failed to create report" }, { status: 500 })
  }
}

