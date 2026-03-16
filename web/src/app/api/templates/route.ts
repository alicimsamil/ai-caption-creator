import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { templateSchema } from "@/lib/validators";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const platform = searchParams.get("platform");
    const category = searchParams.get("category");

    const where: Record<string, unknown> = {};

    if (platform) {
      // Templates can be for a specific platform or "all"
      where.platform = { in: [platform, "all"] };
    }

    if (category) {
      where.category = category;
    }

    const templates = await prisma.template.findMany({
      where,
      orderBy: [{ isBuiltIn: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({ templates });
  } catch (error) {
    console.error("[GET /api/templates]", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = templateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const template = await prisma.template.create({
      data: {
        name: parsed.data.name,
        nameTr: parsed.data.nameTr ?? null,
        description: parsed.data.description,
        descriptionTr: parsed.data.descriptionTr ?? null,
        platform: parsed.data.platform,
        tone: parsed.data.tone,
        category: parsed.data.category,
        promptTemplate: parsed.data.promptTemplate,
        exampleOutput: parsed.data.exampleOutput ?? null,
        isBuiltIn: false,
      },
    });

    return NextResponse.json({ template }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/templates]", error);

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
