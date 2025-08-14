// components/ResultsModal.tsx
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import Link from "next/link";

interface ResultFeedback {
  questionNumber: number;
  userAnswer: string;
  correctAnswers: string[];
  isCorrect: boolean;
}

interface ResultsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  results: {
    totalQuestions: number;
    correctCount: number;
    bandScore: number;
    feedback: ResultFeedback[];
  } | null;
}

const calculateIELTSBand = (correctAnswers: number) => {
  if (correctAnswers >= 39) return 9.0;
  if (correctAnswers >= 37) return 8.5;
  if (correctAnswers >= 35) return 8.0;
  if (correctAnswers >= 32) return 7.5;
  if (correctAnswers >= 30) return 7.0;
  if (correctAnswers >= 26) return 6.5;
  if (correctAnswers >= 23) return 6.0;
  if (correctAnswers >= 20) return 5.5;
  if (correctAnswers >= 16) return 5.0;
  if (correctAnswers >= 13) return 4.5;
  if (correctAnswers >= 10) return 4.0;
  if (correctAnswers >= 7) return 3.5;
  if (correctAnswers >= 5) return 3.0;
  if (correctAnswers >= 3) return 2.5;
  if (correctAnswers >= 2) return 2.0;
  return 0;
};

export default function ResultsModal({
  isOpen,
  onOpenChange,
  results,
}: ResultsModalProps) {
  if (!results) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold">Your Results</DialogTitle>
          <DialogDescription className="text-lg">
            Detailed breakdown of your performance in the test.
          </DialogDescription>
        </DialogHeader>

        <div className="my-4 p-4 rounded-lg bg-gray-100 flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm text-gray-600">Correct Answers</p>
            <p className="text-4xl font-bold text-green-600">
              {results.correctCount} / {results.totalQuestions}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">IELTS Band Score</p>
            <p className="text-4xl font-bold text-blue-600">
              {results.bandScore}
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6">Answer Breakdown</h3>
        <div className="max-h-96 overflow-y-auto border rounded-md p-4">
          {results.feedback.map((item) => (
            <div
              key={item.questionNumber}
              className={`flex justify-between items-center p-2 my-2 rounded-md ${
                item.isCorrect ? "bg-green-50" : "bg-red-50"
              }`}
            >
              <div className="flex-1">
                <p className="font-semibold">Question {item.questionNumber}:</p>
                <p className="text-sm text-gray-600">
                  Your Answer:{" "}
                  <span className="font-medium">
                    {item.userAnswer || "No Answer"}
                  </span>
                </p>
              </div>
              <div className="flex-1 text-right">
                <p className="text-sm text-gray-600">Correct Answer(s):</p>
                <p className="font-medium text-gray-800">
                  {item.correctAnswers.join(" OR ")}
                </p>
              </div>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
          <Link href="/">
            <Button onClick={() => onOpenChange(false)}>
              Back To Model Selection
            </Button>
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
