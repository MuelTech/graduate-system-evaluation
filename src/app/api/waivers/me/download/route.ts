import { promises as fs } from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const filename = "sample-defense-application.pdf";
  const filePath = path.join(process.cwd(), "public", "sample-docs", filename);

  try {
    const fileBuffer = await fs.readFile(filePath);
    return new Response(new Uint8Array(fileBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition":
          'attachment; filename="Bridging-Waiver-Maria-Lourdes-Villanueva.pdf"',
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return NextResponse.redirect(new URL(`/sample-docs/${filename}`, req.url));
  }
}
