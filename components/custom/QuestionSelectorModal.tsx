"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  module: string | null;
}

export default function QuestionSelectorModal({
  open,
  onOpenChange,
  module,
}: Props) {
  const router = useRouter();
  const [selectedSlug, setSelectedSlug] = useState<string>("");

  const [tests, setTests] = useState<{ title: string; slug: string }[]>([]);

  useEffect(() => {
    fetch("/api/listening")
      .then((res) => res.json())
      .then((data) => setTests(data));
  }, []);

  const handleStart = () => {
    if (module && selectedSlug) {
      onOpenChange(false);
      router.push(`/${module}/${encodeURIComponent(selectedSlug)}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white text-black rounded-xl shadow-lg max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle>Select Practice Set</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Select onValueChange={setSelectedSlug}>
            <SelectTrigger>
              <SelectValue placeholder="" />
            </SelectTrigger>
            <SelectContent className="text-black bg-white">
              {tests.map((test) => (
                <SelectItem key={test.slug} value={test.slug}>
                  {test.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            className="w-full"
            onClick={handleStart}
            disabled={!selectedSlug}
          >
            Start Practice
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
