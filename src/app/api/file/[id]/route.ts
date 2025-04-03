import { type NextRequest, NextResponse } from "next/server"
import prisma, {serializeBigInt} from "@/lib/prisma"
import { deleteFile, updateFile } from "@/services/Drive"
type Params = Promise<{ id: string }>;
// GET /api/files/[id] - Get a specific file
export async function GET(request: NextRequest, { params }: { params : Params }) {
  try {
    const id = (await params).id

    const file = await prisma.file.findMany({
        where: {
          proker_id: BigInt(id), // Konversi ke BigInt jika perlu
          deleted_at: null,
        },
      });

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }
    const serializedFile = serializeBigInt(file)
    return NextResponse.json(serializedFile || [])
    
  } catch (error) {
    console.error("Error fetching file:", error)
    return NextResponse.json({ error: "Failed to fetch file" }, { status: 500 })
  }
}

// PUT /api/files/[id] - Update a file
export async function PUT(request: NextRequest, { params }: { params : Params }) {
  try {


    const id = Number.parseInt((await params).id)
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
    }

    // Check if file exists
    const existingFile = await prisma.file.findUnique({
      where: {
        id,
        deleted_at: null,
      },
    })

    if (!existingFile) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    // Parse the form data or JSON
    let fileName, fileContent, mimeType

    const contentType = request.headers.get("content-type") || ""

    if (contentType.includes("multipart/form-data")) {
      // Handle form data with file upload
      const formData = await request.formData()
      const file = formData.get("file") as File
      fileName = (formData.get("fileName") as string) || file.name

      if (file) {
        fileContent = Buffer.from(await file.arrayBuffer())
        mimeType = file.type
      }
    } else {
      // Handle JSON data (just name update)
      const body = await request.json()
      fileName = body.file
    }

    if (!fileName) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 })
    }

    // Update file in Google Drive if we have a drive_file_id
    if (existingFile.drive_file_id && fileName) {
      await updateFile(existingFile.drive_file_id, fileName, fileContent, mimeType)
    }

    // Update file in database
    const updatedFile = await prisma.file.update({
      where: { id },
      data: {
        file: fileName,
        ...(mimeType && { mime_type: mimeType }),
        updated_at: new Date(),
      },
    })
    const serializedFile = serializeBigInt(updatedFile)
    return NextResponse.json(serializedFile || [])
  } catch (error) {
    console.error("Error updating file:", error)
    return NextResponse.json({ error: "Failed to update file" }, { status: 500 })
  }
}

// DELETE /api/files/[id] - Soft delete a file and optionally delete from Google Drive
export async function DELETE(request: NextRequest, { params }: { params : Params }) {
  try {

    const id = Number.parseInt((await params).id)
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
    }

    // Check if file exists
    const existingFile = await prisma.file.findUnique({
      where: {
        id,
        deleted_at: null,
      },
    })

    if (!existingFile) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    // Delete from Google Drive if we have a drive_file_id
    if (existingFile.drive_file_id) {
      try {
        await deleteFile(existingFile.drive_file_id)
      } catch (driveError) {
        console.error("Error deleting file from Google Drive:", driveError)
        // Continue with database deletion even if Drive deletion fails
      }
    }

    // Soft delete file in database
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const deletedFile = await prisma.file.update({
      where: { id },
      data: {
        deleted_at: new Date(),
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting file:", error)
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 })
  }
}

