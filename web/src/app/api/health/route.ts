import { NextResponse } from "next/server";
import { checkHealth as checkOllamaHealth } from "@/lib/ollama";
import { checkAIServiceHealth } from "@/lib/ai-service";

// ---------------------------------------------------------------------------
// GET /api/health
// ---------------------------------------------------------------------------

export async function GET() {
  try {
    // Check both services concurrently
    const [ollamaStatus, aiServiceStatus] = await Promise.all([
      checkOllamaHealth(),
      checkAIServiceHealth(),
    ]);

    const allHealthy = ollamaStatus.healthy && aiServiceStatus.healthy;

    const response = {
      status: allHealthy ? "healthy" : "degraded",
      timestamp: new Date().toISOString(),
      services: {
        ollama: {
          status: ollamaStatus.healthy ? "up" : "down",
          models: ollamaStatus.models,
          ...(ollamaStatus.error && { error: ollamaStatus.error }),
        },
        aiService: {
          status: aiServiceStatus.healthy ? "up" : "down",
          ...(aiServiceStatus.version && { version: aiServiceStatus.version }),
          ...(aiServiceStatus.modelLoaded !== undefined && {
            modelLoaded: aiServiceStatus.modelLoaded,
          }),
          ...(aiServiceStatus.error && { error: aiServiceStatus.error }),
        },
      },
    };

    return NextResponse.json(response, {
      status: allHealthy ? 200 : 503,
    });
  } catch (error) {
    console.error("[GET /api/health]", error);

    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        error:
          error instanceof Error ? error.message : "Health check failed",
        services: {
          ollama: { status: "unknown" },
          aiService: { status: "unknown" },
        },
      },
      { status: 500 }
    );
  }
}
