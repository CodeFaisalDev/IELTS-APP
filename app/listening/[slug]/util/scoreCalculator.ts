export const getBandScore = (correct: number, total: number): number => {
  if (total !== 40) {
    const scaledCorrect = (correct / total) * 40;
    return getBandScore(Math.round(scaledCorrect), 40);
  }

  if (correct >= 39) return 9.0;
  if (correct >= 37) return 8.5;
  if (correct >= 35) return 8.0;
  if (correct >= 32) return 7.5;
  if (correct >= 30) return 7.0;
  if (correct >= 26) return 6.5;
  if (correct >= 23) return 6.0;
  if (correct >= 18) return 5.5;
  if (correct >= 16) return 5.0;
  if (correct >= 13) return 4.5;
  if (correct >= 11) return 4.0;
  if (correct >= 8) return 3.5;
  if (correct >= 6) return 3.0;
  if (correct >= 4) return 2.5;
  if (correct >= 3) return 2.0;
  if (correct >= 2) return 1.5;
  if (correct >= 1) return 1.0;
  return 0;
};

export const getBandScoreColor = (score: number): string => {
  if (score >= 8.0) return "text-green-600";
  if (score >= 6.5) return "text-blue-600";
  if (score >= 5.5) return "text-yellow-600";
  return "text-red-600";
};

export const getBandScoreBackground = (score: number): string => {
  if (score >= 8.0) return "bg-green-100 dark:bg-green-900/20";
  if (score >= 6.5) return "bg-blue-100 dark:bg-blue-900/20";
  if (score >= 5.5) return "bg-yellow-100 dark:bg-yellow-900/20";
  return "bg-red-100 dark:bg-red-900/20";
};
