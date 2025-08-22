// app/api/speaking/[slug]/route.ts

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  try {
    const speakingTest = await prisma.speakingTest.findUnique({
      where: {
        slug: slug,
      },
    });

    if (!speakingTest) {
      return NextResponse.json(
        { message: "Speaking test not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(speakingTest, { status: 200 });
  } catch (error) {
    console.error("Error fetching speaking test:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
