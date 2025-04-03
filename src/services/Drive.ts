/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { google } from "googleapis";
import { Readable } from "stream";

// Load configuration from environment variables
const config = {
    clientId: process.env.GOOGLE_DRIVE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_DRIVE_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_DRIVE_REFRESH_TOKEN,
    redirectUri: process.env.GOOGLE_DRIVE_REDIRECT_URI,
    mainFolderName: process.env.GOOGLE_DRIVE_MAIN_FOLDER_NAME || "renstra"
  };
  
  // Validate configuration
  if (!config.clientId || !config.clientSecret || !config.refreshToken) {
    throw new Error("Missing Google Drive API configuration in environment variables");
  }


const oauth2Client = new google.auth.OAuth2(
    config.clientId,
    config.clientSecret,
    config.redirectUri
  );
  // Set credentials with refresh token
oauth2Client.setCredentials({
    refresh_token: config.refreshToken
  });
// Create Google Drive instance
const drive = google.drive({
    version: "v3",
    auth: oauth2Client
  });
// MAIN FOLDER NAME
const MAIN_FOLDER_NAME = "renstra";

// Find or create the main renstra folder
async function getMainFolder() {
  try {
    // Search for existing main folder
    const query = `name = '${MAIN_FOLDER_NAME}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`;
    const response = await drive.files.list({
      q: query,
      fields: "files(id, name)",
      pageSize: 1
    });

    if (response.data.files && response.data.files.length > 0) {
      return response.data.files[0];
    }

    // Create main folder if not exists
    const folder = await drive.files.create({
      requestBody: {
        name: MAIN_FOLDER_NAME,
        mimeType: "application/vnd.google-apps.folder"
      },
      fields: "id, name"
    });

    return folder.data;
  } catch (error) {
    console.error("Error getting main folder:", error);
    throw error;
  }
}

// Create a folder inside renstra
export async function createFolder(folderName: string) {
  try {
    const mainFolder = await getMainFolder();
    const response = await drive.files.create({
      requestBody: {
        name: folderName,
        mimeType: "application/vnd.google-apps.folder",
        parents: [mainFolder.id as string]
      },
      fields: "id, name, webViewLink",
    });

    return response.data;
  } catch (error) {
    console.error("Error creating folder:", error);
    throw error;
  }
}

// Find existing program folder inside renstra
export async function findProgramFolder(programId: string, programName: string) {
  try {
    const mainFolder = await getMainFolder();
    const query = `name = 'Program-${programId}: ${programName}' and mimeType = 'application/vnd.google-apps.folder' and '${mainFolder.id}' in parents and trashed = false`;
    
    const response = await drive.files.list({
      q: query,
      fields: "files(id, name, webViewLink)",
      pageSize: 1
    });

    return response.data.files?.[0] || null;
  } catch (error) {
    console.error("Error finding program folder:", error);
    throw error;
  }
}

// Ensure program folder exists in renstra (find or create)
export async function ensureProgramFolder(programId: string, programName: string) {
  try {
    // Try to find existing folder first
    const existingFolder = await findProgramFolder(programId, programName);
    if (existingFolder) {
      return existingFolder;
    }

    // Create new folder inside renstra if not found
    const mainFolder = await getMainFolder();
    const response = await drive.files.create({
      requestBody: {
        name: `Program-${programId}: ${programName}`,
        mimeType: "application/vnd.google-apps.folder",
        parents: [mainFolder.id as string]
      },
      fields: "id, name, webViewLink",
    });

    return response.data;
  } catch (error) {
    console.error("Error ensuring program folder:", error);
    throw error;
  }
}

// Upload file to program folder inside renstra
export async function uploadToProgramFolder(
  programId: string,
  programName: string,
  fileName: string,
  fileContent: Buffer | Readable,
  mimeType: string
) {
  try {
    // Find existing folder (don't create new one)
    const folder = await findProgramFolder(programId, programName);
    
    if (!folder) {
      throw new Error("Program folder not found");
    }

    // Upload file to the folder
    return await uploadFile(
      fileName,
      fileContent,
      mimeType,
      folder.id as string
    );
  } catch (error) {
    console.error("Error uploading to program folder:", error);
    throw error;
  }
}

