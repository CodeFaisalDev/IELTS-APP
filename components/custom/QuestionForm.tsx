// components/admin/QuestionForm.tsx

// Import necessary UI components from your library
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Define the props that the QuestionForm component expects.
// It receives a question object, functions to update and delete, and its index in the list.
export function QuestionForm({
  question,
  onUpdate,
  onDelete,
  index,
}: {
  question: any;
  onUpdate: (index: number, newQuestion: any) => void;
  onDelete: (index: number) => void;
  index: number;
}) {
  // This function handles a change in the question type dropdown.
  // It resets the question content to a default structure for the new type.
  const handleTypeChange = (value: string) => {
    let newContent = {};
    if (value === "fill-in-the-blank") {
      newContent = { text: "Write your question here with blanks like __1__." };
    } else if (value === "multiple-choice") {
      newContent = {
        questionText: "Write your question here.",
        options: [{ text: "", correct: false }],
      };
    }
    // Call the parent component's onUpdate function with the updated question object.
    onUpdate(index, { ...question, type: value, content: newContent });
  };

  return (
    <div className="border p-4 rounded-md space-y-4">
      {/* Header for the question block, showing its number and a delete button */}
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg">Question {index + 1}</h3>
        <Button onClick={() => onDelete(index)} variant="destructive" size="sm">
          Delete
        </Button>
      </div>

      {/* Dropdown to select the question type */}
      <div className="grid gap-2">
        <Label htmlFor={`q-type-${index}`}>Question Type</Label>
        <Select value={question.type} onValueChange={handleTypeChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fill-in-the-blank">Fill-in-the-Blank</SelectItem>
            <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Conditional rendering: Renders different form fields based on the selected question type */}
      {question.type === "fill-in-the-blank" && (
        <div className="grid gap-2">
          {/* Input for the question text with placeholders for blanks */}
          <Label htmlFor={`q-text-${index}`}>Question Text</Label>
          <Textarea
            id={`q-text-${index}`}
            value={question.content.text}
            onChange={(e) =>
              onUpdate(index, {
                ...question,
                content: { text: e.target.value },
              })
            }
            placeholder="e.g., The main issue was __1__ for the project."
          />
          {/* Input for the correct answer(s) */}
          <Label htmlFor={`q-answer-${index}`}>Correct Answer(s)</Label>
          <Input
            id={`q-answer-${index}`}
            value={question.correctAnswers[0]}
            onChange={(e) =>
              onUpdate(index, {
                ...question,
                correctAnswers: [e.target.value],
              })
            }
            placeholder="e.g., 'funding' or 'funding, money'"
          />
        </div>
      )}

      {question.type === "multiple-choice" && (
        <div className="grid gap-4">
          {/* Input for the multiple-choice question text */}
          <Label htmlFor={`mc-question-${index}`}>Question</Label>
          <Input
            id={`mc-question-${index}`}
            value={question.content.questionText}
            onChange={(e) =>
              onUpdate(index, {
                ...question,
                content: { ...question.content, questionText: e.target.value },
              })
            }
            placeholder="e.g., What is the main topic?"
          />
          <Label>Options</Label>
          {/* Renders input fields for each multiple-choice option */}
          {question.content.options.map((option: any, optIndex: number) => (
            <div key={optIndex} className="flex items-center space-x-2">
              <Input
                value={option.text}
                onChange={(e) => {
                  const newOptions = [...question.content.options];
                  newOptions[optIndex].text = e.target.value;
                  onUpdate(index, {
                    ...question,
                    content: { ...question.content, options: newOptions },
                  });
                }}
                placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
              />
              {/* Button to mark an option as the correct answer */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newAnswers = [String.fromCharCode(65 + optIndex)];
                  onUpdate(index, {
                    ...question,
                    correctAnswers: newAnswers,
                  });
                }}
              >
                {question.correctAnswers.includes(
                  String.fromCharCode(65 + optIndex)
                )
                  ? "Correct"
                  : "Mark as Correct"}
              </Button>
            </div>
          ))}
          {/* Button to add a new option */}
          <Button
            variant="outline"
            onClick={() => {
              const newOptions = [
                ...question.content.options,
                { text: "", correct: false },
              ];
              onUpdate(index, {
                ...question,
                content: { ...question.content, options: newOptions },
              });
            }}
          >
            Add Option
          </Button>
        </div>
      )}
    </div>
  );
}
