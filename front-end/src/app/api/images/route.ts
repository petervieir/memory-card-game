import { NextResponse } from "next/server";
import { readdir } from "fs/promises";
import path from "path";

const VALID_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"] as const;

export async function GET() {
  try {
    const imagesDir = path.join(process.cwd(), "public", "images");
    const files = await readdir(imagesDir);

    const imageFiles = files
      .filter((fileName) => {
        const ext = path.extname(fileName).toLowerCase();
        return VALID_EXTENSIONS.includes(ext as (typeof VALID_EXTENSIONS)[number]);
      })
      .sort((a, b) => a.localeCompare(b));

    const urls = imageFiles.map((fileName) => `/images/${fileName}`);

    return NextResponse.json(urls, {
      status: 200,
      headers: { "Cache-Control": "public, max-age=60" },
    });
  } catch (error) {
    console.error("/api/images error:", error);
    return NextResponse.json({ error: "Failed to list images" }, { status: 500 });
  }
}