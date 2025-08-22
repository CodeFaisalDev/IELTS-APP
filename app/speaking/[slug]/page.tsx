// app/speaking/[slug]/page.tsx
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Mic,
  Send,
  Square,
  Loader2,
  PlayCircle,
  BookOpen,
  Clock,
  Lightbulb,
  AudioLines,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSpeechRecognition } from "./hooks/useSpeechRecognition";
import SpeakingResultModal from "./components/ResultModal";
import LoadingModal from "./components/LoadingModal";
import SpeakingTestUI from "./components/SpeakingTestUI";
import {
  TestData,
  FormattedQuestion,
  TestState,
  QAPair,
  EvaluationResult,
} from "./types";

export default function SpeakingTestPage({
  params,
}: {
  params: { slug: string };
}) {
  const [initialLoading, setInitialLoading] = useState(true);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [testData, setTestData] = useState<TestData | null>(null);
  const [questions, setQuestions] = useState<FormattedQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [testState, setTestState] = useState<TestState>("idle");
  const [qaPairs, setQaPairs] = useState<QAPair[]>([]);
  const [evaluationResult, setEvaluationResult] =
    useState<EvaluationResult | null>(null);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [isHelpMode, setIsHelpMode] = useState(false);

  const {
    text: transcribedText,
    startListening,
    stopListening,
    isListening,
  } = useSpeechRecognition();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Fetch and format test data
    const fetchAndFormatData = async () => {
      setInitialLoading(true);
      try {
        const response = await fetch(`/api/speaking/${params.slug}`);
        if (!response.ok) throw new Error("Failed to fetch test data.");
        const data: TestData = await response.json();
        setTestData(data);

        // --- Data Formatting Logic (unchanged) ---
        const allQuestions: FormattedQuestion[] = [];
        const content = data.content;
        let cueCardIntroIndex = -1;
        content.Introduction.questions.forEach((q) =>
          allQuestions.push({
            ...q,
            part: "Introduction",
            isCueCardIntro: false,
          })
        );
        content.part1.questions.forEach((q) =>
          allQuestions.push({ ...q, part: "Part 1", isCueCardIntro: false })
        );
        content.part2.questions.forEach((q) => {
          const isIntro = q.text.includes("I'm going to give you a topic");
          if (isIntro) cueCardIntroIndex = allQuestions.length;
          allQuestions.push({ ...q, part: "Part 2", isCueCardIntro: isIntro });
        });
        if (cueCardIntroIndex !== -1 && allQuestions[cueCardIntroIndex + 1]) {
          allQuestions[cueCardIntroIndex + 1].text = data.content.cueCard;
        }
        content.part3.questions.forEach((q) =>
          allQuestions.push({ ...q, part: "Part 3", isCueCardIntro: false })
        );
        allQuestions.push({
          text: content.closing,
          sampleAnswer: "",
          part: "Closing",
          isCueCardIntro: false,
        });
        // --- End Data Formatting ---

        setQuestions(allQuestions);
      } catch (error) {
        console.error(error);
        setTestData(null);
      } finally {
        setInitialLoading(false);
      }
    };
    fetchAndFormatData();
  }, [params.slug]);

  const currentQuestion = questions[currentIndex];

  const narrateQuestion = useCallback(
    async (questionText: string) => {
      if (questionText === testData?.content.cueCard) {
        setTestState("preparing");
        return;
      }
      try {
        setTestState("narrating");
        const response = await fetch("/api/speaking/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: questionText }),
        });
        if (!response.ok) throw new Error("Failed to fetch TTS audio.");
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        if (audioRef.current) {
          audioRef.current.src = audioUrl;
          audioRef.current.play();
        }
      } catch (error) {
        console.error("Narration Error:", error);
        setTestState("processing");
      }
    },
    [testData]
  );

  useEffect(() => {
    const audio = audioRef.current;
    const handleAudioEnd = () => {
      if (currentQuestion?.part === "Closing") {
        setTestState("finished");
        return;
      }
      if (currentQuestion?.isCueCardIntro) {
        const nextIndex = currentIndex + 1;
        setCurrentIndex(nextIndex);
        narrateQuestion(questions[nextIndex].text);
      } else {
        startListening();
        setTestState("listening");
      }
    };
    if (audio) {
      audio.addEventListener("ended", handleAudioEnd);
      return () => audio.removeEventListener("ended", handleAudioEnd);
    }
  }, [
    currentQuestion,
    startListening,
    currentIndex,
    questions,
    narrateQuestion,
  ]);

  const handleStartTest = () => {
    if (questions.length > 0) {
      narrateQuestion(questions[0].text);
    }
  };

  const handleNextQuestion = () => {
    if (isListening) stopListening();
    setQaPairs((prev) => [
      ...prev,
      { question: currentQuestion.text, answer: transcribedText },
    ]);
    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex);
    narrateQuestion(questions[nextIndex].text);
  };

  const handleStartSpeakingPart2 = () => {
    startListening();
    setTestState("listening");
  };

  const handleFinishExam = async () => {
    setIsEvaluating(true);
    try {
      const response = await fetch("/api/speaking/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qaPairs }),
      });
      if (!response.ok) throw new Error("Evaluation failed.");
      const result: EvaluationResult = await response.json();
      setEvaluationResult(result);
      setIsResultModalOpen(true);
    } catch (error) {
      console.error("Evaluation Error:", error);
      alert("There was an error evaluating your test.");
    } finally {
      setIsEvaluating(false);
    }
  };

  // --- Render States ---
  if (initialLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
        <span className="mt-4 text-lg font-medium">Loading Test...</span>
      </div>
    );
  }

  if (!testData) {
    return (
      <div className="flex items-center justify-center h-screen text-center p-10 text-red-500 bg-gray-100 dark:bg-gray-900">
        <p className="text-xl font-semibold">Error: Could not load the test.</p>
      </div>
    );
  }

  const renderActiveContent = () => {
    switch (testState) {
      case "narrating":
        return (
          <p className="text-gray-500 dark:text-gray-400 animate-pulse text-center">
            <AudioLines className="h-24 w-24 mx-auto text-blue-500 animate-pulse" />
            <p className="mt-4 text-gray-500 dark:text-gray-400">
              Examiner is speaking...
            </p>
          </p>
        );
      case "preparing":
        return (
          <Card className="w-full bg-gray-50 dark:bg-gray-800/50">
            <CardHeader>
              <CardTitle>Part 2: Cue Card</CardTitle>
              <CardDescription>
                You have one minute to prepare your answer.
              </CardDescription>
            </CardHeader>
            <CardContent className="whitespace-pre-wrap text-sm">
              {testData.content.cueCard}
            </CardContent>
          </Card>
        );
      case "listening":
        return (
          <div className="text-center">
            <Mic className="h-24 w-24 mx-auto text-red-500 animate-pulse" />
            <p className="mt-4 text-gray-500 dark:text-gray-400">
              You can speak now
            </p>
          </div>
        );
      case "finished":
        return (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <h2 className="text-2xl font-semibold">Test Complete</h2>
            <p className="text-gray-500 dark:text-gray-400 my-4 px-4">
              You have completed the speaking test. Click the button below to
              get your results.
            </p>
            <Button size="lg" onClick={handleFinishExam}>
              Evaluate My Test
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {testState === "idle" ? (
        <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100 dark:bg-gray-900">
          <Card className="max-w-3xl w-full shadow-xl bg-white dark:bg-gray-800 border-none">
            <CardHeader className="p-8 text-center border-b border-gray-200 dark:border-gray-700">
              <CardTitle className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {testData.title}
              </CardTitle>
              <p className="text-md text-gray-500 dark:text-gray-400 mt-2">
                Your pathway to a better band score.
              </p>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <ul className="grid md:grid-cols-3 gap-6 text-gray-600 dark:text-gray-400">
                {/* Test Info Items */}
                <li className="flex flex-col items-center text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                  <Clock className="w-8 h-8 text-blue-500 mb-2" />
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    ~15 Minutes
                  </span>
                  <p className="text-sm">Average test duration.</p>
                </li>
                <li className="flex flex-col items-center text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                  <BookOpen className="w-8 h-8 text-green-500 mb-2" />
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    3 Parts
                  </span>
                  <p className="text-sm">Covering all sections of the test.</p>
                </li>
                <li className="flex flex-col items-center text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                  <Lightbulb className="w-8 h-8 text-yellow-500 mb-2" />
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    AI Powered
                  </span>
                  <p className="text-sm">Receive instant, detailed feedback.</p>
                </li>
              </ul>
              <div className="flex justify-center pt-4">
                <Button
                  size="lg"
                  className="px-8 py-6 text-lg font-semibold"
                  onClick={handleStartTest}
                >
                  <PlayCircle className="w-6 h-6 mr-2" />
                  Start Exam
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <SpeakingTestUI
          title={testData.title}
          isHelpMode={isHelpMode}
          onHelpModeChange={setIsHelpMode}
        >
          <div className="flex flex-col justify-between h-full">
            {/* Top Section: Help Mode Content */}
            <div className="w-full">
              {isHelpMode && testState !== "preparing" && currentQuestion && (
                <Card className="w-full mb-4 bg-gray-100 dark:bg-gray-900/50">
                  <CardContent className="p-4 text-sm">
                    <p className="font-semibold mb-2">{currentQuestion.text}</p>
                    {currentQuestion.sampleAnswer && (
                      <div className="mt-3 p-3 bg-gray-200 dark:bg-gray-800 rounded-md">
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">
                          Sample Answer:
                        </p>
                        <p className="italic">{currentQuestion.sampleAnswer}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
            {/* Middle Section: Main Content */}
            <div className="flex-grow flex items-center justify-center w-full">
              {renderActiveContent()}
            </div>
            {/* Bottom Section: Transcript & Action Button */}
            <div className="w-full pt-4">
              {isHelpMode && transcribedText && (
                <div className="p-3 mb-4 w-full border rounded-md bg-gray-100 dark:bg-gray-800 text-sm">
                  <p className="text-gray-500 dark:text-gray-400 italic">
                    {transcribedText}
                  </p>
                </div>
              )}
              <div className="flex items-center justify-center">
                {testState === "preparing" ? (
                  <Button size="lg" onClick={handleStartSpeakingPart2}>
                    I'm Ready to Speak
                  </Button>
                ) : (
                  testState !== "finished" && (
                    <Button
                      size="lg"
                      onClick={handleNextQuestion}
                      disabled={testState === "narrating"}
                    >
                      {isListening ? (
                        <>
                          <Square className="mr-2 h-4 w-4" /> Stop & Next
                        </>
                      ) : (
                        <>
                          Next Question <Send className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  )
                )}
              </div>
            </div>
          </div>
        </SpeakingTestUI>
      )}

      <audio ref={audioRef} className="hidden" />
      <LoadingModal isOpen={isEvaluating} />
      <SpeakingResultModal
        isOpen={isResultModalOpen}
        onClose={() => setIsResultModalOpen(false)}
        evaluationResult={evaluationResult}
      />
    </>
  );
}
