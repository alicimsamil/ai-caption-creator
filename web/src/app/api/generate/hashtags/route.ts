import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateJSON } from "@/lib/ollama";
import {
  buildHashtagSystemPrompt,
  buildHashtagUserPrompt,
} from "@/lib/prompts";
import {
  generateHashtagSchema,
  generatedHashtagResponseSchema,
} from "@/lib/validators";
import type { GeneratedHashtag } from "@/types/caption";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = generateHashtagSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { topic, platform, language, count } = parsed.data;
    const generationId = body.generationId as string | undefined;
    const model = process.env.DEFAULT_MODEL || "llama3";

    // Build prompts
    const systemPrompt = buildHashtagSystemPrompt(platform, language);
    const userPrompt = buildHashtagUserPrompt(topic, count);

    // Call Ollama
    const rawResponse = await generateJSON<unknown>(
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      model
    );

    // Validate the LLM response
    const llmParsed = generatedHashtagResponseSchema.safeParse(rawResponse);
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

    const { hashtags: rawHashtags } = llmParsed.data;

    // If a generationId is provided, persist hashtags linked to the generation
    let savedHashtags: GeneratedHashtag[] = rawHashtags;

    if (generationId) {
      // Verify generation exists
      const generation = await prisma.generation.findUnique({
        where: { id: generationId },
      });

      if (!generation) {
        return NextResponse.json(
          { error: "Generation not found", generationId },
          { status: 404 }
        );
      }

      const created = await prisma.$transaction(
        rawHashtags.map((h) =>
          prisma.hashtag.create({
            data: {
              tag: h.tag,
              category: h.category,
              relevancy: h.relevancy,
              generationId,
            },
          })
        )
      );

      savedHashtags = created.map((h) => ({
        id: h.id,
        tag: h.tag,
        category: h.category as GeneratedHashtag["category"],
        relevancy: h.relevancy,
      }));
    }

    return NextResponse.json({ hashtags: savedHashtags });
  } catch (error) {
    console.error("[POST /api/generate/hashtags]", error);

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
