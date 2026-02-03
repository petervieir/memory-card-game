import type { UserSession, UserData } from "@stacks/auth";

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

export async function uploadToGaia(
  userSession: UserSession,
  { fileName, content, contentType = "application/json" }: GaiaUploadOptions
): Promise<string> {
  if (!userSession.isUserSignedIn()) {
    throw new Error("Wallet not connected");
  }

  try {
    const userData = userSession.loadUserData() as UserData | null;
    if (!userData) {
      throw new Error("Missing wallet session data");
    }

    const hubUrl = normalizeHubUrl(userSession);
    if (!hubUrl) {
      throw new Error("Missing Gaia hub URL");
    }

    if (!userData.appPrivateKey) {
      throw new Error("Missing Gaia app private key");
    }

    const response = await fetch("/api/gaia/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileName,
        content,
        contentType,
        hubUrl,
        appPrivateKey: userData.appPrivateKey,
        gaiaAssociationToken: userData.gaiaAssociationToken,
      }),
    });

    if (!response.ok) {
      let errorMessage = `Gaia upload failed (${response.status})`;
      try {
        const errorBody = (await response.json()) as { error?: string };
        if (errorBody?.error) {
          errorMessage = errorBody.error;
        }
      } catch {
        // ignore parse errors
      }
      throw new Error(errorMessage);
    }

    const json = (await response.json()) as { publicURL?: string };
    if (!json.publicURL) {
      throw new Error("Gaia upload failed: missing public URL");
    }

    return json.publicURL;
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
