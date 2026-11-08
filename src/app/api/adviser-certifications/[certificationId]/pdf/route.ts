import { promises as fs } from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ certificationId: string }> },
) {
  const { certificationId } = await params;
  const filename = "sample-gs020-adviser-request.pdf";
  const filePath = path.join(process.cwd(), "public", "sample-docs", filename);

  try {
    const fileBuffer = await fs.readFile(filePath);
    return new Response(new Uint8Array(fileBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="Adviser-Certification-${encodeURIComponent(certificationId)}.pdf"`,
        "Cache-Control": "public, max-age=3600",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return NextResponse.redirect(new URL(`/sample-docs/${filename}`, req.url));
  }
}
