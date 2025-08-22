// components/WritingResultModal.tsx
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

// Define the shape of the evaluation result from the AI API
interface EvaluationResult {
  scores: {
    taskAchievement: number;
    coherenceAndCohesion: number;
    lexicalResource: number;
    grammaticalRangeAndAccuracy: number;
    overall: number;
  };
  feedback: {
    taskAchievement: string;
    coherenceAndCohesion: string;
    lexicalResource: string;
    grammaticalRangeAndAccuracy: string;
  };
  improvementTips: string[];
  modelAnswer: string;
}

interface WritingResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  evaluationResult: EvaluationResult | null;
}

// 🎯 FIX: Create a type for the score keys
type ScoreKey = keyof EvaluationResult["scores"];
type FeedbackKey = keyof EvaluationResult["feedback"];

// 🎯 FIX: Update the scoreCriteria array to use the new types
const scoreCriteria: { key: ScoreKey; label: string }[] = [
  { key: "taskAchievement", label: "Task Achievement" },
  { key: "coherenceAndCohesion", label: "Coherence & Cohesion" },
  { key: "lexicalResource", label: "Lexical Resource" },
  { key: "grammaticalRangeAndAccuracy", label: "Grammar" },
];

export default function WritingResultModal({
  isOpen,
  onClose,
  evaluationResult,
}: WritingResultModalProps) {
  if (!evaluationResult) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Trophy className="w-6 h-6 text-yellow-500" /> Your Writing Test
            Results
          </DialogTitle>
          <DialogDescription>
            Detailed AI-powered evaluation of your IELTS writing tasks.
          </DialogDescription>
        </DialogHeader>

        {/* Overall Band Score */}
        <div className="p-4 my-4 rounded-lg text-center bg-yellow-100 border border-yellow-200">
          <div className="text-5xl font-extrabold text-yellow-600">
            {evaluationResult.scores.overall.toFixed(1)}
          </div>
          <div className="text-lg font-medium">Overall Band Score</div>
        </div>

        {/* Individual Scores & Feedback */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scoreCriteria.map((criterion) => (
            <div key={criterion.key} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-lg">{criterion.label}</span>
                <span className="text-2xl font-bold text-blue-600">
                  {/* 🎯 FIX: Use the typed key */}
                  {evaluationResult.scores[criterion.key].toFixed(1)}
                </span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                {/* 🎯 FIX: Use a type assertion to satisfy TypeScript */}
                {evaluationResult.feedback[criterion.key as FeedbackKey]}
              </p>
            </div>
          ))}
        </div>

        {/* Improvement Tips */}
        <div className="my-6">
          <h3 className="font-bold text-xl mb-3">🎯 Improvement Tips</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            {evaluationResult.improvementTips.map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </div>

        {/* Model Answer */}
        <div className="my-6">
          <h3 className="font-bold text-xl mb-3">
            ✨ Example of Good Answer (Band 8+)
          </h3>
          <div className="bg-gray-100 p-4 rounded-lg whitespace-pre-wrap">
            {evaluationResult.modelAnswer}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-center pt-4">
          <Button onClick={onClose} className="border" asChild>
            <Link href="/">Start Another Module</Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
