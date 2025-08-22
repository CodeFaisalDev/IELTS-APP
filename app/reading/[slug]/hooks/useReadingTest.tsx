import { useState, useEffect, useCallback } from "react";
import { ReadingTestData, UserAnswers } from "../types";

export const useReadingTest = (
  test: ReadingTestData | null,
  started: boolean
) => {
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [timeLeft, setTimeLeft] = useState(60 * 60); // 60 minutes
  const [showResultModal, setShowResultModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const finishExamAndShowResults = useCallback(() => {
    setShowResultModal(true);
  }, []);

  const handleFinishExam = useCallback(() => {
    setShowConfirmModal(true);
  }, []);

  const handleConfirmedFinish = useCallback(() => {
    setShowConfirmModal(false);
    setTimeLeft(1); // Set time to 1 to trigger auto-finish logic
  }, []);

  useEffect(() => {
    if (!test || !started) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          finishExamAndShowResults();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [test, started, finishExamAndShowResults]);

  const handleInputChange = (questionId: string, value: string) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleRadioChange = (questionId: string, value: string) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  return {
    userAnswers,
    timeLeft,
    showResultModal,
    setShowResultModal,
    showConfirmModal,
    setShowConfirmModal,
    handlers: {
      handleInputChange,
      handleRadioChange,
      handleFinishExam,
      handleConfirmedFinish,
    },
  };
};
