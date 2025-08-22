"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import CKEditorWrapper from "@/components/custom/CKEditorWrapper";

export default function AddListeningTestPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState(""); // New state for the audio URL
  const [content, setContent] = useState(
    `<h2>Questions 1-6</h2><p>Write <strong>ONE WORD</strong> for each answer.</p><p>Address: 24 {} Road</p><p>Heard about company from: {}</p><h2>Questions 11-12</h2><p>Choose <strong>TWO</strong> letters A-E.</p><p>-[Which TWO facilities at the leisure club have recently been improved?@A. the gym@B. the tracks@C. the indoor pool-]</p><h2>Question 21</h2><p>-(Students entering the design competition have to@A. produce an energy-efficient design.@B. adapt an existing energy-saving appliance.@C. develop a new use for current technology.-)</p>`
  );
  const [answers, setAnswers] = useState<{ [key: string]: string }>({
    "1": "",
    "2": "",
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
    // Updated validation to check for either a file OR a URL
    if (!title || !slug || (!audioFile && !audioUrl) || !content) {
      alert("Please fill all fields, including an audio source.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("slug", slug);
    formData.append("content", content);
    formData.append("answers", formatAnswersForSubmit());

    // Conditionally append audio source
    if (audioFile) {
      formData.append("audio", audioFile);
    } else if (audioUrl) {
      formData.append("audioUrl", audioUrl);
    }

    const res = await fetch("/api/listening", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      alert("Test created successfully!");
      router.push("/admin");
    } else {
      alert("Failed to create test.");
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Add New IELTS Listening Test</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Practice Test 1"
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
            placeholder="e.g., practice-test-1"
          />
        </div>

        {/* --- New Audio Source Section --- */}
        <div className="space-y-4 rounded-md border p-4">
          <h3 className="font-semibold">Audio Source</h3>
          <p className="text-sm text-muted-foreground">
            Upload an audio file OR provide a direct URL.
          </p>
          <div className="space-y-2">
            <Label htmlFor="audio">Upload Audio File (MP3)</Label>
            <Input
              id="audio"
              type="file"
              accept="audio/mp3"
              disabled={!!audioUrl} // Disable if URL is being used
              onChange={(e) =>
                setAudioFile(e.target.files ? e.target.files[0] : null)
              }
            />
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                OR
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="audioUrl">Audio File URL</Label>
            <Input
              id="audioUrl"
              value={audioUrl}
              disabled={!!audioFile} // Disable if a file is uploaded
              onChange={(e) => setAudioUrl(e.target.value)}
              placeholder="e.g., https://example.com/audio.mp3"
            />
          </div>
        </div>
        {/* --- End of New Section --- */}

        <div className="space-y-2">
          <Label>Questions & Content</Label>
          <p className="text-sm text-muted-foreground">
            Use {"{}"} for blanks, -[...] for multiple choice (use @ for
            options), and -(...) for single choice (use O for options).
          </p>
          <CKEditorWrapper value={content} onChange={setContent} />
        </div>

        <div className="space-y-4 rounded-md border p-4">
          <h3 className="font-semibold">Answers</h3>
          <p className="text-sm text-muted-foreground">
            For multiple possible answers, separate with a forward slash (e.g.,
            fish/fishes).
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
        </div>

        <Button type="submit" size="lg">
          Create Test
        </Button>
      </form>
    </div>
  );
}
