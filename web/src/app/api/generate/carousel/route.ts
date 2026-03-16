import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateJSON } from "@/lib/ollama";

const carouselSchema = z.object({
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
  slideCount: z
    .number()
    .int()
    .min(2, "Must have at least 2 slides")
    .max(10, "Cannot have more than 10 slides"),
  includeEmojis: z.boolean().default(true),
});

const carouselResponseSchema = z.object({
  slides: z.array(
    z.object({
      slideNumber: z.number(),
      text: z.string(),
      charCount: z.number().optional(),
    })
  ),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = carouselSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { topic, platform, tone, language, slideCount, includeEmojis } =
      parsed.data;

    const model = process.env.DEFAULT_MODEL || "llama3";

    const emojiDirective = includeEmojis
      ? "Include relevant emojis to boost engagement and visual appeal."
      : "Do NOT include any emojis. Keep the text clean and emoji-free.";

    const systemPrompt = `You are an elite social media content strategist specializing in carousel posts. You create compelling, scroll-stopping carousel content that keeps viewers swiping.

## Your Task
Generate a series of ${slideCount} connected carousel captions. Each slide should flow logically from the previous one. Slide 1 is the hook, middle slides provide value, last slide is the CTA.

## Platform: ${platform}
## Tone: ${tone}
## Language: ${language}

## Content Requirements
- ${emojiDirective}
- Each slide caption should be concise and impactful — optimized for a single carousel card.
- Maintain a consistent voice and theme across all slides.
- The series should tell a cohesive story or build a compelling argument.

## Output Format
Return ONLY valid JSON:
{
  "slides": [
    { "slideNumber": 1, "text": "Hook slide text here", "charCount": 42 },
    { "slideNumber": 2, "text": "Value slide text here", "charCount": 55 }
  ]
}`;

    const userPrompt = `Generate exactly ${slideCount} carousel slide captions about the following topic:

**Topic:** ${topic}

Requirements:
- Slide 1: A powerful hook that stops the scroll and makes people want to swipe.
- Slides 2 to ${slideCount - 1}: Deliver value, insights, tips, or story progression.
- Slide ${slideCount}: A strong call-to-action that drives engagement (save, share, follow, comment).
- Each slide should be self-contained enough to make sense on its own, but flow naturally as a series.
- Return ONLY valid JSON, no markdown.`;

    const rawResponse = await generateJSON<unknown>(
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      model
    );

    const llmParsed = carouselResponseSchema.safeParse(rawResponse);
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

    const slides = llmParsed.data.slides.map((slide) => ({
      slideNumber: slide.slideNumber,
      text: slide.text,
      charCount: slide.charCount ?? slide.text.length,
    }));

    return NextResponse.json({ slides });
  } catch (error) {
    console.error("[POST /api/generate/carousel]", error);

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
