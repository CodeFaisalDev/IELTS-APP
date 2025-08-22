// /app/writing/[slug]/components/WritingTestUI.tsx

import { Button } from "@/components/ui/button";
import { WritingTestData } from "../types";

interface WritingTestUIProps {
  test: WritingTestData;
  timeLeft: number;
  onFinishExam: () => void;
  children: React.ReactNode;
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};

export default function WritingTestUI({
  test,
  timeLeft,
  onFinishExam,
  children,
}: WritingTestUIProps) {
  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
      {/* Main content area */}
      <main className="flex-1 overflow-hidden">{children}</main>

      {/* Footer as the sticky control bar */}
      <footer className="sticky bottom-0 bg-white dark:bg-gray-900 z-10 py-4 border-t border-gray-200 dark:border-gray-700 px-6">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <h1 className="text-xl md:text-2xl font-bold truncate pr-4 text-gray-900 dark:text-gray-100">
            {test.title}
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="font-mono text-lg font-semibold bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full text-gray-800 dark:text-gray-200">
                {formatTime(timeLeft)}
              </span>
            </div>
            <Button
              variant="destructive"
              onClick={onFinishExam}
              className="font-semibold"
            >
              Finish Test
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}
