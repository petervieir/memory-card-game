import type { UserSession } from "@stacks/auth";
import { Storage } from "@stacks/storage";

interface GaiaUploadOptions {
  readonly fileName: string;
  readonly content: string;
  readonly contentType?: string;
}

export async function uploadToGaia(
  userSession: UserSession,
  { fileName, content, contentType = "application/json" }: GaiaUploadOptions
): Promise<string> {
  if (!userSession.isUserSignedIn()) {
    throw new Error("Wallet not connected");
  }

  try {
    const storage = new Storage({ userSession });
    
    return await storage.putFile(fileName, content, {
      encrypt: false,
      contentType,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown Gaia error";
    console.error("Gaia upload error details:", {
      error,
      message,
      fileName,
    });
    throw new Error(`Gaia upload failed: ${message}`);
  }
}

export async function uploadNftMetadata(
  userSession: UserSession,
  metadata: Record<string, unknown>,
  fileName: string
): Promise<string> {
  const content = JSON.stringify(metadata, null, 2);
  return uploadToGaia(userSession, {
    fileName: `nft-metadata/${fileName}.json`,
    content,
  });
}
