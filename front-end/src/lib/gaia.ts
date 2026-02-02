import type { UserSession } from "@stacks/auth";

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

  return userSession.putFile(fileName, content, {
    encrypt: false,
    contentType,
  });
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
