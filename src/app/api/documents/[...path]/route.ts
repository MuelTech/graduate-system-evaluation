import { promises as fs } from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

const MODEL_TO_SAMPLE_PDF: Record<string, string> = {
  "cor-upload": "sample-cor.pdf",
  "thesis-document": "sample-manuscript.pdf",
  "rap-report": "sample-rap-report.pdf",
  "student-requirement": "sample-cor.pdf",
  "plagiarism-result": "sample-strike-certificate.pdf",
  "elibrary-manuscript": "sample-manuscript.pdf",
  "elibrary-respondent-data": "sample-manuscript.pdf",
};

function resolveSamplePdfFilename(pathSegments: string[]): string {
  const [modelType = "", rawId = ""] = pathSegments;
  const idLower = rawId.toLowerCase();

  if (idLower.includes("cor")) return "sample-cor.pdf";
  if (idLower.includes("strike") || idLower.includes("plag")) {
    return "sample-strike-certificate.pdf";
  }
  if (idLower.includes("rap")) return "sample-rap-report.pdf";
  if (idLower.includes("gs020") || idLower.includes("adviser")) {
    return "sample-gs020-adviser-request.pdf";
  }
  if (idLower.includes("app") || idLower.includes("sched")) {
    return "sample-defense-application.pdf";
  }

  return MODEL_TO_SAMPLE_PDF[modelType] ?? "sample-manuscript.pdf";
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path: pathSegments } = await params;
  const filename = resolveSamplePdfFilename(pathSegments ?? []);
  const filePath = path.join(process.cwd(), "public", "sample-docs", filename);

  try {
    const fileBuffer = await fs.readFile(filePath);
    return new Response(new Uint8Array(fileBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${filename}"`,
        "Cache-Control": "public, max-age=3600",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return NextResponse.redirect(new URL(`/sample-docs/${filename}`, req.url));
  }
}
