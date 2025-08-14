"use client";

import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { PlusCircle } from "lucide-react";

export default function AdminPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-center">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Link href="/admin/add-qs">
          <Card className="cursor-pointer hover:shadow-xl transition transform hover:-translate-y-1">
            <CardHeader className="flex flex-col items-center space-y-4 py-10">
              <PlusCircle className="h-12 w-12 text-primary" />
              <CardTitle>Add New Question</CardTitle>
              <CardDescription className="text-center">
                Create IELTS questions for Listening, Reading, Writing, or
                Speaking.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        {/* Future: View Exams */}
        <Card className="cursor-not-allowed opacity-50 flex flex-col items-center justify-center py-10">
          <CardHeader className="flex flex-col items-center space-y-4">
            <CardTitle>View Exams</CardTitle>
            <CardDescription>Coming soon...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
