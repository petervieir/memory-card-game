import type { UserSession, UserData } from "@stacks/auth";
import { Storage } from "@stacks/storage";

interface GaiaUploadOptions {
  readonly fileName: string;
  readonly content: string;
  readonly contentType?: string;
}

function normalizeHubUrl(userSession: UserSession): string | null {
  const userData = userSession.loadUserData() as UserData | null;
  const envHubUrl = process.env.NEXT_PUBLIC_GAIA_HUB_URL;
  const hubUrlFromSession = userData?.hubUrl;
  if (!envHubUrl && !hubUrlFromSession) return null;

  let hubUrl = envHubUrl || hubUrlFromSession || "";
  const windowRef = globalThis.window;
  if (windowRef?.location.protocol === "https:" && hubUrl.startsWith("http://")) {
    hubUrl = hubUrl.replace(/^http:\/\//, "https://");
  }

  const sessionData = userSession.store.getSessionData();
  if (sessionData.userData && hubUrl && sessionData.userData.hubUrl !== hubUrl) {
    sessionData.userData.hubUrl = hubUrl;
    sessionData.userData.gaiaHubConfig = undefined;
    userSession.store.setSessionData(sessionData);
  }

  return hubUrl;
}

async function verifyGaiaHubAccess(hubUrl: string): Promise<void> {
  const hubInfoUrl = hubUrl.replace(/\/$/, "") + "/hub_info";
  try {
    const response = await fetch(hubInfoUrl, { method: "GET", mode: "cors" });
    if (!response.ok) {
      throw new Error(`Hub info failed: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to reach Gaia hub";
    throw new Error(
      `Gaia hub blocked (CORS or network). Set NEXT_PUBLIC_GAIA_HUB_URL to a hub that allows your origin. (${message})`
    );
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
    const storage = new Storage({ userSession });
    const hubUrl = normalizeHubUrl(userSession);
    if (hubUrl) {
      console.log("Gaia hub URL:", hubUrl);
      await verifyGaiaHubAccess(hubUrl);
    }
    
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
