import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    if (!slug) {
      return NextResponse.json(
        { error: "Slug parameter is required" },
        { status: 400 }
      );
    }

    const readingTest = await prisma.readingTest.findUnique({
      where: { slug },
    });

    if (!readingTest) {
      return NextResponse.json(
        { error: "Reading test not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(readingTest);
  } catch (error) {
    console.error("Error fetching reading test:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
