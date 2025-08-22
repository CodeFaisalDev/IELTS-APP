// Create this file at /writing/types.ts or in your types folder

export type UserAnswers = Record<string, string>;

export interface WritingTestData {
  id: string;
  title: string;
  slug: string;
  section1: string | null;
  section2: string | null;
  answers: Record<string, string> | null;
  createdAt: string;
  updatedAt: string;
}

export interface Handlers {
  handleInputChange: (section: string, value: string) => void;
  handleFinishExam: () => void;
  handleConfirmedFinish: () => void;
}
