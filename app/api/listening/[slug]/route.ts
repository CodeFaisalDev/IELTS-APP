// // app/api/listening/[slug]/route.ts
// import { NextResponse } from "next/server";
// import { PrismaClient } from "@prisma/client";
// import type { JsonArray } from "@prisma/client/runtime/library";

// interface ListeningSection {
//   title: string;
//   imagePath: string;
//   start: number;
//   end: number;
// }

// const prisma = new PrismaClient();

// export async function GET(
//   request: Request,
//   { params }: { params: { slug: string } }
// ) {
//   try {
//     const { slug } = params;
//     if (!slug) {
//       return NextResponse.json(
//         { error: "Slug parameter is missing" },
//         { status: 400 }
//       );
//     }

//     const test = await prisma.listeningTest.findUnique({
//       where: { slug },
//     });
//     if (!test) {
//       return NextResponse.json({ error: "Test not found" }, { status: 404 });
//     }

//     // 💡 The corrected type assertion for sections and answers
//     const sections = (test.sections || []) as unknown as ListeningSection[];
//     const answers = (test.answers || []) as unknown as string[][];

//     const formattedTest = {
//       title: test.title,
//       slug: test.slug,
//       audio: test.audioPath,
//       sections: sections.map((section) => ({
//         ...section,
//         image: section.imagePath,
//       })),
//       answers: answers,
//     };

//     return NextResponse.json(formattedTest, { status: 200 });
//   } catch (error) {
//     console.error("Error fetching listening test by slug:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch test data" },
//       { status: 500 }
//     );
//   }
// }

// app/api/listening/[slug]/route.ts
// app/api/listening/[slug]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;
    const test = await prisma.listeningTest.findUnique({
      where: { slug },
    });

    if (!test) {
      return NextResponse.json({ error: "Test not found" }, { status: 404 });
    }

    return NextResponse.json(test);
  } catch (error) {
    console.error("GET /api/listening/[slug] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch test" },
      { status: 500 }
    );
  }
}
