"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookOpen, Layers } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import FullExamSelectorModal from "@/components/custom/FullExamSelectorModal";

export default function HomePage() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-4">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
          IELTS Practice App
        </h1>
        <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
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
          <Card className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <CardHeader className="flex flex-col items-center space-y-5 py-10">
              <div className="p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <BookOpen className="h-12 w-12 text-primary" />
              </div>
              <CardTitle className="text-lg sm:text-xl">
                Practice One Module
              </CardTitle>
              <CardDescription className="text-center text-sm sm:text-base">
                Focus on Listening, Reading, Writing, or Speaking individually.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        {/* Full Exam Button */}
        <button
          onClick={() => setModalOpen(true)}
          className="w-full block text-left"
        >
          <Card className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <CardHeader className="flex flex-col items-center space-y-5 py-10">
              <div className="p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Layers className="h-12 w-12 text-primary" />
              </div>
              <CardTitle className="text-lg sm:text-xl">
                Practice Full Exam
              </CardTitle>
              <CardDescription className="text-center text-sm sm:text-base">
                Simulate a real IELTS exam covering all modules in sequence.
              </CardDescription>
            </CardHeader>
          </Card>
        </button>
      </section>

      {/* Info Section */}
      <section className="space-y-4 text-center max-w-4xl mx-auto">
        <h2 className="text-xl sm:text-2xl font-semibold">How It Works</h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          Our platform provides authentic IELTS questions sourced from official
          practice materials. Choose between Easy or Hard mode — in Easy mode,
          get hints, Bangla translations, and guidance; in Hard mode, experience
          the real test environment. All answers are evaluated instantly using
          AI, giving you detailed feedback and improvement tips.
        </p>
      </section>

      {/* Benefits Section */}
      <section className="space-y-4 max-w-4xl mx-auto">
        <h2 className="text-xl sm:text-2xl font-semibold text-center">
          Why Use This App?
        </h2>
        <ul className="pl-5 space-y-2 text-sm sm:text-base text-muted-foreground  text-center">
          <li>Authentic IELTS practice questions from official sources.</li>
          <li>
            Bangla translations to help Bangladeshi students understand better.
          </li>
          <li>
            AI-powered scoring and feedback for Listening, Reading, Writing, and
            Speaking.
          </li>
          <li>Resume your practice anytime, even if you close the browser.</li>
          <li>
            Practice one module at a time or take the full simulated exam.
          </li>
        </ul>
      </section>

      {/* Full Exam Modal */}
      <FullExamSelectorModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
}
