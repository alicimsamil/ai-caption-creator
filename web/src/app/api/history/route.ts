import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? String(DEFAULT_PAGE), 10));
    const limit = Math.min(
      MAX_LIMIT,
      Math.max(1, parseInt(searchParams.get("limit") ?? String(DEFAULT_LIMIT), 10))
    );
    const platform = searchParams.get("platform");

    const where: Record<string, unknown> = {};
    if (platform) {
      where.platform = platform;
    }

    const [generations, total] = await Promise.all([
      prisma.generation.findMany({
        where,
        include: {
          captions: {
            orderBy: { createdAt: "asc" },
          },
          hashtags: {
            orderBy: { relevancy: "desc" },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.generation.count({ where }),
    ]);

    return NextResponse.json({
      generations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[GET /api/history]", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing required query parameter: id" },
        { status: 400 }
      );
    }

    // Verify the generation exists
    const generation = await prisma.generation.findUnique({
      where: { id },
    });

    if (!generation) {
      return NextResponse.json(
        { error: "Generation not found" },
        { status: 404 }
      );
    }

    // Cascade delete will remove associated captions and hashtags
    await prisma.generation.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, deletedId: id });
  } catch (error) {
    console.error("[DELETE /api/history]", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
