import { NextRequest, NextResponse } from "next/server";
import { generateJSON } from "@/lib/ollama";
import { buildRefinePrompt } from "@/lib/prompts";
import { refineSchema, refinedCaptionResponseSchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = refineSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { captionText, instruction, platform, tone, language } = parsed.data;
    const model = process.env.DEFAULT_MODEL || "llama3";

    // buildRefinePrompt returns a single combined prompt
    const refinePrompt = buildRefinePrompt(
      captionText,
      instruction,
      platform,
      language
    );

    // Call Ollama with the refine prompt as user message
    const rawResponse = await generateJSON<unknown>(
      [
        {
          role: "system",
          content:
            "You are an expert social media copywriter. Refine captions precisely as instructed. Always respond with valid JSON only.",
        },
        { role: "user", content: refinePrompt },
      ],
      model
    );

    // Validate LLM response
    const llmParsed = refinedCaptionResponseSchema.safeParse(rawResponse);
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

    const { caption } = llmParsed.data;

    return NextResponse.json({
      caption: {
        text: caption.text,
        hook: caption.hook ?? "",
        body: caption.body ?? "",
        cta: caption.cta ?? "",
        charCount: caption.charCount ?? caption.text.length,
        platform,
        tone,
        language,
      },
    });
  } catch (error) {
    console.error("[POST /api/generate/refine]", error);

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
