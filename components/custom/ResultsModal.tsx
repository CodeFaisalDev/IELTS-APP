"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CheckCircle, XCircle, Trophy } from "lucide-react";

interface ResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  backendAnswers: Record<string, string | string[]>;
  userAnswers: Record<string, string | string[]>;
  onStartAnother: () => void;
}

interface QuestionResult {
  questionId: string;
  userAnswer: string | string[];
  correctAnswer: string | string[];
  isCorrect: boolean;
}

export default function ResultModal({
  isOpen,
  onClose,
  backendAnswers,
  userAnswers,
  onStartAnother,
}: ResultModalProps) {
  // Function to normalize answers for comparison
  const normalizeAnswer = (answer: string | string[]): string[] => {
    if (Array.isArray(answer)) {
      return answer.map((a) => a.toString().toLowerCase().trim());
    }
    return [answer.toString().toLowerCase().trim()];
  };

  // Function to check if user answer matches any of the correct answers
  const isAnswerCorrect = (
    userAns: string | string[],
    correctAns: string | string[]
  ): boolean => {
    if (!userAns || (Array.isArray(userAns) && userAns.length === 0)) {
      return false;
    }

    const normalizedUserAns = normalizeAnswer(userAns);
    const normalizedCorrectAns = normalizeAnswer(correctAns);

    // For multiple choice questions, check if all user answers are correct
    if (Array.isArray(userAns) && Array.isArray(correctAns)) {
      if (normalizedUserAns.length !== normalizedCorrectAns.length) {
        return false;
      }
      return normalizedUserAns.every((ans) =>
        normalizedCorrectAns.includes(ans)
      );
    }

    // For single answers, check if user answer matches any of the correct answers
    return normalizedUserAns.some((userAnswer) =>
      normalizedCorrectAns.includes(userAnswer)
    );
  };

  // Calculate results
  const calculateResults = (): {
    results: QuestionResult[];
    correctCount: number;
    totalQuestions: number;
    bandScore: number;
  } => {
    const results: QuestionResult[] = [];
    let correctCount = 0;

    // Get all question numbers from backend answers
    const allQuestions = Object.keys(backendAnswers).sort((a, b) => {
      const numA = parseInt(a);
      const numB = parseInt(b);
      return numA - numB;
    });

    allQuestions.forEach((questionId) => {
      const correctAnswer = backendAnswers[questionId];
      const userAnswer = userAnswers[`Q${questionId}`] || "";
      const isCorrect = isAnswerCorrect(userAnswer, correctAnswer);

      if (isCorrect) {
        correctCount++;
      }

      results.push({
        questionId,
        userAnswer,
        correctAnswer,
        isCorrect,
      });
    });

    const totalQuestions = allQuestions.length;

    // IELTS Listening Band Score Calculation (out of 40 questions)
    const getBandScore = (correct: number, total: number): number => {
      if (total !== 40) {
        // If not exactly 40 questions, scale proportionally
        const scaledCorrect = (correct / total) * 40;
        return getBandScore(Math.round(scaledCorrect), 40);
      }

      // Standard IELTS Listening Band Score mapping
      if (correct >= 39) return 9.0;
      if (correct >= 37) return 8.5;
      if (correct >= 35) return 8.0;
      if (correct >= 32) return 7.5;
      if (correct >= 30) return 7.0;
      if (correct >= 26) return 6.5;
      if (correct >= 23) return 6.0;
      if (correct >= 18) return 5.5;
      if (correct >= 16) return 5.0;
      if (correct >= 13) return 4.5;
      if (correct >= 11) return 4.0;
      if (correct >= 8) return 3.5;
      if (correct >= 6) return 3.0;
      if (correct >= 4) return 2.5;
      if (correct >= 3) return 2.0;
      if (correct >= 2) return 1.5;
      if (correct >= 1) return 1.0;
      return 0;
    };

    const bandScore = getBandScore(correctCount, totalQuestions);

    return {
      results,
      correctCount,
      totalQuestions,
      bandScore,
    };
  };

  const { results, correctCount, totalQuestions, bandScore } =
    calculateResults();
  const incorrectCount = totalQuestions - correctCount;
  const percentage = Math.round((correctCount / totalQuestions) * 100);

  // Function to display answer in a readable format
  const displayAnswer = (answer: string | string[]): string => {
    if (Array.isArray(answer)) {
      return answer.join(", ");
    }
    return answer.toString();
  };

  // Get band score color
  const getBandScoreColor = (score: number): string => {
    if (score >= 8.0) return "text-green-600";
    if (score >= 6.5) return "text-blue-600";
    if (score >= 5.5) return "text-yellow-600";
    return "text-red-600";
  };

  const getBandScoreBackground = (score: number): string => {
    if (score >= 8.0) return "bg-green-100 dark:bg-green-900/20";
    if (score >= 6.5) return "bg-blue-100 dark:bg-blue-900/20";
    if (score >= 5.5) return "bg-yellow-100 dark:bg-yellow-900/20";
    return "bg-red-100 dark:bg-red-900/20";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Trophy className="w-6 h-6 text-yellow-500" />
            Test Results
          </DialogTitle>
          <DialogDescription>
            Your IELTS Listening Test performance summary
          </DialogDescription>
        </DialogHeader>

        {/* Score Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div
            className={`p-4 rounded-lg text-center ${getBandScoreBackground(
              bandScore
            )}`}
          >
            <div
              className={`text-3xl font-bold ${getBandScoreColor(bandScore)}`}
            >
              {bandScore}
            </div>
            <div className="text-sm font-medium">IELTS Band Score</div>
          </div>

          <div className="p-4 bg-green-100 dark:bg-green-900/20 rounded-lg text-center">
            <div className="text-3xl font-bold text-green-600">
              {correctCount}
            </div>
            <div className="text-sm font-medium">Correct Answers</div>
          </div>

          <div className="p-4 bg-red-100 dark:bg-red-900/20 rounded-lg text-center">
            <div className="text-3xl font-bold text-red-600">
              {incorrectCount}
            </div>
            <div className="text-sm font-medium">Incorrect Answers</div>
          </div>
        </div>

        {/* Overall Performance */}
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">Overall Performance</span>
            <span className="font-bold">{percentage}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {correctCount} out of {totalQuestions} questions answered correctly
          </div>
        </div>

        {/* Detailed Results */}
        <div className="space-y-3">
          <h3 className="font-semibold text-lg mb-3">
            Question-by-Question Results
          </h3>
          <div className="max-h-60 overflow-y-auto space-y-2">
            {results.map((result, index) => (
              <div
                key={result.questionId}
                className={`p-3 rounded-lg border ${
                  result.isCorrect
                    ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                    : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                }`}
              >
                <div className="flex items-start gap-3">
                  {result.isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm mb-1">
                      Question {result.questionId}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="font-medium text-gray-600 dark:text-gray-400">
                          Your Answer:
                        </span>
                        <div
                          className={`mt-1 p-2 rounded ${
                            result.isCorrect
                              ? "bg-green-100 dark:bg-green-800/30"
                              : "bg-red-100 dark:bg-red-800/30"
                          }`}
                        >
                          {displayAnswer(result.userAnswer) || "No answer"}
                        </div>
                      </div>

                      <div>
                        <span className="font-medium text-gray-600 dark:text-gray-400">
                          Correct Answer:
                        </span>
                        <div className="mt-1 p-2 bg-blue-100 dark:bg-blue-800/30 rounded">
                          {displayAnswer(result.correctAnswer)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-center pt-4">
          <Button
            onClick={onStartAnother}
            size="lg"
            className="w-full md:w-auto"
          >
            Start Another Test
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
