import type { UserSession } from "@stacks/auth";
import { Storage } from "@stacks/storage";

interface GaiaUploadOptions {
  readonly fileName: string;
  readonly content: string;
  readonly contentType?: string;
}

// Default public Gaia hub URLs (fallback if user's hub is not available)
const DEFAULT_GAIA_HUBS = {
  testnet: "https://hub.blockstack.org",
  mainnet: "https://hub.blockstack.org",
};

function getGaiaHubUrl(userSession: UserSession): string {
  try {
    if (!userSession.isUserSignedIn()) {
      throw new Error("Wallet not connected");
    }

    const userData = userSession.loadUserData();
    
    // Try to get hub URL from user's profile
    const hubUrl = userData?.profile?.hubUrl || userData?.gaiaHubUrl;
    
    if (hubUrl) {
      return hubUrl;
    }

    // Fallback to default hub based on network
    const networkType = process.env.NEXT_PUBLIC_STACKS_NETWORK || "testnet";
    return DEFAULT_GAIA_HUBS[networkType as keyof typeof DEFAULT_GAIA_HUBS] || DEFAULT_GAIA_HUBS.testnet;
  } catch (error) {
    // If we can't determine the hub, use default
    const networkType = process.env.NEXT_PUBLIC_STACKS_NETWORK || "testnet";
    return DEFAULT_GAIA_HUBS[networkType as keyof typeof DEFAULT_GAIA_HUBS] || DEFAULT_GAIA_HUBS.testnet;
  }
}

export async function uploadToGaia(
  userSession: UserSession,
  { fileName, content, contentType = "application/json" }: GaiaUploadOptions
): Promise<string> {
  if (!userSession.isUserSignedIn()) {
    throw new Error("Wallet not connected");
  }

  try {
    const gaiaHubUrl = getGaiaHubUrl(userSession);
    console.log("Using Gaia hub:", gaiaHubUrl);
    
    const storage = new Storage({ 
      userSession,
      gaiaHubUrl, // Explicitly set the hub URL
    });
    
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
