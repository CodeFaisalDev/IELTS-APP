"use client";

import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Headphones, BookOpen, PenTool, Mic } from "lucide-react";

export default function AddQsPage() {
  const modules = [
    {
      title: "Listening",
      icon: <Headphones className="h-12 w-12 text-primary" />,
      path: "/admin/add-qs/listening",
    },
    {
      title: "Reading",
      icon: <BookOpen className="h-12 w-12 text-primary" />,
      path: "/admin/add-qs/reading",
    },
    {
      title: "Writing",
      icon: <PenTool className="h-12 w-12 text-primary" />,
      path: "/admin/add-qs/writing",
    },
    {
      title: "Speaking",
      icon: <Mic className="h-12 w-12 text-primary" />,
      path: "/admin/add-qs/speaking",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-center">
        Select Module to Add Questions
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {modules.map((mod) => (
          <Link key={mod.title} href={mod.path}>
            <Card className="cursor-pointer hover:shadow-xl transition transform hover:-translate-y-1">
              <CardHeader className="flex flex-col items-center space-y-4 py-10">
                {mod.icon}
                <CardTitle>{mod.title}</CardTitle>
                <CardDescription className="text-center text-sm sm:text-base">
                  Click to add {mod.title} questions
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
