import { NextRequest, NextResponse } from "next/server";
import { analyzeImage } from "@/lib/ai-service";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") ?? "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "Content-Type must be multipart/form-data" },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No image file provided. Use the field name 'image'." },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error: `Unsupported file type: ${file.type}. Allowed: ${ALLOWED_MIME_TYPES.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: `File too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum: ${MAX_FILE_SIZE / 1024 / 1024} MB`,
        },
        { status: 400 }
      );
    }

    // Convert to Buffer and send to AI service
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await analyzeImage(buffer, file.type);

    return NextResponse.json({
      description: result.description,
      confidence: result.confidence,
      tags: result.tags,
    });
  } catch (error) {
    console.error("[POST /api/generate/image-analyze]", error);

    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
