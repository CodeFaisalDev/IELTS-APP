export type UserAnswers = Record<string, string>;

export interface ReadingTestData {
  id: string;
  title: string;
  slug: string;
  section1: string;
  section2: string;
  section3: string;
  answers: Record<string, string | string[]>;
  createdAt: string;
  updatedAt: string;
}

export interface Handlers {
  handleInputChange: (qid: string, value: string) => void;
  handleRadioChange: (qid: string, value: string) => void;
}
