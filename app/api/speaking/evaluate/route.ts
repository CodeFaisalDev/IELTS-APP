// app/api/speaking/evaluate/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const MODEL_NAME = "gemini-1.5-flash";
const API_KEY = process.env.GOOGLE_API_KEY!;

// Define a type for the expected request body
type QAPair = {
  question: string;
  answer: string;
};

export async function POST(request: NextRequest) {
  if (!API_KEY) {
    return NextResponse.json(
      { error: "Google API key not configured" },
      { status: 500 }
    );
  }

  try {
    const { qaPairs } = (await request.json()) as { qaPairs: QAPair[] };

    if (!qaPairs || !Array.isArray(qaPairs) || qaPairs.length === 0) {
      return NextResponse.json(
        { error: "Question-answer pairs are required" },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    // Format the Q&A pairs for the prompt
    const formattedQAPairs = qaPairs
      .map(
        (pair, index) =>
          `Question ${index + 1}: ${pair.question}\nCandidate's Answer ${
            index + 1
          }: ${pair.answer || "(No answer provided)"}`
      )
      .join("\n\n");

    const prompt = `
      You are an expert IELTS examiner. Your task is to evaluate a candidate's speaking performance based on a provided transcript of their test. The transcript contains a series of questions asked by an examiner and the answers given by the candidate.

      Please evaluate the candidate's performance based on the official IELTS speaking band descriptors:
      1.  **Fluency and Coherence**: The ability to speak at length, linking ideas together logically, and the speed and ease of speech.
      2.  **Lexical Resource (Vocabulary)**: The range of vocabulary used and the ability to use it accurately and appropriately.
      3.  **Grammatical Range and Accuracy**: The range and accuracy of the grammatical structures used.
      4.  **Pronunciation**: While you cannot hear the candidate, assess this based on textual evidence like simplicity of vocabulary that might suggest pronunciation challenges, or grammatical errors that are common for non-native speakers. Acknowledge this limitation in your feedback.

      After your evaluation, provide a final overall band score from 1.0 to 9.0 (using 0.5 increments like 6.0, 6.5, 7.0).

      Here is the transcript of the candidate's test:
      ---
      ${formattedQAPairs}
      ---

      Respond ONLY with a valid JSON object in the following format. Do not include any other text, greetings, or markdown formatting (like \`\`\`json) before or after the JSON object.

      {
        "overallBandScore": <number>,
        "feedback": {
          "fluencyAndCoherence": "<Detailed feedback on fluency and coherence>",
          "lexicalResource": "<Detailed feedback on lexical resource>",
          "grammaticalRangeAndAccuracy": "<Detailed feedback on grammatical range and accuracy>",
          "pronunciation": "<Detailed feedback on pronunciation, acknowledging the limitation of text-only analysis>",
          "overallSummary": "<A concise overall summary of the performance with key strengths and areas for improvement>"
        }
      }
    `;

    const generationConfig = {
      temperature: 0.6,
      topK: 1,
      topP: 1,
      maxOutputTokens: 2048,
    };

    // Safety settings to reduce chances of the model refusing to answer
    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig,
      safetySettings,
    });

    const responseText = result.response.text();

    // Clean the response text to ensure it's valid JSON
    const cleanedJsonString = responseText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    const evaluation = JSON.parse(cleanedJsonString);

    return NextResponse.json(evaluation);
  } catch (error: unknown) {
    console.error("Error calling Google Gemini API:", error);
    let errorMessage = "Failed to evaluate speaking test";

    // Use a type guard to check if the error is an object with a message property
    if (typeof error === "object" && error !== null && "message" in error) {
      errorMessage = (error as { message: string }).message;
    }

    // Check if the error is from the Gemini API itself
    if (
      typeof error === "object" &&
      error !== null &&
      "response" in error &&
      typeof (error as { response: any }).response === "object" &&
      "data" in (error as { response: any }).response
    ) {
      console.error(
        "Gemini API Response Error:",
        (error as { response: any }).response.data
      );
    }

    return NextResponse.json(
      { error: "Failed to evaluate speaking test", details: errorMessage },
      { status: 500 }
    );
  }
}
