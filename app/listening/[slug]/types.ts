import React from "react";

export interface ListeningTestData {
  id: string;
  title: string;
  audioUrl: string;
  content: string;
  answers: Record<string, string | string[]>;
}

export interface QuestionResult {
  questionId: string;
  userAnswer: string | string[];
  correctAnswer: string | string[];
  isCorrect: boolean;
}

export interface Handlers {
  handleInputChange: (questionId: string, value: string) => void;
  handleCheckboxChange: (
    qid: string,
    option: string,
    checked: boolean,
    maxSelections: number
  ) => void;
  handleRadioChange: (qid: string, value: string) => void;
  handleFinishExam: () => void;
  handleConfirmedFinish: () => void;
  handleStartAnother: () => void;
}

export interface ResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  backendAnswers: Record<string, string | string[]>;
  userAnswers: Record<string, string | string[]>;
  onStartAnother: () => void;
}

export interface ListeningTestUIProps {
  test: ListeningTestData;
  timeLeft: number;
  onFinishExam: () => void;
  children: React.ReactNode;
  audioRef: React.RefObject<HTMLAudioElement | null>;
}
