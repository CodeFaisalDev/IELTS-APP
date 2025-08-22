// app/api/speaking/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, slug, content } = body;

    // Validate required fields
    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: "Title, slug, and content are required." },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingTest = await prisma.speakingTest.findUnique({
      where: { slug },
    });

    if (existingTest) {
      return NextResponse.json(
        { error: "A test with this slug already exists." },
        { status: 400 }
      );
    }

    // Create the speaking test
    const speakingTest = await prisma.speakingTest.create({
      data: {
        title,
        slug,
        content,
      },
    });

    return NextResponse.json(speakingTest, { status: 201 });
  } catch (error) {
    console.error("Error creating speaking test:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET() {
  try {
    const speakingTests = await prisma.speakingTest.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(speakingTests);
  } catch (error) {
    console.error("Error fetching speaking tests:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}