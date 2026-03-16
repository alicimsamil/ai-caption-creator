import { NextResponse } from "next/server";
import { generateJSON } from "@/lib/ollama";

// ---------------------------------------------------------------------------
// Simple in-memory cache with 1-hour TTL
// ---------------------------------------------------------------------------

interface CacheEntry {
  data: TrendingHashtag[];
  expiresAt: number;
}

interface TrendingHashtag {
  tag: string;
  category: string;
  description: string;
}

const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour
let cache: CacheEntry | null = null;

function getCachedTrending(): TrendingHashtag[] | null {
  if (cache && Date.now() < cache.expiresAt) {
    return cache.data;
  }
  cache = null;
  return null;
}

function setCachedTrending(data: TrendingHashtag[]): void {
  cache = {
    data,
    expiresAt: Date.now() + CACHE_TTL_MS,
  };
}

// ---------------------------------------------------------------------------
// GET /api/trending
// ---------------------------------------------------------------------------

export async function GET() {
  try {
    // Return cached data if still valid
    const cached = getCachedTrending();
    if (cached) {
      return NextResponse.json({ hashtags: cached, cached: true });
    }

    const model = process.env.DEFAULT_MODEL || "llama3";

    const systemPrompt = `You are a social media trend analyst with deep knowledge of current trending topics across all major platforms (Instagram, TikTok, Twitter/X, LinkedIn, YouTube).

Your task is to generate a list of currently trending hashtags and topics that content creators can use to boost their reach and engagement.

## Rules
- Generate 20 trending hashtags across different categories.
- Categories: "general", "business", "lifestyle", "tech", "entertainment", "health", "food", "travel", "fashion", "education".
- Each hashtag must start with #.
- Include a brief description of why each hashtag is trending.
- Focus on evergreen trending topics and seasonal relevance.

## Output Format
Return ONLY valid JSON:
{
  "hashtags": [
    { "tag": "#ExampleTrend", "category": "general", "description": "Brief description of why this is trending" }
  ]
}`;

    const userPrompt =
      "Generate 20 currently trending hashtags across different social media platforms and categories. Focus on topics that are relevant right now and have high engagement potential.";

    const rawResponse = await generateJSON<{
      hashtags?: TrendingHashtag[];
    }>(
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      model
    );

    const hashtags = rawResponse?.hashtags;

    if (!Array.isArray(hashtags) || hashtags.length === 0) {
      return NextResponse.json(
        { error: "Failed to generate trending hashtags", raw: rawResponse },
        { status: 502 }
      );
    }

    // Normalize and validate each entry
    const validated: TrendingHashtag[] = hashtags
      .filter(
        (h): h is TrendingHashtag =>
          typeof h.tag === "string" &&
          typeof h.category === "string" &&
          typeof h.description === "string"
      )
      .map((h) => ({
        tag: h.tag.startsWith("#") ? h.tag : `#${h.tag}`,
        category: h.category,
        description: h.description,
      }));

    // Cache the result
    setCachedTrending(validated);

    return NextResponse.json({ hashtags: validated, cached: false });
  } catch (error) {
    console.error("[GET /api/trending]", error);

    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
