"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CKEditorWrapper from "@/components/custom/CKEditorWrapper";

export default function AddWritingTestPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [section1, setSection1] = useState("");
  const [section2, setSection2] = useState("");
  const [showSection1, setShowSection1] = useState(false);
  const [showSection2, setShowSection2] = useState(false);
  const [answers, setAnswers] = useState({
    section1: "",
    section2: "",
  });

  const handleAnswerChange = (
    section: "section1" | "section2",
    value: string
  ) => {
    setAnswers((prev) => ({ ...prev, [section]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !slug) {
      alert("Please fill title and slug");
      return;
    }

    if (!section1 && !section2) {
      alert("Please add at least one section");
      return;
    }

    const data = {
      title,
      slug,
      section1: section1 || null,
      section2: section2 || null,
      answers: answers,
    };

    const res = await fetch("/api/writing", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      alert("Writing test created successfully!");
      router.push("/admin");
    } else {
      const errorData = await res.json();
      alert(`Failed to create test: ${errorData.error}`);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Add New IELTS Writing Test</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
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
                placeholder="e.g., Academic Writing Test 1"
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
                placeholder="e.g., academic-writing-test-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Sections */}
        <Card>
          <CardHeader>
            <CardTitle>Writing Tasks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Task 1 */}
            {!showSection1 ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowSection1(true)}
              >
                Add Task 1
              </Button>
            ) : (
              <div className="space-y-2">
                <Label>Task 1</Label>
                <CKEditorWrapper value={section1} onChange={setSection1} />
              </div>
            )}

            {/* Task 2 */}
            {showSection1 && !showSection2 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowSection2(true)}
              >
                Add Task 2
              </Button>
            )}
            {showSection2 && (
              <div className="space-y-2">
                <Label>Task 2</Label>
                <CKEditorWrapper value={section2} onChange={setSection2} />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Answers */}
        <Card>
          <CardHeader>
            <CardTitle>Sample Answers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Provide sample answers for each task to help students learn.
            </p>

            {showSection1 && (
              <div className="space-y-2">
                <Label htmlFor="ans-section1">Sample Answer for Task 1:</Label>
                <Textarea
                  id="ans-section1"
                  value={answers.section1}
                  onChange={(e) =>
                    handleAnswerChange("section1", e.target.value)
                  }
                  placeholder="Enter the sample answer for Task 1..."
                  className="min-h-[150px] resize-y"
                />
              </div>
            )}

            {showSection2 && (
              <div className="space-y-2">
                <Label htmlFor="ans-section2">Sample Answer for Task 2:</Label>
                <Textarea
                  id="ans-section2"
                  value={answers.section2}
                  onChange={(e) =>
                    handleAnswerChange("section2", e.target.value)
                  }
                  placeholder="Enter the sample answer for Task 2..."
                  className="min-h-[200px] resize-y"
                />
              </div>
            )}
          </CardContent>
        </Card>

        <Button type="submit" size="lg" className="w-full">
          Save Writing Test
        </Button>
      </form>
    </div>
  );
}
