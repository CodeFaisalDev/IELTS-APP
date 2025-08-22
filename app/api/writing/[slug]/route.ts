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

    const writingTest = await prisma.writingTest.findUnique({
      where: { slug },
    });

    if (!writingTest) {
      return NextResponse.json(
        { error: "Writing test not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(writingTest);
  } catch (error) {
    console.error("Error fetching writing test:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
