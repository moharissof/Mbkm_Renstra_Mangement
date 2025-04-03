/* eslint-disable @typescript-eslint/no-unused-vars */
import { type NextRequest, NextResponse } from "next/server";
import prisma, { serializeBigInt } from "@/lib/prisma";
import { ensureProgramFolder, uploadFile, getShareableLink } from "@/services/Drive";

interface UploadRequestData {
  file: File;
  proker_id: string;
  programName: string;
  user_id: string;
}

export async function POST(request: NextRequest) {
  try {
    // Parse and validate form data
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const proker_id = formData.get("proker_id") as string;
    const programName = formData.get("programName") as string;
    const user_id = formData.get("user_id") as string;

    if (!file || !proker_id || !programName || !user_id) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get file buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // 1. First ensure the program folder exists
    const folder = await ensureProgramFolder(proker_id, programName);
    if (!folder?.id) {
      console.error("Folder creation failed:", folder);
      throw new Error("Failed to create program folder in Google Drive");
    }

    // 2. Upload file to the folder
    const uploadedFile = await uploadFile(
      file.name,
      buffer,
      file.type,
      folder.id
    );

    if (!uploadedFile?.id) {
      console.error("File upload failed:", uploadedFile);
      throw new Error("Failed to upload file to Google Drive");
    }

    // 3. Create shareable link
    const shareableLink = await getShareableLink(uploadedFile.id);
    if (!shareableLink) {
      throw new Error("Failed to create shareable link");
    }

    // 4. Save to database
    const newFile = await prisma.file.create({
      data: {
        proker_id: Number(proker_id),
        user_id,
        file: file.name,
        link_drive: shareableLink,
        drive_file_id: uploadedFile.id,
        mime_type: file.type,
        thumbnail_url: uploadedFile.thumbnailLink || null,
      },
    });

    return NextResponse.json(
      {
        ...serializeBigInt(newFile),
        webViewLink: uploadedFile.webViewLink,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Upload error details:", error);
    return NextResponse.json(
      { 
        error: "File upload failed",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}