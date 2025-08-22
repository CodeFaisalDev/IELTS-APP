// /app/writing/[slug]/WritingTestPage.tsx

"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  PlayCircle,
  Loader2,
  Eye,
  EyeOff,
  BookOpen,
  Clock,
  Lightbulb,
} from "lucide-react";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
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

import { useWritingTest } from "./hooks/useWritingTest";
import WritingTestUI from "./components/WritingTestUI";
import WritingResultModal from "./components/ResultModal";
import LoadingModal from "./components/LoadingModal";
import { WritingTestData } from "./types";
import { parseWritingTestContent } from "./util/parser";

export default function WritingTestPage({
  params,
}: {
  params: { slug: string };
}) {
  const [test, setTest] = useState<WritingTestData | null>(null);
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const [activeSection, setActiveSection] = useState<"section1" | "section2">(
    "section1"
  );
  const [showAnswers, setShowAnswers] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const fetchTest = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/writing/${params.slug}`);
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
    testCompleted,
    showResultModal,
    setShowResultModal,
    showConfirmModal,
    setShowConfirmModal,
    evaluationResult,
    isLoading,
    handlers,
  } = useWritingTest(test, started);

  const toggleShowAnswers = () => {
    setShowAnswers(!showAnswers);
  };

  const getWordCount = (text: string) => {
    return text.split(/\s+/).filter((word) => word.length > 0).length;
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

  const renderTaskContent = (
    sectionKey: "section1" | "section2",
    taskNumber: number
  ) => {
    const sectionContent = test[sectionKey];
    if (!sectionContent) return null;
    return (
      <ResizablePanelGroup
        direction={isMobile ? "vertical" : "horizontal"}
        className="h-full"
      >
        <ResizablePanel defaultSize={isMobile ? 40 : 45} minSize={20}>
          <div className="h-full overflow-y-auto p-4">
            <Card className="h-fit border-none shadow-sm rounded-lg bg-white dark:bg-gray-800">
              <CardHeader className="p-4 border-b">
                <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  Task {taskNumber}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 text-gray-700 dark:text-gray-300">
                {parseWritingTestContent(sectionContent)}
              </CardContent>
            </Card>
            {testCompleted && test.answers?.[sectionKey] && (
              <Card className="mt-6 shadow-sm">
                <CardHeader className="p-4 flex flex-row items-center justify-between border-b">
                  <CardTitle className="text-lg font-semibold">
                    Sample Answer
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleShowAnswers}
                    className="text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    {showAnswers ? (
                      <>
                        <EyeOff className="w-4 h-4 mr-2" />
                        Hide Answer
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4 mr-2" />
                        Show Answer
                      </>
                    )}
                  </Button>
                </CardHeader>
                {showAnswers && (
                  <CardContent className="p-4">
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md text-sm text-gray-700 dark:text-gray-300">
                      <p className="whitespace-pre-wrap">
                        {test.answers[sectionKey]}
                      </p>
                    </div>
                  </CardContent>
                )}
              </Card>
            )}
          </div>
        </ResizablePanel>
        <ResizableHandle
          withHandle
          className="bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700"
        />
        <ResizablePanel defaultSize={isMobile ? 60 : 55} minSize={30}>
          <div className="h-full p-4 flex flex-col">
            <Card className="flex-1 flex flex-col shadow-sm rounded-lg bg-white dark:bg-gray-800">
              <CardHeader className="p-4 border-b">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg font-semibold">
                    Your Answer
                  </CardTitle>
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    {getWordCount(userAnswers[sectionKey] || "")} words
                  </span>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col p-4">
                <Textarea
                  value={userAnswers[sectionKey] || ""}
                  onChange={(e) =>
                    handlers.handleInputChange(sectionKey, e.target.value)
                  }
                  placeholder={`Write your answer for Task ${taskNumber} here...`}
                  className="flex-1 border-gray-300 dark:border-gray-700 resize-none focus-visible:ring-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-50"
                  disabled={testCompleted}
                />
              </CardContent>
            </Card>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    );
  };

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
                    2 Tasks
                  </span>
                  <p className="text-sm">
                    Two distinct writing tasks to tackle.
                  </p>
                </li>
                <li className="flex flex-col items-center text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
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
        <WritingTestUI
          test={test}
          timeLeft={timeLeft}
          onFinishExam={handlers.handleFinishExam}
        >
          <Tabs
            value={activeSection}
            onValueChange={(value) =>
              setActiveSection(value as "section1" | "section2")
            }
            className="flex flex-col h-full"
          >
            <TabsList className="grid grid-cols-2 sticky top-0 z-20 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-800 shadow-sm">
              <TabsTrigger
                value="section1"
                className="data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-800 data-[state=active]:text-gray-900 dark:data-[state=active]:text-gray-100 transition-colors duration-200"
                disabled={!test.section1}
              >
                Task 1
              </TabsTrigger>
              <TabsTrigger
                value="section2"
                className="data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-800 data-[state=active]:text-gray-900 dark:data-[state=active]:text-gray-100 transition-colors duration-200"
                disabled={!test.section2}
              >
                Task 2
              </TabsTrigger>
            </TabsList>
            <div className="flex-1 overflow-hidden">
              <TabsContent value="section1" className="h-full m-0">
                {renderTaskContent("section1", 1)}
              </TabsContent>
              <TabsContent value="section2" className="h-full m-0">
                {renderTaskContent("section2", 2)}
              </TabsContent>
            </div>
          </Tabs>
        </WritingTestUI>
      )}
      <WritingResultModal
        isOpen={showResultModal}
        onClose={() => setShowResultModal(false)}
        evaluationResult={evaluationResult}
      />
      <LoadingModal isOpen={isLoading} />
    </>
  );
}
