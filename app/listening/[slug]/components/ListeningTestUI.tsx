"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { ListeningTestUIProps } from "../types";

const ListeningTestUI: React.FC<ListeningTestUIProps> = ({
  test,
  timeLeft,
  onFinishExam,
  children,
  audioRef,
}) => {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="flex flex-col h-full bg-gray-100 dark:bg-gray-900">
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {test.title}
          </h1>
        </header>
        {children}
      </main>

      <footer className="sticky bottom-0 bg-white dark:bg-gray-900 z-10 py-4 border-t border-gray-200 dark:border-gray-700 px-6">
        <div className="flex max-sm:gap-5 max-sm:flex-col items-center justify-between max-w-7xl mx-auto">
          <div className="w-full md:w-1/2 flex items-center justify-center">
            <audio
              ref={audioRef}
              controls
              autoPlay
              src={test.audioUrl}
              className="w-full"
              controlsList="nodownload noplaybackrate"
            />
          </div>
          <div className="flex gap-4 sm:gap-10 justify-center items-center mt-4 sm:mt-0">
            <div className="font-mono text-lg font-semibold bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full text-gray-800 dark:text-gray-200">
              {String(minutes).padStart(2, "0")}:
              {String(seconds).padStart(2, "0")}
            </div>
            <Button
              variant="destructive"
              size="lg"
              className="font-semibold"
              onClick={onFinishExam}
            >
              Finish Exam
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ListeningTestUI;
