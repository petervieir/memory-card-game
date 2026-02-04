import { NextResponse } from "next/server";
import { connectToGaiaHub, uploadToGaiaHub } from "@stacks/storage";

export const runtime = "nodejs";

type GaiaUploadRequest = {
  fileName: string;
  content: string;
  contentType?: string;
  hubUrl: string;
  appPrivateKey: string;
  gaiaAssociationToken?: string;
};

export async function POST(request: Request) {
  try {
    let body: GaiaUploadRequest;
    try {
      body = (await request.json()) as GaiaUploadRequest;
    } catch (parseError) {
      console.warn("Invalid JSON in Gaia upload request:", parseError);
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }
    const fileName = body.fileName?.trim();
    const content = body.content;
    const contentType = body.contentType || "application/json";
    const hubUrl = body.hubUrl?.trim();
    const appPrivateKey = body.appPrivateKey?.trim();
    const gaiaAssociationToken = body.gaiaAssociationToken?.trim();

    if (!fileName || !content || !hubUrl || !appPrivateKey) {
      return NextResponse.json(
        {
          error:
            "Missing fileName, content, hubUrl, or appPrivateKey for Gaia upload",
        },
        { status: 400 }
      );
    }

    console.log("Gaia upload hub URL:", hubUrl);

    try {
      new URL(hubUrl);
    } catch {
      return NextResponse.json(
        { error: "Invalid Gaia hub URL. Use a full https:// URL." },
        { status: 400 }
      );
    }

    const hubInfoUrl = hubUrl.replace(/\/$/, "") + "/hub_info";
    try {
      const hubInfoResponse = await fetch(hubInfoUrl, { method: "GET" });
      const hubInfoText = await hubInfoResponse.text();
      if (!hubInfoResponse.ok) {
        return NextResponse.json(
          {
            error: `Gaia hub_info failed (${hubInfoResponse.status}): ${hubInfoResponse.statusText}`,
          },
          { status: 502 }
        );
      }
      try {
        JSON.parse(hubInfoText);
      } catch {
        return NextResponse.json(
          {
            error:
              "Gaia hub_info returned invalid JSON. The hub may be unavailable or blocked.",
          },
          { status: 502 }
        );
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return NextResponse.json(
        { error: `Failed to reach Gaia hub_info: ${message}` },
        { status: 502 }
      );
    }

    const hubConfig = await connectToGaiaHub(
      hubUrl,
      appPrivateKey,
      gaiaAssociationToken
    );

    const uploadResponse = await uploadToGaiaHub(
      fileName,
      content,
      hubConfig,
      contentType
    );

    return NextResponse.json({ publicURL: uploadResponse.publicURL });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Gaia upload API failed:", {
      message,
      error,
    });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
