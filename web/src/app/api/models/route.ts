import { NextResponse } from "next/server";
import { listModels } from "@/lib/ollama";

// ---------------------------------------------------------------------------
// GET /api/models
// ---------------------------------------------------------------------------

export async function GET() {
  try {
    const models = await listModels();

    const formatted = models.map((m) => ({
      name: m.name,
      size: m.size,
      sizeHuman: formatBytes(m.size),
      modifiedAt: m.modifiedAt.toISOString(),
      digest: m.digest,
    }));

    return NextResponse.json({ models: formatted });
  } catch (error) {
    console.error("[GET /api/models]", error);

    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const value = bytes / Math.pow(1024, i);
  return `${value.toFixed(1)} ${units[i]}`;
}
