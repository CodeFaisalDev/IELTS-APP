import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { slug, userAnswers }: { slug: string; userAnswers: string[] } =
      await req.json();

    const test = await prisma.listeningTest.findUnique({
      where: { slug },
    });

    if (!test) {
      return NextResponse.json({ error: "Test not found" }, { status: 404 });
    }

    const sections: { title: string; imagePath: string; answers: string[] }[] =
      test.sections as any;

    const correctAnswers: string[] = sections.flatMap((sec) =>
      sec.answers.map((ans) => ans.trim().toLowerCase())
    );

    let score = 0;
    const mistakes: { question: number; correct: string; user: string }[] = [];

    userAnswers.forEach((ans: string, i: number) => {
      const possibleAnswers = correctAnswers[i]
        .split("/")
        .map((a) => a.trim().toLowerCase());
      if (possibleAnswers.includes(ans.trim().toLowerCase())) {
        score++;
      } else {
        mistakes.push({
          question: i + 1,
          correct: correctAnswers[i],
          user: ans,
        });
      }
    });

    return NextResponse.json({ score, total: correctAnswers.length, mistakes });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to check result" },
      { status: 500 }
    );
  }
}
