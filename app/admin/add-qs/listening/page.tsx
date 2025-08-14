"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function AdminListeningPage() {
  const [title, setTitle] = useState("");
  const [audio, setAudio] = useState<File | null>(null);
  const [sections, setSections] = useState([
    { start: 1, end: 10, image: null as File | null },
    { start: 11, end: 20, image: null as File | null },
    { start: 21, end: 30, image: null as File | null },
    { start: 31, end: 40, image: null as File | null },
  ]);
  const [answers, setAnswers] = useState<string[]>(Array(40).fill(""));
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    // basic validation
    if (!title)
      return setStatus({ type: "error", message: "Title is required." });
    if (!audio)
      return setStatus({ type: "error", message: "Audio file is required." });
    if (sections.some((s) => !s.image)) {
      return setStatus({
        type: "error",
        message: "All 4 section images are required.",
      });
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("audio", audio);

      sections.forEach((sec, idx) => {
        formData.append(`sectionImage${idx + 1}`, sec.image!);
        formData.append(`sectionStart${idx + 1}`, String(sec.start));
        formData.append(`sectionEnd${idx + 1}`, String(sec.end));
      });

      answers.forEach((ans, idx) => {
        formData.append(`answer${idx + 1}`, ans); // supports "a/b/c" multi-answer
      });

      const res = await fetch("/api/listening", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || "Upload failed");
      }

      setStatus({
        type: "success",
        message: "Listening test uploaded successfully!",
      });
      // reset form
      setTitle("");
      setAudio(null);
      setSections([
        { start: 1, end: 10, image: null },
        { start: 11, end: 20, image: null },
        { start: 21, end: 30, image: null },
        { start: 31, end: 40, image: null },
      ]);
      setAnswers(Array(40).fill(""));
    } catch (e: any) {
      setStatus({
        type: "error",
        message: e.message || "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">Upload IELTS Listening Test</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Test Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Audio */}
        <div className="space-y-2">
          <Label htmlFor="audio">Audio File</Label>
          <Input
            id="audio"
            type="file"
            accept="audio/*"
            onChange={(e) => setAudio(e.target.files?.[0] || null)}
            required
          />
        </div>

        {/* Sections */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Sections</h2>
          {sections.map((sec, idx) => (
            <div key={idx} className="border p-4 rounded-md space-y-4">
              <h3 className="font-bold">Section {idx + 1}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor={`start-${idx}`}>Start Q#</Label>
                  <Input
                    id={`start-${idx}`}
                    type="number"
                    value={sec.start}
                    onChange={(e) => {
                      const s = [...sections];
                      s[idx].start = Number(e.target.value);
                      setSections(s);
                    }}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor={`end-${idx}`}>End Q#</Label>
                  <Input
                    id={`end-${idx}`}
                    type="number"
                    value={sec.end}
                    onChange={(e) => {
                      const s = [...sections];
                      s[idx].end = Number(e.target.value);
                      setSections(s);
                    }}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor={`img-${idx}`}>Section Image</Label>
                  <Input
                    id={`img-${idx}`}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const s = [...sections];
                      s[idx].image = e.target.files?.[0] || null;
                      setSections(s);
                    }}
                    required
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Answers */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Answers</h2>
          <p className="text-sm text-muted-foreground mb-4">
            For multiple correct answers, separate with "/" (e.g.,{" "}
            <i>newspaper/newspapers</i>).
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {answers.map((ans, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <Label className="w-6">{idx + 1}.</Label>
                <Input
                  value={ans}
                  onChange={(e) => {
                    const next = [...answers];
                    next[idx] = e.target.value;
                    setAnswers(next);
                  }}
                  placeholder="Answer"
                  autoComplete="off"
                  spellCheck={false}
                />
              </div>
            ))}
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Uploading..." : "Upload Listening Test"}
        </Button>

        {status && (
          <div
            className={`mt-3 p-2 rounded ${
              status.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {status.message}
          </div>
        )}
      </form>
    </div>
  );
}
