// app/speaking/[slug]/components/SpeakingTestUI.tsx

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { HelpCircle } from "lucide-react";

interface SpeakingTestUIProps {
  title: string;
  isHelpMode: boolean;
  onHelpModeChange: (checked: boolean) => void;
  children: React.ReactNode;
}

export default function SpeakingTestUI({
  title,
  isHelpMode,
  onHelpModeChange,
  children,
}: SpeakingTestUIProps) {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-3xl shadow-xl bg-white dark:bg-gray-800 border-none h-[85vh] max-h-[800px] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {title}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Switch
              id="help-mode"
              checked={isHelpMode}
              onCheckedChange={onHelpModeChange}
            />
            <Label htmlFor="help-mode" className="flex items-center gap-1">
              <HelpCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Help Mode</span>
            </Label>
          </div>
        </CardHeader>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </Card>
    </div>
  );
}
