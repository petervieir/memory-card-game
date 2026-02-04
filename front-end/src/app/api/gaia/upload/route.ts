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
    const body = (await request.json()) as GaiaUploadRequest;
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

    try {
      new URL(hubUrl);
    } catch {
      return NextResponse.json(
        { error: "Invalid Gaia hub URL. Use a full https:// URL." },
        { status: 400 }
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
