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
import { useState } from "react";

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
  const [selectedSet, setSelectedSet] = useState<string>("");

  const handleStart = () => {
    if (module && selectedSet) {
      onOpenChange(false);
      router.push(`/${module}/${encodeURIComponent(selectedSet)}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white text-black rounded-xl shadow-lg max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle>Select Practice Set</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Select onValueChange={setSelectedSet}>
            <SelectTrigger className="bg-input text-foreground border border-input rounded-md">
              <SelectValue placeholder="Select Cambridge IELTS Set" />
            </SelectTrigger>
            <SelectContent className="bg-white text-black">
              {Array.from({ length: 18 }, (_, i) => (
                <SelectItem key={i} value={`Cambridge IELTS ${i + 1}`}>
                  Cambridge IELTS {i + 1}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            className="w-full"
            onClick={handleStart}
            disabled={!selectedSet}
          >
            Start Practice
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
