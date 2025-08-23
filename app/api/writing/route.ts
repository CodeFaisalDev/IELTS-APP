import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import crypto from "crypto";

const prisma = new PrismaClient();

// Helper function to extract and save images from rich text
async function processRichTextImages(content: string): Promise<string> {
  if (!content) return content;

  // Find all base64 images in the content
  const base64ImageRegex =
    /<img[^>]+src="data:image\/([^;]+);base64,([^"]+)"[^>]*>/g;
  let processedContent = content;
  let match;

  while ((match = base64ImageRegex.exec(content)) !== null) {
    const [fullMatch, imageType, base64Data] = match;

    try {
      // Generate unique filename
      const fileName = `${crypto.randomUUID()}.${imageType}`;
      const imagePath = join(process.cwd(), "public", "images", fileName);

      // Ensure images directory exists
      await mkdir(join(process.cwd(), "public", "images"), { recursive: true });

      // Convert base64 to buffer and save
      const imageBuffer = Buffer.from(base64Data, "base64");
      await writeFile(imagePath, imageBuffer);

      // Replace base64 src with file path
      const newImageTag = fullMatch.replace(
        `data:image/${imageType};base64,${base64Data}`,
        `/images/${fileName}`
      );

      processedContent = processedContent.replace(fullMatch, newImageTag);
    } catch (error: unknown) {
      console.error("Error processing image:", error);
      // Continue with other images even if one fails
    }
  }

  return processedContent;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, slug, section1, section2, answers } = body;

    // Validate required fields
    if (!title || !slug) {
      return NextResponse.json(
        { error: "Title and slug are required" },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingTest = await prisma.writingTest.findUnique({
      where: { slug },
    });

    if (existingTest) {
      return NextResponse.json(
        { error: "A test with this slug already exists" },
        { status: 400 }
      );
    }

    // `answers` field is already a JSON object from `request.json()`, so no need to parse it again.

    // Process images in rich text content
    const processedSection1 = section1
      ? await processRichTextImages(section1)
      : null;
    const processedSection2 = section2
      ? await processRichTextImages(section2)
      : null;

    // Create the writing test
    const writingTest = await prisma.writingTest.create({
      data: {
        title,
        slug,
        section1: processedSection1,
        section2: processedSection2,
        answers: answers, // Pass the answers object directly
      },
    });

    return NextResponse.json(writingTest, { status: 201 });
  } catch (error: unknown) {
    console.error("Error creating writing test:", error);
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
    const tests = await prisma.writingTest.findMany({
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
    console.error("Error fetching writing tests:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
