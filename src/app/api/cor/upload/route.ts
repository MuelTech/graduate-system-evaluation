import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      id: "cor-upload-eval-01",
      status: "PENDING",
      uploadedAt: new Date().toISOString(),
      message: "Certificate of Registration uploaded for verification.",
    },
    { status: 200 },
  );
}
