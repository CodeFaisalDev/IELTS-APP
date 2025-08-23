import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Trophy } from "lucide-react";
import {
  getBandScore,
  getBandScoreColor,
  getBandScoreBackground,
} from "../util/scoreCalculator";
import { ResultModalProps, QuestionResult } from "../types";

const ResultModal: React.FC<ResultModalProps> = ({
  isOpen,
  backendAnswers,
  userAnswers,
  onStartAnother,
}) => {
  const normalizeAnswer = (answer: string | string[]): string[] => {
    if (Array.isArray(answer))
      return answer.map((a) => a.toString().toLowerCase().trim());
    return [answer.toString().toLowerCase().trim()];
  };

  const isAnswerCorrect = (
    userAns: string | string[],
    correctAns: string | string[]
  ): boolean => {
    if (!userAns || (Array.isArray(userAns) && userAns.length === 0))
      return false;
    const normalizedUserAns = normalizeAnswer(userAns);
    const normalizedCorrectAns = normalizeAnswer(correctAns);
    if (Array.isArray(userAns) && Array.isArray(correctAns)) {
      if (normalizedUserAns.length !== normalizedCorrectAns.length)
        return false;
      return normalizedUserAns.every((ans) =>
        normalizedCorrectAns.includes(ans)
      );
    }
    return normalizedUserAns.some((userAnswer) =>
      normalizedCorrectAns.includes(userAnswer)
    );
  };

  const calculateResults = () => {
    const results: QuestionResult[] = [];
    let correctCount = 0;
    const allQuestions = Object.keys(backendAnswers).sort(
      (a, b) => parseInt(a) - parseInt(b)
    );

    allQuestions.forEach((questionId) => {
      const correctAnswer = backendAnswers[questionId];
      const userAnswer = userAnswers[`Q${questionId}`] || "";
      const isCorrect = isAnswerCorrect(userAnswer, correctAnswer);
      if (isCorrect) correctCount++;
      results.push({ questionId, userAnswer, correctAnswer, isCorrect });
    });

    const totalQuestions = allQuestions.length;
    const bandScore = getBandScore(correctCount, totalQuestions);
    return { results, correctCount, totalQuestions, bandScore };
  };

  const { results, correctCount, totalQuestions, bandScore } =
    calculateResults();
  const percentage = Math.round((correctCount / totalQuestions) * 100);

  const displayAnswer = (answer: string | string[]): string =>
    Array.isArray(answer) ? answer.join(", ") : answer.toString();

  return (
    <Dialog open={isOpen}>
      <DialogContent className="bg-white text-black max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Trophy className="w-6 h-6 text-yellow-500" /> Test Results
          </DialogTitle>
          <DialogDescription>
            Your IELTS Listening Test performance summary
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div
            className={`p-4 rounded-lg text-center ${getBandScoreBackground(
              bandScore
            )}`}
          >
            <div
              className={`text-3xl font-bold ${getBandScoreColor(bandScore)}`}
            >
              {bandScore.toFixed(1)}
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
              {totalQuestions - correctCount}
            </div>
            <div className="text-sm font-medium">Incorrect Answers</div>
          </div>
        </div>
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-300/50 rounded-lg">
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
        <div className="space-y-3">
          <h3 className="font-semibold text-lg mb-3">
            Question-by-Question Results
          </h3>
          <div className="max-h-60 overflow-y-auto space-y-2">
            {results.map((result) => (
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
        <div className="flex justify-center pt-4">
          <Button
            onClick={onStartAnother}
            size="lg"
            className="w-full border md:w-auto"
          >
            Start Another Module
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResultModal;
