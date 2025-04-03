import { type NextRequest, NextResponse } from "next/server"
import prisma, { serializeBigInt } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const reportId = searchParams.get("reportId")

    if (!reportId) {
      return NextResponse.json({ error: "Report ID is required" }, { status: 400 })
    }

    const comments = await prisma.komentar.findMany({
      where: {
        laporan_id: BigInt(reportId),
      },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            photo: true,
            jabatan: {
              select: {
                nama: true,
                role: true,
              },
            },
          },
        },
      },
      orderBy: {
        created_at: "asc",
      },
    })

    // Properly serialize the response
    return NextResponse.json(
      comments.map((comment) => ({
        ...comment,
        id: comment.id.toString(),
        program_kerja_id: comment.program_kerja_id.toString(),
        laporan_id: comment.laporan_id ? comment.laporan_id.toString() : null,
        created_at: comment.created_at ? comment.created_at.toISOString() : null,
        updated_at: comment.updated_at ? comment.updated_at.toISOString() : null,
        users: {
          ...comment.users,
          photo: comment.users?.photo || null
        }
      }))
    )
    
  } catch (error) {
    console.error("Error fetching comments:", error)
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 })
  }
}


export async function POST(request: NextRequest) {
  try {   
    const body = await request.json()
    const { program_kerja_id, user_id, report_id, comment } = body

    if (!program_kerja_id || !user_id || !report_id || !comment) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create the comment
    const newComment = await prisma.komentar.create({
      data: {
        program_kerja_id: BigInt(program_kerja_id),
        user_id,
        laporan_id: BigInt(report_id),
        comment,
        created_at: new Date(),
        updated_at: new Date(),
      },
    })
    const CommentSeriazed = serializeBigInt(newComment)
    return NextResponse.json({
      ...CommentSeriazed,
      id: newComment.id.toString(),
      program_kerja_id: newComment.program_kerja_id.toString(),
      report_id: newComment.laporan_id ? newComment.laporan_id.toString() : null,
    })
  } catch (error) {
    console.error("Error creating comment:", error)
    return NextResponse.json({ error: "Failed to create comment" }, { status: 500 })
  }
}

