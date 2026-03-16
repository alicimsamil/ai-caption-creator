import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

const toggleFavoriteSchema = z.object({
  captionId: z.string().min(1, "captionId is required"),
});

export async function GET() {
  try {
    const favorites = await prisma.caption.findMany({
      where: { isFavorite: true },
      include: {
        generation: {
          select: {
            id: true,
            platform: true,
            tone: true,
            language: true,
            inputTopic: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ favorites });
  } catch (error) {
    console.error("[GET /api/favorites]", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = toggleFavoriteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { captionId } = parsed.data;

    // Find existing caption
    const caption = await prisma.caption.findUnique({
      where: { id: captionId },
    });

    if (!caption) {
      return NextResponse.json(
        { error: "Caption not found" },
        { status: 404 }
      );
    }

    // Toggle favorite status
    const updated = await prisma.caption.update({
      where: { id: captionId },
      data: { isFavorite: !caption.isFavorite },
    });

    return NextResponse.json({
      caption: updated,
      isFavorite: updated.isFavorite,
    });
  } catch (error) {
    console.error("[POST /api/favorites]", error);

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
