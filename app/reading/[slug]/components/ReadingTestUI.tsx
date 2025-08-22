import { Button } from "@/components/ui/button";
import { ReadingTestData } from "../types";

interface ReadingTestUIProps {
  test: ReadingTestData;
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

export default function ReadingTestUI({
  test,
  timeLeft,
  onFinishExam,
  children,
}: ReadingTestUIProps) {
  return (
    <div className="flex flex-col h-full bg-gray-100 dark:bg-gray-900">
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
        {children}
      </main>

      <footer className="sticky bottom-0 bg-white dark:bg-gray-900 z-10 py-4 border-t border-gray-200 dark:border-gray-700 px-6">
        <div className="flex max-sm:gap-5 max-sm:flex-col items-center justify-between max-w-7xl mx-auto">
          <h1 className="text-xl font-bold truncate text-gray-900 dark:text-gray-100 pr-4">
            {test.title}
          </h1>
          <div className="flex gap-4 sm:gap-10 items-center justify-center mt-4 sm:mt-0">
            <div className="font-mono text-lg font-semibold bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full text-gray-800 dark:text-gray-200">
              {formatTime(timeLeft)}
            </div>
            <Button
              variant="destructive"
              size="lg"
              className="font-semibold"
              onClick={onFinishExam}
            >
              Finish Test
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}
