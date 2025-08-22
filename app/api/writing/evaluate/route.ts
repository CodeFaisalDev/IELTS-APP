import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

// IMPORTANT: Access your API key from environment variables
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

// The main function that handles POST requests
export async function POST(req: NextRequest) {
  try {
    // 1. Get the user's essay and the task question from the request body
    const { taskQuestion, backendSampleEssay, userEssay } = await req.json();

    if (!taskQuestion || !backendSampleEssay || !userEssay) {
      return NextResponse.json(
        { error: "Missing taskQuestion or userEssay in request body" },
        { status: 400 }
      );
    }

    // 2. The full prompt template
    const prompt = `
      **Role:** You are an expert IELTS examiner. Your task is to evaluate a user's written response for an IELTS writing task.

      **Context: IELTS Band Descriptors**
      {Paste the entire Band 1-9 descriptor text you provided in the previous question here}
      ---
      **Task Information:**
      * **IELTS Writing Task Question:** \`\`\`${taskQuestion}\`\`\`
      * * **IELTS Writing Sample Ans With Band To understand what the qus is about and how to approach it:** \`\`\`${backendSampleEssay}\`\`\`
      * **User's Essay:** \`\`\`${userEssay}\`\`\`
      ---
      **Your Instructions:**
      1.  **Analyze:** Carefully read the user's essay and evaluate it against the four criteria in the IELTS Band Descriptors (Task Achievement/Response, Coherence and Cohesion, Lexical Resource, Grammatical Range and Accuracy).
      2.  **Assign Scores:** Provide a band score from 1.0 to 9.0 for EACH of the four criteria. Calculate the overall band score (the average of the four).
      3.  **Provide Feedback:** For each criterion, write a detailed paragraph explaining the user's strengths and weaknesses, justifying the score you awarded.
      4.  **Give Improvement Tips:** Provide a list of specific, actionable tips that the user can follow to improve their score for the next attempt.
      5.  **Write a Model Answer:** Write a new, high-scoring (Band 8+) model answer for the given IELTS Writing Task Question.

      **Output Format:**
      Respond ONLY with a valid JSON object. Do not include any other text or explanations outside of the JSON structure. The structure should be as follows:
      \`\`\`json
      {
        "scores": { "taskAchievement": 0.0, "coherenceAndCohesion": 0.0, "lexicalResource": 0.0, "grammaticalRangeAndAccuracy": 0.0, "overall": 0.0 },
        "feedback": { "taskAchievement": "...", "coherenceAndCohesion": "...", "lexicalResource": "...", "grammaticalRangeAndAccuracy": "..." },
        "improvementTips": [ "Tip 1...", "Tip 2...", "Tip 3..." ],
        "modelAnswer": "Your complete Band 8+ model answer here..."
      }
      \`\`\`
    `;

    // 3. Call the Gemini API
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 4. Clean and parse the response from the AI
    const cleanedJsonString = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    const jsonResponse = JSON.parse(cleanedJsonString);

    // 5. Send the parsed JSON back to your frontend
    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json(
      { error: "An internal server error occurred." },
      { status: 500 }
    );
  }
}
