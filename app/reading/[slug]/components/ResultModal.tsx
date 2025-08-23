import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Trophy } from "lucide-react";
import { UserAnswers } from "../types";
import Link from "next/link";

// ---------------- Band Score Conversion (IELTS Reading) ----------------
// Academic reading band score conversion (approximate)
const getReadingBandScore = (correct: number, total: number): number => {
  const percentage = (correct / total) * 100;

  if (total === 40) {
    if (correct >= 39) return 9;
    if (correct >= 37) return 8.5;
    if (correct >= 35) return 8;
    if (correct >= 33) return 7.5;
    if (correct >= 30) return 7;
    if (correct >= 27) return 6.5;
    if (correct >= 23) return 6;
    if (correct >= 19) return 5.5;
    if (correct >= 15) return 5;
    if (correct >= 13) return 4.5;
    if (correct >= 10) return 4;
    if (correct >= 7) return 3.5;
    if (correct >= 5) return 3;
    return 2.5;
  }

  // fallback generic band calculation
  if (percentage >= 90) return 9;
  if (percentage >= 85) return 8.5;
  if (percentage >= 80) return 8;
  if (percentage >= 75) return 7.5;
  if (percentage >= 70) return 7;
  if (percentage >= 65) return 6.5;
  if (percentage >= 60) return 6;
  if (percentage >= 55) return 5.5;
  if (percentage >= 50) return 5;
  if (percentage >= 45) return 4.5;
  if (percentage >= 40) return 4;
  if (percentage >= 30) return 3.5;
  if (percentage >= 20) return 3;
  return 2.5;
};

// ---------------- Props & Types ----------------
interface ResultModalProps {
  isOpen: boolean;
  userAnswers: UserAnswers;
  backendAnswers: Record<string, string | string[]>;
}

interface ResultDetail {
  qNum: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

// ---------------- Helper ----------------
const checkAnswer = (
  userAns: string,
  correctAns: string | string[]
): boolean => {
  if (!userAns) return false;
  const formattedUserAns = userAns.trim().toUpperCase();
  if (Array.isArray(correctAns)) {
    return correctAns.map((a) => a.toUpperCase()).includes(formattedUserAns);
  }
  return formattedUserAns === correctAns.toUpperCase();
};

// ---------------- Component ----------------
export default function ResultModal({
  isOpen,
  userAnswers,
  backendAnswers,
}: ResultModalProps) {
  const [score, setScore] = useState(0);
  const [results, setResults] = useState<ResultDetail[]>([]);
  const [bandScore, setBandScore] = useState<number>(0);

  useEffect(() => {
    if (isOpen) {
      let correctCount = 0;
      const detailedResults: ResultDetail[] = [];
      const totalQuestions = Object.keys(backendAnswers).length;

      for (let i = 1; i <= totalQuestions; i++) {
        const qNum = String(i);
        const userAnswer = userAnswers[`Q${qNum}`] || "No Answer";
        const correctAnswer = backendAnswers[qNum];
        const isCorrect = checkAnswer(userAnswers[`Q${qNum}`], correctAnswer);

        if (isCorrect) {
          correctCount++;
        }

        detailedResults.push({
          qNum,
          userAnswer,
          correctAnswer: Array.isArray(correctAnswer)
            ? correctAnswer.join(" / ")
            : correctAnswer,
          isCorrect,
        });
      }

      setScore(correctCount);
      setResults(detailedResults);
      setBandScore(getReadingBandScore(correctCount, totalQuestions));
    }
  }, [isOpen, userAnswers, backendAnswers]);

  const totalQuestions = Object.keys(backendAnswers).length;
  const percentage = Math.round((score / totalQuestions) * 100);

  return (
    <Dialog open={isOpen}>
      <DialogContent className="bg-white text-black max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Trophy className="w-6 h-6 text-yellow-500" /> Test Results
          </DialogTitle>
          <DialogDescription>
            Your IELTS Reading Test performance summary
          </DialogDescription>
        </DialogHeader>

        {/* Score Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-lg text-center bg-yellow-100">
            <div className="text-3xl font-bold text-yellow-600">
              {bandScore.toFixed(1)}
            </div>
            <div className="text-sm font-medium">IELTS Band Score</div>
          </div>
          <div className="p-4 bg-green-100 rounded-lg text-center">
            <div className="text-3xl font-bold text-green-600">{score}</div>
            <div className="text-sm font-medium">Correct Answers</div>
          </div>
          <div className="p-4 bg-red-100 rounded-lg text-center">
            <div className="text-3xl font-bold text-red-600">
              {totalQuestions - score}
            </div>
            <div className="text-sm font-medium">Incorrect Answers</div>
          </div>
        </div>

        {/* Performance Bar */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">Overall Performance</span>
            <span className="font-bold">{percentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="text-sm text-gray-600 mt-1">
            {score} out of {totalQuestions} questions answered correctly
          </div>
        </div>

        {/* Question by Question */}
        <div className="space-y-3">
          <h3 className="font-semibold text-lg mb-3">
            Question-by-Question Results
          </h3>
          <div className="max-h-60 overflow-y-auto space-y-2">
            {results.map((res) => (
              <div
                key={res.qNum}
                className={`p-3 rounded-lg border ${
                  res.isCorrect
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <div className="flex items-start gap-3">
                  {res.isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm mb-1">
                      Question {res.qNum}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="font-medium text-gray-600">
                          Your Answer:
                        </span>
                        <div
                          className={`mt-1 p-2 rounded ${
                            res.isCorrect ? "bg-green-100" : "bg-red-100"
                          }`}
                        >
                          {res.userAnswer || "No answer"}
                        </div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">
                          Correct Answer:
                        </span>
                        <div className="mt-1 p-2 bg-blue-100 rounded">
                          {res.correctAnswer}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Start Another */}
        <div className="flex justify-center pt-4">
          <Link href="/">
            <Button size="lg" className="w-full border md:w-auto">
              Start Another Module
            </Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