// Upload a file to specific folder in renstra
export async function uploadFile(
  fileName: string,
  fileContent: Buffer | Readable,
  mimeType: string,
  folderId?: string,
) {
  try {
    const mainFolder = await getMainFolder();
    const parentId = folderId || mainFolder.id as string;

    const response = await drive.files.create({
      requestBody: {
        name: fileName,
        parents: [parentId]
      },
      media: {
        mimeType,
        body: fileContent instanceof Buffer ? Readable.from(fileContent) : fileContent,
      },
      fields: "id, name, webViewLink, mimeType, thumbnailLink",
    });

    return response.data;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}

// Get a file from Google Drive
export async function getFile(fileId: string) {
  try {
    const response = await drive.files.get({
      fileId,
      fields: "id, name, webViewLink, mimeType, thumbnailLink",
    });

    return response.data;
  } catch (error) {
    console.error("Error getting file:", error);
    throw error;
  }
}

// List files in a specific folder within renstra
export async function listFiles(folderId?: string, query?: string) {
  try {
    const mainFolder = await getMainFolder();
    const parentId = folderId || mainFolder.id as string;
    let q = `'${parentId}' in parents`;

    if (query) {
      q += ` and ${query}`;
    }

    const response = await drive.files.list({
      q,
      fields: "files(id, name, mimeType, webViewLink, thumbnailLink, createdTime, modifiedTime)",
      orderBy: "modifiedTime desc",
    });

    return response.data.files || [];
  } catch (error) {
    console.error("Error listing files:", error);
    throw error;
  }
}

// Delete a file from Google Drive
export async function deleteFile(fileId: string) {
  try {
    await drive.files.delete({
      fileId,
    });
    return true;
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
}

// Update a file in Google Drive
export async function updateFile(
  fileId: string,
  fileName: string,
  fileContent?: Buffer | Readable,
  mimeType?: string
) {
  try {
    const requestParams: any = {
      fileId,
      requestBody: {
        name: fileName
      },
      fields: "id, name, webViewLink, mimeType, thumbnailLink",
    };

    if (fileContent && mimeType) {
      requestParams.media = {
        mimeType,
        body: fileContent instanceof Buffer ? Readable.from(fileContent) : fileContent,
      };
    }

    const response = await drive.files.update(requestParams);
    return response.data;
  } catch (error) {
    console.error("Error updating file:", error);
    throw error;
  }
}

// Get a shareable link for a file
export async function getShareableLink(fileId: string) {
  try {
    await drive.permissions.create({
      fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

    const file = await drive.files.get({
      fileId,
      fields: "webViewLink",
    });

    return file.data.webViewLink;
  } catch (error) {
    console.error("Error creating shareable link:", error);
    throw error;
  }
}

// Get file thumbnail or icon based on mime type
export function getFileIconUrl(mimeType: string) {
  const mimeTypeMap: Record<string, string> = {
    "application/pdf": "/icons/pdf.png",
    "application/msword": "/icons/doc.png",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "/icons/doc.png",
    "application/vnd.ms-excel": "/icons/xls.png",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "/icons/xls.png",
    "application/vnd.ms-powerpoint": "/icons/ppt.png",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": "/icons/ppt.png",
    "image/jpeg": "/icons/image.png",
    "image/png": "/icons/image.png",
    "image/gif": "/icons/image.png",
    "text/plain": "/icons/txt.png",
    "application/zip": "/icons/zip.png",
    "application/x-zip-compressed": "/icons/zip.png",
    "application/vnd.google-apps.folder": "/icons/folder.png",
    "application/vnd.google-apps.document": "/icons/gdoc.png",
    "application/vnd.google-apps.spreadsheet": "/icons/gsheet.png",
    "application/vnd.google-apps.presentation": "/icons/gslides.png",
  };

  return mimeTypeMap[mimeType] || "/icons/file.png";
}

export default {
  getMainFolder,
  createFolder,
  findProgramFolder,
  ensureProgramFolder,
  uploadToProgramFolder,
  uploadFile,
  getFile,
  listFiles,
  deleteFile,
  updateFile,
  getShareableLink,
  getFileIconUrl,
};