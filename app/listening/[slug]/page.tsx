"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import ResultsModal from "@/components/custom/ResultsModal";

export default function ListeningPage() {
  const params = useParams();
  const router = useRouter();

  const [test, setTest] = useState<any>(null);
  const [answers, setAnswers] = useState<string[]>([]);
  const [countdown, setCountdown] = useState(5);
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(40 * 60);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [isResultsModalOpen, setIsResultsModalOpen] = useState(false);
  const [results, setResults] = useState<any>(null);

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (params.slug) {
      console.log("Attempting to fetch data for slug:", params.slug);
      fetch(`/api/listening/${params.slug}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          console.log("Successfully fetched data:", data);
          setTest(data);
          setAnswers(Array(data.answers.length).fill(""));
        })
        .catch((error) => {
          console.error("Fetch failed:", error);
        });
    }
  }, [params.slug]);

  useEffect(() => {
    if (countdown <= 0) {
      setIsTestStarted(true);
      audioRef.current?.play();
      return;
    }
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  useEffect(() => {
    if (!isTestStarted || timeLeft <= 0) return;
    if (timeLeft === 10 * 60) setIsWarningModalOpen(true);
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, isTestStarted]);

  const handleAnswerChange = (index: number, value: string) => {
    const next = [...answers];
    next[index] = value;
    setAnswers(next);
  };

  const handleFinishTest = () => {
    if (!test) return;

    let correctCount = 0;
    const feedback = test.answers.map(
      (correctAnswers: string[], index: number) => {
        const userAnswer = answers[index] ? answers[index].trim() : "";
        const isCorrect = correctAnswers.some(
          (ans) => ans.trim().toLowerCase() === userAnswer.toLowerCase()
        );
        if (isCorrect) {
          correctCount++;
        }
        return {
          questionNumber: index + 1,
          userAnswer: userAnswer,
          correctAnswers: correctAnswers,
          isCorrect: isCorrect,
        };
      }
    );

    const bandScore = calculateIELTSBand(correctCount);

    setResults({
      totalQuestions: test.answers.length,
      correctCount: correctCount,
      bandScore: bandScore,
      feedback: feedback,
    });
    setIsResultsModalOpen(true);
  };

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

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  if (!test || !isTestStarted) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background">
        {isTestStarted ? null : (
          <>
            <p className="text-4xl font-bold text-primary">
              IELTS Listening Test
            </p>
            <p className="mt-4 text-2xl text-muted-foreground">
              The test will begin in
            </p>
            <p className="mt-8 text-6xl font-bold text-destructive animate-ping">
              {countdown}
            </p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-8 pb-40">
      <h1 className="text-3xl font-bold text-center text-primary">
        {test.title}
      </h1>

      {test.sections.map((section: any, secIdx: number) => {
        return (
          <div
            key={secIdx}
            className="p-4 sm:p-6 border border-slate-400 rounded-lg shadow-sm bg-card bg-white text-black"
          >
            <h2 className="text-2xl font-semibold mb-2">{section.title}</h2>
            <p className="text-sm text-muted-foreground italic mb-4">
              Example: Name: Andrea Brown
            </p>
            <div className="lg:flex lg:gap-8">
              <div className="lg:w-2/3">
                <Image
                  src={section.image}
                  alt={`${section.title} Questions`}
                  width={800}
                  height={1130}
                  className="w-full h-auto rounded-md border"
                  priority={secIdx === 0}
                />
              </div>
              <div className="lg:w-1/3">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-2 gap-x-4 gap-y-5 mt-6 lg:mt-0">
                  {Array.from(
                    { length: section.end - section.start + 1 },
                    (_, i) => section.start + i
                  ).map((qNum) => {
                    const answerIndex = qNum - 1;
                    return (
                      <div key={qNum} className="flex items-center gap-2">
                        <Label
                          htmlFor={`ans-${qNum}`}
                          className="w-8 text-right text-muted-foreground "
                        >
                          {qNum}.
                        </Label>
                        <Input
                          className="border-slate-400 "
                          autoComplete="off"
                          spellCheck={false}
                          id={`ans-${qNum}`}
                          value={answers[answerIndex]}
                          onChange={(e) =>
                            handleAnswerChange(answerIndex, e.target.value)
                          }
                          placeholder="Answer"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      <div className="fixed bottom-0 left-0 w-full bg-black border-t shadow-lg">
        <div className="container mx-auto p-3 flex flex-col md:flex-row items-center justify-between gap-4">
          <audio
            controls
            autoPlay
            ref={audioRef}
            className="w-full md:w-1/2 lg:w-1/3"
          >
            <source src={test.audio} type="audio/mpeg" />
          </audio>
          <div className="flex items-center gap-4">
            <span className="text-lg font-mono font-semibold p-2 rounded-md bg-muted">
              Time Left: {formatTime(timeLeft)}
            </span>
            <Button
              className="bg-white text-black hover:bg-slate-300"
              size="lg"
              onClick={handleFinishTest}
            >
              End Listening Test
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={isWarningModalOpen} onOpenChange={setIsWarningModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl">10 Minutes Remaining</DialogTitle>
            <DialogDescription className="pt-2">
              You have 10 minutes left to recheck and transfer your answers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setIsWarningModalOpen(false)}>
              Continue Test
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ResultsModal
        isOpen={isResultsModalOpen}
        onOpenChange={setIsResultsModalOpen}
        results={results}
      />
    </div>
  );
}
