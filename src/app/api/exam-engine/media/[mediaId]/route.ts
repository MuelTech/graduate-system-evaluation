import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { EXAM_MEDIA_ASSET_MAP } from "@/lib/evaluation-mock/applicant-exam-questions";

export async function GET(
  _request: Request,
  context: { params: Promise<{ mediaId: string }> },
) {
  const { mediaId } = await context.params;
  const assetPath = EXAM_MEDIA_ASSET_MAP[mediaId];
  if (!assetPath) {
    return NextResponse.json({ error: "Media not found" }, { status: 404 });
  }

  try {
    const filePath = path.join(
      process.cwd(),
      "public",
      assetPath.replace(/^\/+/, ""),
    );
    const buffer = await fs.readFile(filePath);
    const contentType = assetPath.endsWith(".png")
      ? "image/png"
      : "image/jpeg";
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Asset unreadable" }, { status: 404 });
  }
}
