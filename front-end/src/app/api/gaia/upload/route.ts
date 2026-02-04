import { NextResponse } from "next/server";
import type { GaiaHubConfig } from "@stacks/storage";
import { connectToGaiaHub, uploadToGaiaHub } from "@stacks/storage";

export const runtime = "nodejs";

type GaiaUploadRequest = {
  fileName: string;
  content: string;
  contentType?: string;
  hubUrl: string;
  appPrivateKey: string;
  gaiaAssociationToken?: string;
  gaiaHubConfig?: {
    address: string;
    url_prefix: string;
    token: string;
    max_file_upload_size_megabytes?: number;
    server: string;
  };
};

type GaiaUploadParams = {
  fileName: string;
  content: string;
  contentType: string;
  hubUrl: string;
  appPrivateKey: string;
  gaiaAssociationToken?: string;
  gaiaHubConfig?: GaiaHubConfig;
};

type ApiError = {
  status: number;
  message: string;
};

function toApiError(status: number, message: string): ApiError {
  return { status, message };
}

function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    "message" in error
  );
}

async function parseRequestBody(request: Request): Promise<GaiaUploadRequest> {
  try {
    return (await request.json()) as GaiaUploadRequest;
  } catch (parseError) {
    console.warn("Invalid JSON in Gaia upload request:", parseError);
    throw toApiError(400, "Invalid JSON in request body");
  }
}

function normalizeRequestBody(body: GaiaUploadRequest): GaiaUploadParams {
  const fileName = body.fileName?.trim();
  const content = body.content;
  const contentType = body.contentType || "application/json";
  const hubUrl = body.hubUrl?.trim();
  const appPrivateKey = body.appPrivateKey?.trim();
  const gaiaAssociationToken = body.gaiaAssociationToken?.trim();

  if (!fileName || !content || !hubUrl || !appPrivateKey) {
    throw toApiError(
      400,
      "Missing fileName, content, hubUrl, or appPrivateKey for Gaia upload"
    );
  }

  try {
    new URL(hubUrl);
  } catch {
    throw toApiError(400, "Invalid Gaia hub URL. Use a full https:// URL.");
  }

  let gaiaHubConfig: GaiaHubConfig | undefined;
  if (body.gaiaHubConfig) {
    gaiaHubConfig = {
      address: body.gaiaHubConfig.address,
      url_prefix: body.gaiaHubConfig.url_prefix,
      token: body.gaiaHubConfig.token,
      max_file_upload_size_megabytes:
        body.gaiaHubConfig.max_file_upload_size_megabytes,
      server: body.gaiaHubConfig.server,
    };
  }

  return {
    fileName,
    content,
    contentType,
    hubUrl,
    appPrivateKey,
    gaiaAssociationToken,
    gaiaHubConfig,
  };
}

async function resolveHubConfig(params: GaiaUploadParams): Promise<GaiaHubConfig> {
  if (params.gaiaHubConfig) {
    return params.gaiaHubConfig;
  }

  const hubInfoUrl = params.hubUrl.replace(/\/$/, "") + "/hub_info";
  try {
    const hubInfoResponse = await fetch(hubInfoUrl, { method: "GET" });
    const hubInfoText = await hubInfoResponse.text();
    if (!hubInfoResponse.ok) {
      throw toApiError(
        502,
        `Gaia hub_info failed (${hubInfoResponse.status}): ${hubInfoResponse.statusText}`
      );
    }
    try {
      JSON.parse(hubInfoText);
    } catch {
      throw toApiError(
        502,
        "Gaia hub_info returned invalid JSON. The hub may be unavailable or blocked."
      );
    }
  } catch (error) {
    if (isApiError(error)) {
      throw error;
    }
    const message = error instanceof Error ? error.message : "Unknown error";
    throw toApiError(502, `Failed to reach Gaia hub_info: ${message}`);
  }

  return connectToGaiaHub(
    params.hubUrl,
    params.appPrivateKey,
    params.gaiaAssociationToken
  );
}

export async function POST(request: Request) {
  try {
    const body = await parseRequestBody(request);
    const params = normalizeRequestBody(body);
    console.log("Gaia upload hub URL:", params.hubUrl);
    const hubConfig = await resolveHubConfig(params);

    const uploadResponse = await uploadToGaiaHub(
      params.fileName,
      params.content,
      hubConfig,
      params.contentType
    );

    return NextResponse.json({ publicURL: uploadResponse.publicURL });
  } catch (error) {
    if (isApiError(error)) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Gaia upload API failed:", {
      message,
      error,
    });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
