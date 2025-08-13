"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { BookOpen, Headphones, PenTool, Mic } from "lucide-react";
import { useState } from "react";
import QuestionSelectorModal from "@/components/custom/QuestionSelectorModal";

export default function OneModulePage() {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const modules = [
    {
      title: "Listening",
      description: "40-minute test: 30 min audio + 10 min answer transfer",
      icon: <Headphones className="h-12 w-12 text-primary" />,
      slug: "listening",
    },
    {
      title: "Reading",
      description: "60-minute academic or general reading test",
      icon: <BookOpen className="h-12 w-12 text-primary" />,
      slug: "reading",
    },
    {
      title: "Writing",
      description: "60-minute writing test with Task 1 & Task 2",
      icon: <PenTool className="h-12 w-12 text-primary" />,
      slug: "writing",
    },
    {
      title: "Speaking",
      description: "11–14 minute face-to-face speaking interview",
      icon: <Mic className="h-12 w-12 text-primary" />,
      slug: "speaking",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold tracking-tight">
          Practice One IELTS Module
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Choose a single IELTS module to focus on. Perfect for quick practice
          sessions to boost your skills. This tool is specially designed for{" "}
          <span className="font-semibold text-primary">
            Bangladeshi students
          </span>{" "}
          preparing for IELTS.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {modules.map((mod) => (
          <Card
            key={mod.title}
            className="cursor-pointer hover:shadow-xl hover:-translate-y-1 transition transform flex flex-col items-center justify-center text-center min-h-[250px]"
            onClick={() => {
              setSelectedModule(mod.slug);
              setModalOpen(true);
            }}
          >
            <CardHeader className="flex flex-col items-center space-y-4">
              {mod.icon}
              <CardTitle>{mod.title}</CardTitle>
              <CardDescription className="px-4">
                {mod.description}
              </CardDescription>
            </CardHeader>
            <CardContent />
          </Card>
        ))}
      </div>

      {/* Modal */}
      <QuestionSelectorModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        module={selectedModule}
      />
    </div>
  );
}
