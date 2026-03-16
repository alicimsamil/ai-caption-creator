const AI_SERVICE_URL =
  process.env.AI_SERVICE_URL || "http://localhost:8000";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ImageAnalysisResult {
  description: string;
  confidence: number;
  tags: string[];
}

export interface AIServiceHealthStatus {
  healthy: boolean;
  version?: string;
  modelLoaded?: boolean;
  error?: string;
}

// ---------------------------------------------------------------------------
// analyzeImage
// ---------------------------------------------------------------------------

/**
 * Send an image buffer to the FastAPI BLIP service for visual analysis.
 * Returns a natural-language description of the image content.
 */
export async function analyzeImage(
  imageBuffer: Buffer,
  mimeType: string = "image/jpeg"
): Promise<ImageAnalysisResult> {
  const formData = new FormData();
  const uint8 = new Uint8Array(imageBuffer);
  const blob = new Blob([uint8], { type: mimeType });
  formData.append("file", blob, "image.jpg");

  const response = await fetch(`${AI_SERVICE_URL}/analyze`, {
    method: "POST",
    body: formData,
    signal: AbortSignal.timeout(30_000),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "Unknown error");
    throw new Error(
      `AI service image analysis failed (${response.status}): ${errorBody}`
    );
  }

  const data = (await response.json()) as ImageAnalysisResult;

  if (!data.description) {
    throw new Error("AI service returned an empty image description");
  }

  return data;
}

// ---------------------------------------------------------------------------
// checkAIServiceHealth
// ---------------------------------------------------------------------------

/**
 * Check whether the FastAPI AI service is reachable and its model is loaded.
 */
export async function checkAIServiceHealth(): Promise<AIServiceHealthStatus> {
  try {
    const response = await fetch(`${AI_SERVICE_URL}/health`, {
      method: "GET",
      signal: AbortSignal.timeout(5_000),
    });

    if (!response.ok) {
      return {
        healthy: false,
        error: `AI service returned status ${response.status}`,
      };
    }

    const data = (await response.json()) as {
      status: string;
      version?: string;
      model_loaded?: boolean;
    };

    return {
      healthy: data.status === "ok" || data.status === "healthy",
      version: data.version,
      modelLoaded: data.model_loaded,
    };
  } catch (error) {
    return {
      healthy: false,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error connecting to AI service",
    };
  }
}
