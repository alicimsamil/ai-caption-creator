import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateJSON } from "@/lib/ollama";
import {
  buildCaptionSystemPrompt,
  buildCaptionUserPrompt,
} from "@/lib/prompts";
import { generatedCaptionResponseSchema } from "@/lib/validators";
import type { GeneratedCaption } from "@/types/caption";

const abVariantsSchema = z.object({
  topic: z
    .string()
    .min(2, "Topic must be at least 2 characters")
    .max(500, "Topic must be under 500 characters"),
  platform: z.enum([
    "instagram",
    "tiktok",
    "twitter",
    "linkedin",
    "facebook",
    "youtube",
    "pinterest",
  ]),
  tone: z.enum([
    "professional",
    "casual",
    "funny",
    "inspirational",
    "educational",
    "motivational",
    "storytelling",
    "provocative",
  ]),
  language: z.enum(["tr", "en", "de", "fr", "es", "ar", "ja", "ko", "zh", "pt"]),
  includeEmojis: z.boolean().default(true),
  includeCta: z.boolean().default(true),
  persona: z.string().max(500).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = abVariantsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { topic, platform, tone, language, includeEmojis, includeCta, persona } =
      parsed.data;

    const model = process.env.DEFAULT_MODEL || "llama3";

    const systemPrompt = buildCaptionSystemPrompt(platform, tone, language, {
      includeEmojis,
      includeCta,
      includeHashtags: false,
    });

    // Variant A: direct approach
    const userPromptA = buildCaptionUserPrompt(
      `Write a direct, straightforward caption about: ${topic}`,
      1,
      undefined,
      persona
    );

    // Variant B: creative approach
    const userPromptB = buildCaptionUserPrompt(
      `Write a creative, unexpected angle caption about: ${topic}`,
      1,
      undefined,
      persona
    );

    // Generate both variants in parallel
    const [rawA, rawB] = await Promise.all([
      generateJSON<unknown>(
        [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPromptA },
        ],
        model
      ),
      generateJSON<unknown>(
        [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPromptB },
        ],
        model
      ),
    ]);

    // Validate LLM responses
    const parsedA = generatedCaptionResponseSchema.safeParse(rawA);
    if (!parsedA.success) {
      return NextResponse.json(
        {
          error: "Failed to parse AI response for variant A",
          details: parsedA.error.flatten(),
          raw: rawA,
        },
        { status: 502 }
      );
    }

    const parsedB = generatedCaptionResponseSchema.safeParse(rawB);
    if (!parsedB.success) {
      return NextResponse.json(
        {
          error: "Failed to parse AI response for variant B",
          details: parsedB.error.flatten(),
          raw: rawB,
        },
        { status: 502 }
      );
    }

    const captionA = parsedA.data.captions[0];
    const captionB = parsedB.data.captions[0];

    if (!captionA || !captionB) {
      return NextResponse.json(
        { error: "AI did not return captions for both variants" },
        { status: 502 }
      );
    }

    const variantA: GeneratedCaption = {
      text: captionA.text,
      platform,
      charCount: captionA.charCount ?? captionA.text.length,
      hasEmojis: includeEmojis,
      hasCta: includeCta,
      hook: captionA.hook ?? "",
      body: captionA.body ?? "",
      cta: captionA.cta ?? "",
    };

    const variantB: GeneratedCaption = {
      text: captionB.text,
      platform,
      charCount: captionB.charCount ?? captionB.text.length,
      hasEmojis: includeEmojis,
      hasCta: includeCta,
      hook: captionB.hook ?? "",
      body: captionB.body ?? "",
      cta: captionB.cta ?? "",
    };

    return NextResponse.json({ variantA, variantB });
  } catch (error) {
    console.error("[POST /api/generate/ab-variants]", error);

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
