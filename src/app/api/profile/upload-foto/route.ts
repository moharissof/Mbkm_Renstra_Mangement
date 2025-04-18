import { NextResponse } from "next/server";
import { ensureFolderProfile, uploadFile, getShareableLink } from "@/services/Drive";

export async function POST(request: Request) {
  try {
    // Parse form data
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const name = formData.get("name") as string;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Validate file (only images < 5MB)
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Only JPEG, PNG, or WEBP images are allowed" },
        { status: 400 }
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size must be less than 5MB" },
        { status: 400 }
      );
    }

    // Create profile folder if it doesn't exist
    const profileFolder = await ensureFolderProfile("Profile Photos");

    // Upload to Google Drive
    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadedFile = await uploadFile(
      `profile-${name}-${Date.now()}${file.name.substring(
        file.name.lastIndexOf(".")
      )}`,
      buffer,
      file.type,
      profileFolder.id as string
    );
    
    if (!uploadedFile.id) {
      throw new Error("Uploaded file ID is invalid");
    }
    const shareableLink = await getShareableLink(uploadedFile.id);
    if (!shareableLink) {
      throw new Error("Failed to create shareable link");
    }

    // Return file ID (not URL) as requested
    return NextResponse.json(
      {
        id: uploadedFile.id,
        message: "Profile photo uploaded successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Profile photo upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
