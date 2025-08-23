import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, slug, section1, section2, section3, answers } = body;

    // Validate required fields
    if (!title || !slug) {
      return NextResponse.json(
        { error: "Title and slug are required" },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingTest = await prisma.readingTest.findUnique({
      where: { slug },
    });

    if (existingTest) {
      return NextResponse.json(
        { error: "A test with this slug already exists" },
        { status: 400 }
      );
    }

    // The 'answers' field is already a JSON object from request.json(),
    // so no need to parse it again.

    // Create the reading test
    const readingTest = await prisma.readingTest.create({
      data: {
        title,
        slug,
        section1,
        section2,
        section3,
        answers, // Pass the answers object directly
      },
    });

    return NextResponse.json(readingTest, { status: 201 });
  } catch (error: unknown) {
    console.error("Error creating reading test:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Separate GET handler to follow Next.js conventions
export async function GET() {
  try {
    const tests = await prisma.readingTest.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(tests);
  } catch (error: unknown) {
    console.error("Error fetching reading tests:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
