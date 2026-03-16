import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateJSON } from "@/lib/ollama";
import { buildBrandVoiceAnalysisPrompt } from "@/lib/prompts";
import { brandVoiceAnalysisResponseSchema } from "@/lib/validators";

const brandVoiceSchema = z.object({
  samples: z
    .array(z.string().min(10, "Each sample must be at least 10 characters"))
    .min(3, "Must provide at least 3 writing samples")
    .max(10, "Cannot provide more than 10 writing samples"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = brandVoiceSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { samples } = parsed.data;

    const model = process.env.DEFAULT_MODEL || "llama3";

    const prompt = buildBrandVoiceAnalysisPrompt(samples);

    const rawResponse = await generateJSON<unknown>(
      [
        {
          role: "system",
          content:
            "You are a brand voice analyst and linguistics expert. Analyze writing samples and return structured JSON analysis. Return ONLY valid JSON, no markdown or extra text.",
        },
        { role: "user", content: prompt },
      ],
      model
    );

    const llmParsed = brandVoiceAnalysisResponseSchema.safeParse(rawResponse);
    if (!llmParsed.success) {
      return NextResponse.json(
        {
          error: "Failed to parse AI response",
          details: llmParsed.error.flatten(),
          raw: rawResponse,
        },
        { status: 502 }
      );
    }

    return NextResponse.json(llmParsed.data);
  } catch (error) {
    console.error("[POST /api/generate/brand-voice]", error);

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
