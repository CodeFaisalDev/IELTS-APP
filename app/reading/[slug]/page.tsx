"use client";

import { useEffect, useState, useMemo, use } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlayCircle, Loader2, BookOpen, Clock, Users } from "lucide-react";
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

import { useReadingTest } from "./hooks/useReadingTest";
import { parseReadingTestContent } from "./util/parser";
import ResultModal from "./components/ResultModal";
import ReadingTestUI from "./components/ReadingTestUI";
import { ReadingTestData } from "./types";

export default function ReadingTestPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = use(props.params);
  const [test, setTest] = useState<ReadingTestData | null>(null);
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const [activeSection, setActiveSection] = useState<
    "section1" | "section2" | "section3"
  >("section1");

  useEffect(() => {
    const fetchTest = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/reading/${params.slug}`);
        if (res.ok) {
          setTest(await res.json());
        } else {
          setTest(null);
        }
      } catch (err) {
        console.error("Failed to fetch test:", err);
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
    showResultModal,
    setShowResultModal,
    showConfirmModal,
    setShowConfirmModal,
    handlers,
  } = useReadingTest(test, started);

  const parsedContent = useMemo(() => {
    if (!test) return { section1: null, section2: null, section3: null };
    return {
      section1: parseReadingTestContent(test.section1, userAnswers, handlers),
      section2: parseReadingTestContent(test.section2, userAnswers, handlers),
      section3: parseReadingTestContent(test.section3, userAnswers, handlers),
    };
  }, [test, userAnswers, handlers]);

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
        <p className="text-xl font-semibold">Error: Could not load the test.</p>
      </div>
    );
  }

  return (
    <>
      <AlertDialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <AlertDialogContent className="bg-white text-black dark:bg-gray-900 dark:text-gray-100">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will end the test and submit your answers. You cannot
              undo this.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handlers.handleConfirmedFinish}>
              Yes, Finish Test
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ResultModal
        isOpen={showResultModal}
        // onClose={() => setShowResultModal(false)}
        userAnswers={userAnswers}
        backendAnswers={test.answers || {}}
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
                    60 Minutes
                  </span>
                  <p className="text-sm">Total time to complete the test.</p>
                </li>
                <li className="flex flex-col items-center text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <BookOpen className="w-8 h-8 text-green-500 mb-2" />
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    3 Sections
                  </span>
                  <p className="text-sm">Passages increase in difficulty.</p>
                </li>
                <li className="flex flex-col items-center text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <Users className="w-8 h-8 text-yellow-500 mb-2" />
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    40 Questions
                  </span>
                  <p className="text-sm">Manage your time carefully.</p>
                </li>
              </ul>
              <div className="flex justify-center pt-4">
                <Button
                  size="lg"
                  className="px-8 py-6 text-lg font-semibold"
                  onClick={() => setStarted(true)}
                >
                  <PlayCircle className="w-6 h-6 mr-2" />
                  Start Exam
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <ReadingTestUI
          test={test}
          timeLeft={timeLeft}
          onFinishExam={handlers.handleFinishExam}
        >
          <Tabs
            value={activeSection}
            onValueChange={(value) => setActiveSection(value as any)}
            className="flex flex-col h-full"
          >
            <TabsList className="grid grid-cols-3 sticky top-0 z-20 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm rounded-none">
              <TabsTrigger
                value="section1"
                className="data-[state=active]:bg-gray-200 dark:data-[state=active]:bg-gray-700 data-[state=active]:text-gray-900 dark:data-[state=active]:text-gray-100"
              >
                Passage 1
              </TabsTrigger>
              <TabsTrigger
                value="section2"
                className="data-[state=active]:bg-gray-200 dark:data-[state=active]:bg-gray-700 data-[state=active]:text-gray-900 dark:data-[state=active]:text-gray-100"
              >
                Passage 2
              </TabsTrigger>
              <TabsTrigger
                value="section3"
                className="data-[state=active]:bg-gray-200 dark:data-[state=active]:bg-gray-700 data-[state=active]:text-gray-900 dark:data-[state=active]:text-gray-100"
              >
                Passage 3
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto p-4 max-w-none">
              <TabsContent value="section1">
                {parsedContent.section1}
              </TabsContent>
              <TabsContent value="section2">
                {parsedContent.section2}
              </TabsContent>
              <TabsContent value="section3">
                {parsedContent.section3}
              </TabsContent>
            </div>
          </Tabs>
        </ReadingTestUI>
      )}
    </>
  );
}
