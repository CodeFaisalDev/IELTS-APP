"use client";

import { useEffect, useState, useMemo, useRef, use } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayCircle, Loader2, Clock, BookOpen, Volume2 } from "lucide-react";

import { useListeningTest } from "./hooks/useListeningTest";
import { parseTestContent } from "./util/parser";
import ResultModal from "./components/ResultModal";
import ListeningTestUI from "./components/ListeningTestUI";
import { ListeningTestData } from "./types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Updated props interface to match Next.js 15 expectations
interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function ListeningTestPage(props: PageProps) {
  const [test, setTest] = useState<ListeningTestData | null>(null);
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Use the `use` hook to await the params Promise
  const params = use(props.params);

  useEffect(() => {
    const fetchTest = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/listening/${params.slug}`);
        if (res.ok) setTest(await res.json());
        else setTest(null);
      } catch (err) {
        console.error(err);
        setTest(null);
      } finally {
        setLoading(false);
      }
    };
    fetchTest();
  }, [params.slug]);

  const {
    userAnswers,
    timeLeft,
    showWarningModal,
    setShowWarningModal,
    showResultModal,
    setShowResultModal,
    showConfirmModal,
    setShowConfirmModal,
    organizedAnswers,
    handlers,
  } = useListeningTest(test, started, audioRef);

  const parsedContent = useMemo(
    () => parseTestContent(test?.content ?? "", userAnswers, handlers),
    [test?.content, userAnswers, handlers]
  );

  const handleStart = () => {
    setStarted(true);
    audioRef.current?.play().catch((err) => console.warn("Play failed:", err));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
        <span className="mt-4 text-lg font-medium">Loading Test...</span>
      </div>
    );
  }
  if (!test) {
    return (
      <div className="flex items-center justify-center h-screen text-center p-10 text-red-500 bg-gray-100 dark:bg-gray-900">
        <p className="text-xl font-semibold">
          Error: Could not load the test. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Time warning modal */}
      <AlertDialog open={showWarningModal} onOpenChange={setShowWarningModal}>
        <AlertDialogContent className="bg-white text-black dark:bg-gray-900 dark:text-gray-100">
          <AlertDialogHeader>
            <AlertDialogTitle>Time Reminder</AlertDialogTitle>
            <AlertDialogDescription>
              You have 10 minutes left to complete the test.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Confirmation modal for manual finish */}
      <AlertDialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <AlertDialogContent className="bg-white text-black dark:bg-gray-900 dark:text-gray-100">
          <AlertDialogHeader>
            <AlertDialogTitle>Finish Exam</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to finish the exam and see the results? Once
              you click &ldquo;Yes&rdquo;, you cannot go back to the test.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handlers.handleConfirmedFinish}>
              Yes, Finish Exam
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Result modal */}
      <ResultModal
        isOpen={showResultModal}
        onClose={() => setShowResultModal(false)}
        backendAnswers={test.answers || {}}
        userAnswers={organizedAnswers}
        onStartAnother={handlers.handleStartAnother}
      />

      {!started ? (
        <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100 dark:bg-gray-900">
          <Card className="max-w-3xl w-full shadow-xl bg-white dark:bg-gray-800 border-none">
            <CardHeader className="p-8 text-center border-b border-gray-200 dark:border-gray-700">
              <CardTitle className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {test.title}
              </CardTitle>
              <p className="text-md text-gray-500 dark:text-gray-400 mt-2">
                Your pathway to a better band score.
              </p>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <ul className="grid md:grid-cols-3 gap-6 text-gray-600 dark:text-gray-400">
                <li className="flex flex-col items-center text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <Clock className="w-8 h-8 text-blue-500 mb-2" />
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    40 Minutes
                  </span>
                  <p className="text-sm">Total time to complete the test.</p>
                </li>
                <li className="flex flex-col items-center text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <BookOpen className="w-8 h-8 text-green-500 mb-2" />
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    1 Recording
                  </span>
                  <p className="text-sm">You will hear the audio only once.</p>
                </li>
                <li className="flex flex-col items-center text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <Volume2 className="w-8 h-8 text-yellow-500 mb-2" />
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    10 Minutes
                  </span>
                  <p className="text-sm">
                    Additional time for checking answers.
                  </p>
                </li>
              </ul>
              <div className="flex justify-center pt-4">
                <Button
                  size="lg"
                  className="px-8 py-6 text-lg font-semibold"
                  onClick={handleStart}
                >
                  <PlayCircle className="w-6 h-6 mr-2" />
                  Start Exam
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <ListeningTestUI
          test={test}
          audioRef={audioRef}
          timeLeft={timeLeft}
          onFinishExam={handlers.handleFinishExam}
        >
          {parsedContent}
        </ListeningTestUI>
      )}
    </>
  );
}
