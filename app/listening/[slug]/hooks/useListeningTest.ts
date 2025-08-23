import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ListeningTestData } from "../types";

type UserAnswers = Record<string, string | string[]>;

export const useListeningTest = (
  test: ListeningTestData | null,
  started: boolean,
  audioRef: React.RefObject<HTMLAudioElement | null>
) => {
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [organizedAnswers, setOrganizedAnswers] = useState<UserAnswers>({});
  const [timeLeft, setTimeLeft] = useState(40 * 60); // 40 minutes
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const tenMinuteWarningShown = useRef(false);
  const router = useRouter();

  // Function to stop audio
  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [audioRef]);

  // Function to organize answers and show result modal
  const finishExamAndShowResults = useCallback(() => {
    const organized: UserAnswers = {};
    Object.entries(userAnswers).forEach(([key, value]) => {
      if (key.startsWith("mc-")) {
        const answers = value as string[];
        const questionNumbers = key.replace("mc-", "").split(",");
        questionNumbers.forEach((qNum, index) => {
          if (answers[index]) {
            organized[`Q${qNum.trim()}`] = answers[index];
          }
        });
      } else if (key.startsWith("sc-")) {
        const questionNumber = key.replace("sc-", "");
        organized[`Q${questionNumber}`] = value as string;
      } else {
        organized[key] = value;
      }
    });
    setOrganizedAnswers(organized);
    stopAudio();
    setShowResultModal(true);
  }, [userAnswers, stopAudio]);

  // Handle finish exam button click (shows confirmation modal)
  const handleFinishExam = useCallback(() => {
    setShowConfirmModal(true);
  }, []);

  // Handle confirmed finish (from confirmation modal)
  const handleConfirmedFinish = useCallback(() => {
    setShowConfirmModal(false);
    finishExamAndShowResults();
  }, [finishExamAndShowResults]);

  // Handle auto finish (when timer reaches 0)
  const handleAutoFinish = useCallback(() => {
    finishExamAndShowResults();
  }, [finishExamAndShowResults]);

  // Timer effect — only runs after `started`
  useEffect(() => {
    if (!test || !started) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 1;

        if (next <= 10 * 60 && !tenMinuteWarningShown.current) {
          setShowWarningModal(true);
          tenMinuteWarningShown.current = true;
        }

        if (next <= 0) {
          clearInterval(timer);
          handleAutoFinish(); // Auto finish without confirmation
          return 0;
        }

        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [test, started, handleAutoFinish]);

  const handleInputChange = (questionId: string, value: string) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleCheckboxChange = (
    qid: string,
    option: string,
    checked: boolean,
    maxSelections: number
  ) => {
    setUserAnswers((prev) => {
      const current = (prev[qid] as string[]) || [];
      let next;
      if (checked) {
        if (current.length >= maxSelections) return prev;
        next = [...current, option].sort();
      } else {
        next = current.filter((v) => v !== option);
      }
      return { ...prev, [qid]: next };
    });
  };

  const handleRadioChange = (qid: string, value: string) => {
    setUserAnswers((prev) => ({ ...prev, [qid]: value }));
  };

  const handleStartAnother = () => {
    setShowResultModal(false);
    router.push("/");
  };

  return {
    userAnswers,
    timeLeft,
    showWarningModal,
    setShowWarningModal,
    showResultModal,
    setShowResultModal,
    showConfirmModal,
    setShowConfirmModal,
    organizedAnswers,
    handlers: {
      handleInputChange,
      handleCheckboxChange,
      handleRadioChange,
      handleFinishExam,
      handleConfirmedFinish,
      handleStartAnother,
    },
  };
};
