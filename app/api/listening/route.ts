// // import { NextResponse } from "next/server";
// // import { PrismaClient } from "@prisma/client";
// // import path from "path";
// // import fs from "fs";
// // import slugify from "slugify";

// // // app/api/listening/route.ts
// // export const runtime = "nodejs";
// // export const dynamic = "force-dynamic";

// // const prisma = new PrismaClient();

// // export async function POST(req: Request) {
// //   try {
// //     const formData = await req.formData();

// //     const title = formData.get("title") as string;
// //     if (!title) {
// //       return NextResponse.json({ error: "Title is required" }, { status: 400 });
// //     }

// //     // Create slug from title
// //     const slug = slugify(title, { lower: true, strict: true });

// //     // Create folder in /public/tests/{slug}
// //     const testFolder = path.join(process.cwd(), "public", "tests", slug);
// //     fs.mkdirSync(testFolder, { recursive: true });

// //     // --- Save audio file ---
// //     const audioFile = formData.get("audio") as File;
// //     if (!audioFile) {
// //       return NextResponse.json(
// //         { error: "Audio file is required" },
// //         { status: 400 }
// //       );
// //     }
// //     const audioExt = path.extname(audioFile.name) || ".mp3";
// //     const audioPath = `/tests/${slug}/audio${audioExt}`;
// //     fs.writeFileSync(
// //       path.join(testFolder, `audio${audioExt}`),
// //       Buffer.from(await audioFile.arrayBuffer())
// //     );

// //     // --- Save section images ---
// //     const sections: any[] = [];
// //     for (let i = 1; i <= 4; i++) {
// //       const imgFile = formData.get(`sectionImage${i}`) as File;
// //       const start = Number(formData.get(`sectionStart${i}`));
// //       const end = Number(formData.get(`sectionEnd${i}`));
// //       const sectionTitle = `Section ${i}`;

// //       if (!imgFile) {
// //         return NextResponse.json(
// //           { error: `Section ${i} image is required` },
// //           { status: 400 }
// //         );
// //       }

// //       const imgExt = path.extname(imgFile.name) || ".png";
// //       const imgPath = `/tests/${slug}/section${i}${imgExt}`;

// //       fs.writeFileSync(
// //         path.join(testFolder, `section${i}${imgExt}`),
// //         Buffer.from(await imgFile.arrayBuffer())
// //       );

// //       sections.push({
// //         title: sectionTitle,
// //         imagePath: imgPath,
// //         start,
// //         end,
// //       });
// //     }

// //     // --- Parse answers ---
// //     const answers: string[][] = [];
// //     for (let i = 1; i <= 40; i++) {
// //       const ans = (formData.get(`answer${i}`) as string) || "";
// //       // Split by "/" and trim each possible answer
// //       const ansArray = ans
// //         .split("/")
// //         .map((a) => a.trim())
// //         .filter((a) => a.length > 0);
// //       answers.push(ansArray);
// //     }

// //     // --- Save to DB ---
// //     const test = await prisma.listeningTest.create({
// //       data: {
// //         title,
// //         slug,
// //         audioPath,
// //         sections,
// //         answers,
// //       },
// //     });

// //     return NextResponse.json({ success: true, test }, { status: 201 });
// //   } catch (error) {
// //     console.error("Error uploading listening test:", error);
// //     return NextResponse.json(
// //       { error: "Failed to upload listening test" },
// //       { status: 500 }
// //     );
// //   }
// // }

// // export async function GET() {
// //   try {
// //     const tests = await prisma.listeningTest.findMany({
// //       // 🐛 Add 'slug' to the select statement.
// //       select: { title: true, slug: true },
// //       orderBy: { createdAt: "desc" },
// //     });
// //     return NextResponse.json(tests);
// //   } catch (error) {
// //     console.error(error);
// //     return NextResponse.json(
// //       { error: "Failed to fetch tests" },
// //       { status: 500 }
// //     );
// //   }
// // }

// // app/api/admin/listening/route.ts
// import { NextResponse } from "next/server";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// export async function POST(req: Request) {
//   try {
//     const { title, slug, audioPath, content, correctAnswers } =
//       await req.json();

//     if (!title || !slug || !audioPath || !content || !correctAnswers) {
//       return NextResponse.json(
//         { error: "Missing required fields" },
//         { status: 400 }
//       );
//     }

//     const newTest = await prisma.listeningTest.create({
//       data: {
//         title,
//         slug,
//         audioPath,
//         content,
//         correctAnswers,
//       },
//     });

//     return NextResponse.json(newTest, { status: 201 });
//   } catch (error) {
//     console.error("Error creating new listening test:", error);
//     return NextResponse.json(
//       { error: "Failed to create test" },
//       { status: 500 }
//     );
//   }
// }

// app/api/listening-test/route.ts

// app/api/listening-test/route.ts

// app/api/listening/route.ts
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
