// app/speaking/[slug]/components/LoadingModal.tsx

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface LoadingModalProps {
  isOpen: boolean;
}

export default function LoadingModal({ isOpen }: LoadingModalProps) {
  return (
    <Dialog open={isOpen}>
      <DialogContent className="bg-white text-black dark:bg-gray-900 dark:text-gray-100 max-w-sm">
        <DialogHeader className="flex flex-col items-center text-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
          <DialogTitle className="text-xl font-bold">
            Evaluating Your Performance
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Please wait a moment while our AI analyzes your speaking skills.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
