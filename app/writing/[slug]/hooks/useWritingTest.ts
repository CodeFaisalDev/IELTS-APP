// /app/writing/[slug]/hooks/useWritingTest.ts

import { useState, useEffect, useCallback } from "react";
import { WritingTestData, UserAnswers } from "../types";

// A utility function to strip HTML tags and get clean text
const stripHtml = (htmlString: string) => {
  if (!htmlString) return "";
  if (typeof window === "undefined") {
    return htmlString.replace(/<[^>]*>?/gm, "");
  }
  const doc = new DOMParser().parseFromString(htmlString, "text/html");
  return doc.body.textContent || "";
};

export const useWritingTest = (
  test: WritingTestData | null,
  started: boolean
) => {
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [timeLeft, setTimeLeft] = useState(60 * 60); // 60 minutes
  const [showResultModal, setShowResultModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false); //  NEW: State for loading

  const finishExamAndShowResults = useCallback(() => {
    setTestCompleted(true);
    if (test) {
      handleConfirmedFinish();
    }
  }, [test]);

  const handleFinishExam = useCallback(() => {
    setShowConfirmModal(true);
  }, []);

  const handleConfirmedFinish = useCallback(async () => {
    setShowConfirmModal(false);
    setTestCompleted(true);
    setTimeLeft(0);

    if (!test || !test.answers) {
      console.error("Test data or answers are missing. Cannot submit.");
      return;
    }

    // 👈 Set loading state to true immediately
    setIsLoading(true);

    const taskQuestion1 = stripHtml(test.section1 || "");
    const taskQuestion2 = stripHtml(test.section2 || "");

    const apiData = {
      taskQuestion: `Part 1:\n${taskQuestion1}\n\nPart 2:\n${taskQuestion2}`,
      backendSampleEssay: `Part 1:\n${
        test.answers.section1 || ""
      }\n\nPart 2:\n${test.answers.section2 || ""}`,
      userEssay: `Part 1:\n${userAnswers.section1 || ""}\n\nPart 2:\n${
        userAnswers.section2 || ""
      }`,
    };

    try {
      const response = await fetch("/api/writing/evaluate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("✅ Evaluation Result:", result);
      setEvaluationResult(result);
    } catch (error) {
      console.error(" Failed to send data to API:", error);
    } finally {
      // 👈 Set loading to false and show result modal when API call is complete
      setIsLoading(false);
      setShowResultModal(true);
    }
  }, [test, userAnswers]);

  useEffect(() => {
    if (!test || !started || testCompleted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleConfirmedFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [test, started, testCompleted, handleConfirmedFinish]);

  const handleInputChange = (section: string, value: string) => {
    if (!testCompleted) {
      setUserAnswers((prev) => ({ ...prev, [section]: value }));
    }
  };

  return {
    userAnswers,
    timeLeft,
    testCompleted,
    showResultModal,
    setShowResultModal,
    showConfirmModal,
    setShowConfirmModal,
    evaluationResult,
    isLoading, //  EXPOSE: The new isLoading state
    handlers: {
      handleInputChange,
      handleFinishExam,
      handleConfirmedFinish,
    },
  };
};
