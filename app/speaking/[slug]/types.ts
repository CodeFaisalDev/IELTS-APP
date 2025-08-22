// app/speaking/[slug]/types.ts

// Structure for an individual question from the API
export interface Question {
  text: string;
  sampleAnswer: string;
}

// Structure of the fetched test data from the API
export interface TestData {
  title: string;
  slug: string;
  content: {
    Introduction: { questions: Question[] };
    part1: { questions: Question[] };
    part2: { questions: Question[] };
    part3: { questions: Question[] };
    closing: string;
    cueCard: string;
  };
}

// Flattened question structure for internal application use
export interface FormattedQuestion {
  text: string;
  sampleAnswer: string;
  part: string;
  isCueCardIntro: boolean; // Flag for the question that introduces the cue card
}

// Represents the possible states of the speaking test
export type TestState =
  | "idle"
  | "narrating" // Examiner is speaking
  | "preparing" // User is preparing for Part 2
  | "listening" // App is listening for user's speech
  | "processing" // An intermediate state, e.g., after speech recognition
  | "finished"; // Test is complete, before evaluation

// A pair of a question asked and the user's transcribed answer
export interface QAPair {
  question: string;
  answer: string;
}

// The structure of the AI evaluation result for the speaking test
export interface EvaluationResult {
  overallBandScore: number;
  feedback: {
    fluencyAndCoherence: string;
    lexicalResource: string;
    grammaticalRangeAndAccuracy: string;
    pronunciation: string;
    overallSummary: string;
  };
}
