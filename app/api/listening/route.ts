import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Make sure you have a prisma client instance exported from a lib file
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const title = data.get("title") as string;
    const slug = data.get("slug") as string;
    const content = data.get("content") as string;
    const answers = data.get("answers") as string; // Will be a JSON string
    const audioFile = data.get("audio") as File;

    if (!title || !slug || !content || !answers || !audioFile) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 1. Handle File Upload
    const bytes = await audioFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a unique filename to avoid overwriting
    const filename = `${Date.now()}-${audioFile.name}`;
    const audioPath = path.join(process.cwd(), "public/audio", filename);
    await writeFile(audioPath, buffer);
    console.log(`Uploaded file to ${audioPath}`);

    const audioUrl = `/audio/${filename}`; // URL to be used on the client

    // 2. Parse answers and create test in DB
    const parsedAnswers = JSON.parse(answers);

    const test = await prisma.listeningTest.create({
      data: {
        title,
        slug,
        content,
        audioUrl,
        answers: parsedAnswers,
      },
    });

    return NextResponse.json(test, { status: 201 });
  } catch (error) {
    console.error("POST /api/listening error:", error);
    return NextResponse.json(
      { error: "Failed to create test" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const tests = await prisma.listeningTest.findMany({
      select: { title: true, slug: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(tests);
  } catch (error) {
    console.error("GET /api/listening error:", error);
    return NextResponse.json(
      { error: "Failed to fetch tests" },
      { status: 500 }
    );
  }
}
