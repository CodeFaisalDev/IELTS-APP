"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CKEditorWrapper from "@/components/custom/CKEditorWrapper";

export default function AddReadingTestPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [section1, setSection1] = useState("");
  const [section2, setSection2] = useState("");
  const [section3, setSection3] = useState("");
  const [showSection1, setShowSection1] = useState(false);
  const [showSection2, setShowSection2] = useState(false);
  const [showSection3, setShowSection3] = useState(false);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({
    "1": "",
    "2": "",
    "3": "",
    "4": "",
    "5": "",
  });

  const handleAnswerChange = (num: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [num]: value }));
  };

  const addAnswerField = () => {
    const nextKey = Object.keys(answers).length + 1;
    setAnswers((prev) => ({ ...prev, [String(nextKey)]: "" }));
  };

  const formatAnswersForSubmit = () => {
    const formatted: { [key: string]: string | string[] } = {};
    for (const key in answers) {
      const value = answers[key];
      if (value.includes("/")) {
        formatted[key] = value.split("/").map((s) => s.trim());
      } else {
        formatted[key] = value;
      }
    }
    return JSON.stringify(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug) {
      alert("Please fill title and slug");
      return;
    }

    if (!section1 && !section2 && !section3) {
      alert("Please add at least one section");
      return;
    }

    const data = {
      title,
      slug,
      section1: section1 || null,
      section2: section2 || null,
      section3: section3 || null,
      answers: formatAnswersForSubmit(),
    };

    const res = await fetch("/api/reading", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      alert("Reading test created successfully!");
      router.push("/admin");
    } else {
      alert("Failed to create test.");
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Add New IELTS Reading Test</h1>

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
                placeholder="e.g., Academic Reading Test 1"
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
                placeholder="e.g., academic-reading-test-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Sections */}
        <Card>
          <CardHeader>
            <CardTitle>Reading Sections</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground mb-4">
              <p>Use the following symbols in your content:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>
                  <code>Q1 {"{}"}</code> - Fill in the gaps
                </li>
                <li>
                  <code>-[Q1, Q2, Q3 @option A @option B @option C-]</code> -
                  Multiple choice
                </li>
                <li>
                  <code>-(Q1 @option A @option B @option C-)</code> - Single
                  choice
                </li>
                <li>
                  <code>-$@Q1 Statement @Q2 Statement-$</code> - True/False/Not
                  Given
                </li>
                <li>
                  <code>
                    -$@Q1 {"{}"} @Q2 {"{}"}-%
                  </code>{" "}
                  - Matching
                </li>
              </ul>
            </div>

            {/* Section 1 */}
            {!showSection1 ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowSection1(true)}
              >
                Add Section 1
              </Button>
            ) : (
              <div className="space-y-2">
                <Label>Section 1</Label>
                <CKEditorWrapper value={section1} onChange={setSection1} />
              </div>
            )}

            {/* Section 2 */}
            {showSection1 && !showSection2 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowSection2(true)}
              >
                Add Section 2
              </Button>
            )}
            {showSection2 && (
              <div className="space-y-2">
                <Label>Section 2</Label>
                <CKEditorWrapper value={section2} onChange={setSection2} />
              </div>
            )}

            {/* Section 3 */}
            {showSection2 && !showSection3 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowSection3(true)}
              >
                Add Section 3
              </Button>
            )}
            {showSection3 && (
              <div className="space-y-2">
                <Label>Section 3</Label>
                <CKEditorWrapper value={section3} onChange={setSection3} />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Answers */}
        <Card>
          <CardHeader>
            <CardTitle>Answers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              For multiple possible answers, separate with a forward slash
              (e.g., answer1/answer2).
            </p>
            {Object.entries(answers).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2">
                <Label
                  htmlFor={`ans-${key}`}
                  className="w-12"
                >{`Q ${key}:`}</Label>
                <Input
                  id={`ans-${key}`}
                  value={value}
                  onChange={(e) => handleAnswerChange(key, e.target.value)}
                />
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addAnswerField}>
              Add Answer Field
            </Button>
          </CardContent>
        </Card>

        <Button type="submit" size="lg" className="w-full">
          Save Reading Test
        </Button>
      </form>
    </div>
  );
}
