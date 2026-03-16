import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateJSON } from "@/lib/ollama";
import {
  buildCaptionSystemPrompt,
  buildCaptionUserPrompt,
} from "@/lib/prompts";
import { getPlatformConfig } from "@/lib/platform-config";
import {
  generateCaptionSchema,
  generatedCaptionResponseSchema,
} from "@/lib/validators";
import type { GenerationResult } from "@/types/caption";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = generateCaptionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const {
      topic,
      platform,
      tone,
      language,
      count,
      includeEmojis,
      includeCta,
      includeHashtags,
      imageDescription,
      persona,
    } = parsed.data;

    const model = process.env.DEFAULT_MODEL || "llama3";
    const platformConfig = getPlatformConfig(platform);

    // Build prompts
    const systemPrompt = buildCaptionSystemPrompt(platform, tone, language, {
      includeEmojis,
      includeCta,
      includeHashtags,
    });

    const userPrompt = buildCaptionUserPrompt(
      topic,
      count,
      imageDescription,
      persona
    );

    // Call Ollama for JSON generation
    const rawResponse = await generateJSON<unknown>(
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      model
    );

    // Validate the LLM response structure
    const llmParsed = generatedCaptionResponseSchema.safeParse(rawResponse);
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

    const { captions: rawCaptions } = llmParsed.data;

    // Enrich captions with computed fields
    const enrichedCaptions = rawCaptions.map((caption) => ({
      text: caption.text,
      platform,
      charCount: caption.charCount ?? caption.text.length,
      hasEmojis: includeEmojis,
      hasCta: includeCta,
      hook: caption.hook ?? "",
      body: caption.body ?? "",
      cta: caption.cta ?? "",
    }));

    // Persist generation and captions to DB
    const generation = await prisma.generation.create({
      data: {
        platform,
        tone,
        language,
        inputTopic: topic,
        imageAnalysis: imageDescription ?? null,
        model,
        captions: {
          create: enrichedCaptions.map((c) => ({
            text: c.text,
            platform: c.platform,
            charCount: c.charCount,
            hasEmojis: c.hasEmojis,
            hasCta: c.hasCta,
          })),
        },
      },
      include: {
        captions: true,
        hashtags: true,
      },
    });

    const result: GenerationResult = {
      id: generation.id,
      platform: generation.platform as GenerationResult["platform"],
      tone: generation.tone as GenerationResult["tone"],
      language: generation.language as GenerationResult["language"],
      model: generation.model,
      createdAt: generation.createdAt.toISOString(),
      captions: generation.captions.map((c, i) => ({
        id: c.id,
        text: c.text,
        platform: c.platform as GenerationResult["platform"],
        charCount: c.charCount,
        hasEmojis: c.hasEmojis,
        hasCta: c.hasCta,
        isFavorite: c.isFavorite,
        hook: enrichedCaptions[i]?.hook ?? "",
        body: enrichedCaptions[i]?.body ?? "",
        cta: enrichedCaptions[i]?.cta ?? "",
      })),
      hashtags: [],
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("[POST /api/generate/caption]", error);

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
