"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ListeningResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<any>(null);
  const [slug, setSlug] = useState<string | null>(null);

  useEffect(() => {
    const userAnswers = JSON.parse(localStorage.getItem("userAnswers") || "[]");
    const testSlug = localStorage.getItem("testSlug");

    if (!userAnswers || !testSlug) {
      router.push("/");
      return;
    }

    setSlug(testSlug);

    fetch("/api/listening/result", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: testSlug, userAnswers }),
    })
      .then((res) => res.json())
      .then(setResult);
  }, [router]);

  if (!result) return <div className="p-6 text-center">Loading results...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center text-primary">
        Your Result
      </h1>
      <p className="text-center text-lg font-semibold">
        Score: {result.score} / {result.total}
      </p>

      <div className="space-y-4">
        {result.mistakes.map((mistake: any) => (
          <Card key={mistake.question} className="border-green-300 text-black">
            <CardHeader>
              <CardTitle>Question {mistake.question}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                <span className="font-semibold">Your answer:</span>{" "}
                {mistake.user || "(empty)"}
              </p>
              <p>
                <span className="font-semibold">Correct answer:</span>{" "}
                {mistake.correct}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
