// app/speaking/[slug]/components/SpeakingResultModal.tsx

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";
import Link from "next/link";
import { EvaluationResult } from "../types";

interface SpeakingResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  evaluationResult: EvaluationResult | null;
}

type FeedbackKey = keyof EvaluationResult["feedback"];

const feedbackCriteria: { key: FeedbackKey; label: string }[] = [
  { key: "fluencyAndCoherence", label: "Fluency & Coherence" },
  { key: "lexicalResource", label: "Lexical Resource" },
  {
    key: "grammaticalRangeAndAccuracy",
    label: "Grammar & Accuracy",
  },
  { key: "pronunciation", label: "Pronunciation" },
];

export default function SpeakingResultModal({
  isOpen,
  onClose,
  evaluationResult,
}: SpeakingResultModalProps) {
  if (!evaluationResult) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black dark:bg-gray-900 dark:text-gray-100 max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Trophy className="w-6 h-6 text-yellow-500" /> Your Speaking Test
            Results
          </DialogTitle>
          <DialogDescription>
            Detailed AI-powered evaluation of your IELTS speaking performance.
          </DialogDescription>
        </DialogHeader>

        {/* Overall Band Score */}
        <div className="p-4 my-4 rounded-lg text-center bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/30">
          <div className="text-5xl font-extrabold text-yellow-600 dark:text-yellow-400">
            {evaluationResult.overallBandScore.toFixed(1)}
          </div>
          <div className="text-lg font-medium text-gray-800 dark:text-gray-200">
            Overall Band Score
          </div>
        </div>

        {/* Overall Summary */}
        <div className="my-6">
          <h3 className="font-bold text-xl mb-3">📝 Overall Summary</h3>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            <p className="text-gray-700 dark:text-gray-300">
              {evaluationResult.feedback.overallSummary}
            </p>
          </div>
        </div>

        {/* Individual Feedback */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {feedbackCriteria.map((criterion) => (
            <div
              key={criterion.key}
              className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <h4 className="font-semibold text-lg mb-2">{criterion.label}</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {evaluationResult.feedback[criterion.key]}
              </p>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex justify-center pt-6">
          <Button onClick={onClose} asChild>
            <Link href="/">Start Another Module</Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
