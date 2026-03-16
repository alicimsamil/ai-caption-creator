import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const captionSchema = z.object({
  text: z.string(),
  platform: z.string(),
  charCount: z.number(),
  hasEmojis: z.boolean(),
  hasCta: z.boolean(),
  hook: z.string().optional(),
  body: z.string().optional(),
  cta: z.string().optional(),
});

const hashtagSchema = z.object({
  tag: z.string(),
  category: z.enum(["niche", "broad", "trending", "branded"]),
  relevancy: z.number().min(0).max(1),
});

const exportSchema = z.object({
  format: z.enum(["csv", "markdown", "text"]),
  captions: z.array(captionSchema).min(1, "Must include at least 1 caption"),
  hashtags: z.array(hashtagSchema).optional(),
});

function escapeCsv(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function generateCsv(
  captions: z.infer<typeof captionSchema>[],
  hashtags?: z.infer<typeof hashtagSchema>[]
): string {
  const lines: string[] = [];

  // Caption headers and rows
  lines.push("Type,Platform,Text,Character Count,Has Emojis,Has CTA,Hook,CTA Text");
  for (const caption of captions) {
    lines.push(
      [
        "caption",
        escapeCsv(caption.platform),
        escapeCsv(caption.text),
        String(caption.charCount),
        String(caption.hasEmojis),
        String(caption.hasCta),
        escapeCsv(caption.hook ?? ""),
        escapeCsv(caption.cta ?? ""),
      ].join(",")
    );
  }

  // Hashtag rows if present
  if (hashtags && hashtags.length > 0) {
    lines.push("");
    lines.push("Type,Tag,Category,Relevancy");
    for (const hashtag of hashtags) {
      lines.push(
        [
          "hashtag",
          escapeCsv(hashtag.tag),
          escapeCsv(hashtag.category),
          String(hashtag.relevancy),
        ].join(",")
      );
    }
  }

  return lines.join("\n");
}

function generateMarkdown(
  captions: z.infer<typeof captionSchema>[],
  hashtags?: z.infer<typeof hashtagSchema>[]
): string {
  const lines: string[] = [];

  lines.push("# Generated Captions");
  lines.push("");

  for (let i = 0; i < captions.length; i++) {
    const caption = captions[i];
    lines.push(`## Caption ${i + 1}`);
    lines.push("");
    lines.push(`**Platform:** ${caption.platform}`);
    lines.push(`**Characters:** ${caption.charCount}`);
    lines.push("");
    lines.push(caption.text);
    lines.push("");

    if (caption.hook) {
      lines.push(`> **Hook:** ${caption.hook}`);
      lines.push("");
    }
    if (caption.cta) {
      lines.push(`> **CTA:** ${caption.cta}`);
      lines.push("");
    }

    lines.push("---");
    lines.push("");
  }

  if (hashtags && hashtags.length > 0) {
    lines.push("## Hashtags");
    lines.push("");
    lines.push("| Tag | Category | Relevancy |");
    lines.push("|-----|----------|-----------|");
    for (const hashtag of hashtags) {
      lines.push(
        `| ${hashtag.tag} | ${hashtag.category} | ${hashtag.relevancy.toFixed(2)} |`
      );
    }
    lines.push("");
  }

  return lines.join("\n");
}

function generateText(
  captions: z.infer<typeof captionSchema>[],
  hashtags?: z.infer<typeof hashtagSchema>[]
): string {
  const lines: string[] = [];

  for (let i = 0; i < captions.length; i++) {
    const caption = captions[i];
    lines.push(`--- Caption ${i + 1} (${caption.platform}) ---`);
    lines.push(caption.text);
    lines.push("");
  }

  if (hashtags && hashtags.length > 0) {
    lines.push("--- Hashtags ---");
    lines.push(hashtags.map((h) => h.tag).join(" "));
    lines.push("");
  }

  return lines.join("\n");
}

const CONTENT_TYPES: Record<string, string> = {
  csv: "text/csv",
  markdown: "text/markdown",
  text: "text/plain",
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = exportSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { format, captions, hashtags } = parsed.data;

    let content: string;
    switch (format) {
      case "csv":
        content = generateCsv(captions, hashtags);
        break;
      case "markdown":
        content = generateMarkdown(captions, hashtags);
        break;
      case "text":
        content = generateText(captions, hashtags);
        break;
    }

    return new NextResponse(content, {
      status: 200,
      headers: {
        "Content-Type": CONTENT_TYPES[format],
      },
    });
  } catch (error) {
    console.error("[POST /api/export]", error);

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
