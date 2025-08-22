"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookOpen, Layers, Zap, GraduationCap } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import FullExamSelectorModal from "@/components/custom/FullExamSelectorModal";

export default function HomePage() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Hero Section */}
        <section className="text-center space-y-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
            IELTS Practice App
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            AI-powered IELTS preparation tailored for{" "}
            <span className="font-semibold text-primary">
              Bangladeshi students
            </span>{" "}
            — practice Listening, Reading, Writing, and Speaking with real exam
            questions and instant feedback.
          </p>
        </section>

        {/* Options Section */}
        <section className="grid sm:grid-cols-2 gap-6 lg:gap-8">
          <Link href="/one-module" className="block">
            <Card className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white dark:bg-gray-800 border-none">
              <CardHeader className="flex flex-col items-center space-y-5 py-10">
                <div className="p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <BookOpen className="h-12 w-12 text-primary" />
                </div>
                <CardTitle className="text-lg sm:text-xl">
                  Practice One Module
                </CardTitle>
                <CardDescription className="text-center text-sm sm:text-base text-gray-500 dark:text-gray-400">
                  Focus on Listening, Reading, Writing, or Speaking
                  individually.
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          {/* Full Exam Button */}
          <button
            onClick={() => setModalOpen(true)}
            className="w-full block text-left"
          >
            <Card className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white dark:bg-gray-800 border-none">
              <CardHeader className="flex flex-col items-center space-y-5 py-10">
                <div className="p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Layers className="h-12 w-12 text-primary" />
                </div>
                <CardTitle className="text-lg sm:text-xl">
                  Practice Full Exam
                </CardTitle>
                <CardDescription className="text-center text-sm sm:text-base text-gray-500 dark:text-gray-400">
                  Simulate a real IELTS exam covering all modules in sequence.
                </CardDescription>
              </CardHeader>
            </Card>
          </button>
        </section>

        {/* Info & Benefits Section */}
        <section className="space-y-10 max-w-4xl mx-auto">
          {/* How It Works */}
          <div className="space-y-4 text-center">
            <h2 className="text-xl sm:text-2xl font-bold">How It Works</h2>
            <div className="flex justify-center items-center">
              <ul className="grid md:grid-cols-3 gap-6 text-sm sm:text-base text-gray-600 dark:text-gray-400 text-left">
                <li className="flex flex-col items-center text-center p-4 rounded-lg bg-white dark:bg-gray-800 border-none">
                  <Zap className="w-8 h-8 text-yellow-500 mb-2" />
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    AI-Powered Feedback
                  </span>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Get instant, detailed analysis on your answers.
                  </p>
                </li>
                <li className="flex flex-col items-center text-center p-4 rounded-lg bg-white dark:bg-gray-800 border-none">
                  <BookOpen className="w-8 h-8 text-blue-500 mb-2" />
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    Authentic Questions
                  </span>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Practice with questions from official sources.
                  </p>
                </li>
                <li className="flex flex-col items-center text-center p-4 rounded-lg bg-white dark:bg-gray-800 border-none">
                  <GraduationCap className="w-8 h-8 text-green-500 mb-2" />
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    Tailored to You
                  </span>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Choose between guided (Easy) or timed (Hard) modes.
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Full Exam Modal */}
        <FullExamSelectorModal open={modalOpen} onOpenChange={setModalOpen} />
      </div>
    </div>
  );
}
