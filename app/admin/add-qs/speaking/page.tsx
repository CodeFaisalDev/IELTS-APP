"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Trash2 } from "lucide-react";

// Define the types for your data structures
type Question = {
  text: string;
  sampleAnswer: string;
};

type SpeakingContent = {
  introduction: Question[];
  part1: Question[];
  part2: Question[];
  part3: Question[];
  closing: string;
  cueCard: string;
};

export default function AddSpeakingTestPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  // Use the new type for the state
  const [content, setContent] = useState<SpeakingContent>({
    introduction: [],
    part1: [],
    part2: [],
    part3: [],
    closing: "",
    cueCard: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTextChange = (part: "closing" | "cueCard", value: string) => {
    setContent((prevContent) => ({
      ...prevContent,
      [part]: value,
    }));
  };

  const handleQuestionChange = (
    part: "introduction" | "part1" | "part2" | "part3",
    index: number,
    field: keyof Question, // Use keyof to specify allowed fields
    value: string
  ) => {
    setContent((prevContent) => {
      const newContent = { ...prevContent };
      if (newContent[part] && newContent[part][index]) {
        newContent[part][index][field] = value;
      }
      return newContent;
    });
  };

  const addQuestion = (part: "introduction" | "part1" | "part2" | "part3") => {
    setContent((prev) => {
      const newContent = { ...prev };
      newContent[part].push({ text: "", sampleAnswer: "" });
      return newContent;
    });
  };

  const removeQuestion = (
    part: "introduction" | "part1" | "part2" | "part3",
    index: number
  ) => {
    setContent((prev) => {
      const newContent = { ...prev };
      newContent[part] = newContent[part].filter(
        (_: Question, i: number) => i !== index
      );
      return newContent;
    });
  };

  // Pass the correct types to renderQuestions
  const renderQuestions = (part: string, questions: Question[]) => (
    <div className="space-y-4">
      {questions.map((q, index) => (
        <Card key={index} className="p-4 bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center space-x-2 mb-2">
            <Label>Question {index + 1}:</Label>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() =>
                removeQuestion(
                  part as "introduction" | "part1" | "part2" | "part3",
                  index
                )
              }
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
          <Textarea
            placeholder="Enter question text..."
            value={q.text}
            onChange={(e) =>
              handleQuestionChange(
                part as "introduction" | "part1" | "part2" | "part3",
                index,
                "text",
                e.target.value
              )
            }
            className="mb-2"
          />
          <Label>Sample Answer:</Label>
          <Textarea
            placeholder="Enter sample answer for tips..."
            value={q.sampleAnswer}
            onChange={(e) =>
              handleQuestionChange(
                part as "introduction" | "part1" | "part2" | "part3",
                index,
                "sampleAnswer",
                e.target.value
              )
            }
          />
        </Card>
      ))}
    </div>
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!title || !slug) {
      alert("Please fill in the title and slug.");
      setIsSubmitting(false);
      return;
    }

    // Reformat the data for submission to match the required backend structure
    const submissionData = {
      title,
      slug,
      content: {
        Introduction: {
          questions: content.introduction,
        },
        part1: {
          questions: content.part1,
        },
        part2: {
          questions: content.part2,
        },
        part3: {
          questions: content.part3,
        },
        closing: content.closing,
        cueCard: content.cueCard,
      },
    };

    try {
      const res = await fetch("/api/speaking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });

      if (res.ok) {
        alert("Speaking test created successfully!");
        router.push("/admin");
      } else {
        const errorData = await res.json();
        alert(`Failed to create test: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        Add New IELTS Speaking Test
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Test Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Speaking Test 1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) =>
                  setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))
                }
                placeholder="e.g., speaking-test-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Introduction */}
        <Card>
          <CardHeader>
            <CardTitle>Introduction</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => addQuestion("introduction")}
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Introduction Question
            </Button>
            {renderQuestions("introduction", content.introduction)}
          </CardContent>
        </Card>

        {/* Part 1 */}
        <Card>
          <CardHeader>
            <CardTitle>Part 1</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => addQuestion("part1")}
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Part 1 Question
            </Button>
            {renderQuestions("part1", content.part1)}
          </CardContent>
        </Card>

        {/* Part 2 */}
        <Card>
          <CardHeader>
            <CardTitle>Part 2</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => addQuestion("part2")}
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Part 2 Question
            </Button>
            {renderQuestions("part2", content.part2)}
          </CardContent>
        </Card>

        {/* Part 3 */}
        <Card>
          <CardHeader>
            <CardTitle>Part 3</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => addQuestion("part3")}
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Part 3 Question
            </Button>
            {renderQuestions("part3", content.part3)}
          </CardContent>
        </Card>

        {/* Closing */}
        <Card>
          <CardHeader>
            <CardTitle>Closing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="closing">Closing Text:</Label>
              <Textarea
                id="closing"
                value={content.closing}
                onChange={(e) => handleTextChange("closing", e.target.value)}
                placeholder="Enter closing remark..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Cue Card */}
        <Card>
          <CardHeader>
            <CardTitle>Cue Card</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cueCard">Cue Card Text:</Label>
              <Textarea
                id="cueCard"
                value={content.cueCard}
                onChange={(e) => handleTextChange("cueCard", e.target.value)}
                placeholder="Describe a book you have recently read. You should say:

What kind of book it is

What it is about

What sort of people would enjoy it

And explain why you liked/disliked it."
                rows={8}
              />
            </div>
          </CardContent>
        </Card>

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save Speaking Test"}
        </Button>
      </form>
    </div>
  );
}
