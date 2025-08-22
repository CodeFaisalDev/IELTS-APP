// /app/writing/[slug]/components/LoadingModal.tsx

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
      <DialogContent className="bg-white text-black max-w-sm">
        <DialogHeader className="flex flex-col items-center text-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
          <DialogTitle className="text-xl font-bold">
            Processing Your Results
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500 mt-2">
            Please wait a moment while our AI evaluates your essay.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
