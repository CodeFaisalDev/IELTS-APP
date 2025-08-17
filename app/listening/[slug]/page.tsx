"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CheckCircle, XCircle, Trophy } from "lucide-react";

interface ListeningTestData {
  id: string;
  title: string;
  audioUrl: string;
  content: string;
  answers: any;
}

interface QuestionResult {
  questionId: string;
  userAnswer: string | string[];
  correctAnswer: string | string[];
  isCorrect: boolean;
}

interface ResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  backendAnswers: Record<string, string | string[]>;
  userAnswers: Record<string, string | string[]>;
  onStartAnother: () => void;
}

// Result Modal Component
function ResultModal({
  isOpen,
  onClose,
  backendAnswers,
  userAnswers,
  onStartAnother,
}: ResultModalProps) {
  // Function to normalize answers for comparison
  const normalizeAnswer = (answer: string | string[]): string[] => {
    if (Array.isArray(answer)) {
      return answer.map((a) => a.toString().toLowerCase().trim());
    }
    return [answer.toString().toLowerCase().trim()];
  };

  // Function to check if user answer matches any of the correct answers
  const isAnswerCorrect = (
    userAns: string | string[],
    correctAns: string | string[]
  ): boolean => {
    if (!userAns || (Array.isArray(userAns) && userAns.length === 0)) {
      return false;
    }

    const normalizedUserAns = normalizeAnswer(userAns);
    const normalizedCorrectAns = normalizeAnswer(correctAns);

    // For multiple choice questions, check if all user answers are correct
    if (Array.isArray(userAns) && Array.isArray(correctAns)) {
      if (normalizedUserAns.length !== normalizedCorrectAns.length) {
        return false;
      }
      return normalizedUserAns.every((ans) =>
        normalizedCorrectAns.includes(ans)
      );
    }

    // For single answers, check if user answer matches any of the correct answers
    return normalizedUserAns.some((userAnswer) =>
      normalizedCorrectAns.includes(userAnswer)
    );
  };

  // Calculate results
  const calculateResults = (): {
    results: QuestionResult[];
    correctCount: number;
    totalQuestions: number;
    bandScore: number;
  } => {
    const results: QuestionResult[] = [];
    let correctCount = 0;

    // Get all question numbers from backend answers
    const allQuestions = Object.keys(backendAnswers).sort((a, b) => {
      const numA = parseInt(a);
      const numB = parseInt(b);
      return numA - numB;
    });

    allQuestions.forEach((questionId) => {
      const correctAnswer = backendAnswers[questionId];
      const userAnswer = userAnswers[`Q${questionId}`] || "";
      const isCorrect = isAnswerCorrect(userAnswer, correctAnswer);

      if (isCorrect) {
        correctCount++;
      }

      results.push({
        questionId,
        userAnswer,
        correctAnswer,
        isCorrect,
      });
    });

    const totalQuestions = allQuestions.length;

    // IELTS Listening Band Score Calculation (out of 40 questions)
    const getBandScore = (correct: number, total: number): number => {
      if (total !== 40) {
        // If not exactly 40 questions, scale proportionally
        const scaledCorrect = (correct / total) * 40;
        return getBandScore(Math.round(scaledCorrect), 40);
      }

      // Standard IELTS Listening Band Score mapping
      if (correct >= 39) return 9.0;
      if (correct >= 37) return 8.5;
      if (correct >= 35) return 8.0;
      if (correct >= 32) return 7.5;
      if (correct >= 30) return 7.0;
      if (correct >= 26) return 6.5;
      if (correct >= 23) return 6.0;
      if (correct >= 18) return 5.5;
      if (correct >= 16) return 5.0;
      if (correct >= 13) return 4.5;
      if (correct >= 11) return 4.0;
      if (correct >= 8) return 3.5;
      if (correct >= 6) return 3.0;
      if (correct >= 4) return 2.5;
      if (correct >= 3) return 2.0;
      if (correct >= 2) return 1.5;
      if (correct >= 1) return 1.0;
      return 0;
    };

    const bandScore = getBandScore(correctCount, totalQuestions);

    return {
      results,
      correctCount,
      totalQuestions,
      bandScore,
    };
  };

  const { results, correctCount, totalQuestions, bandScore } =
    calculateResults();
  const incorrectCount = totalQuestions - correctCount;
  const percentage = Math.round((correctCount / totalQuestions) * 100);

  // Function to display answer in a readable format
  const displayAnswer = (answer: string | string[]): string => {
    if (Array.isArray(answer)) {
      return answer.join(", ");
    }
    return answer.toString();
  };

  // Get band score color
  const getBandScoreColor = (score: number): string => {
    if (score >= 8.0) return "text-green-600";
    if (score >= 6.5) return "text-blue-600";
    if (score >= 5.5) return "text-yellow-600";
    return "text-red-600";
  };

  const getBandScoreBackground = (score: number): string => {
    if (score >= 8.0) return "bg-green-100 dark:bg-green-900/20";
    if (score >= 6.5) return "bg-blue-100 dark:bg-blue-900/20";
    if (score >= 5.5) return "bg-yellow-100 dark:bg-yellow-900/20";
    return "bg-red-100 dark:bg-red-900/20";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Trophy className="w-6 h-6 text-yellow-500" />
            Test Results
          </DialogTitle>
          <DialogDescription>
            Your IELTS Listening Test performance summary
          </DialogDescription>
        </DialogHeader>

        {/* Score Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div
            className={`p-4 rounded-lg text-center ${getBandScoreBackground(
              bandScore
            )}`}
          >
            <div
              className={`text-3xl font-bold ${getBandScoreColor(bandScore)}`}
            >
              {bandScore}
            </div>
            <div className="text-sm font-medium">IELTS Band Score</div>
          </div>

          <div className="p-4 bg-green-100 dark:bg-green-900/20 rounded-lg text-center">
            <div className="text-3xl font-bold text-green-600">
              {correctCount}
            </div>
            <div className="text-sm font-medium">Correct Answers</div>
          </div>

          <div className="p-4 bg-red-100 dark:bg-red-900/20 rounded-lg text-center">
            <div className="text-3xl font-bold text-red-600">
              {incorrectCount}
            </div>
            <div className="text-sm font-medium">Incorrect Answers</div>
          </div>
        </div>

        {/* Overall Performance */}
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">Overall Performance</span>
            <span className="font-bold">{percentage}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {correctCount} out of {totalQuestions} questions answered correctly
          </div>
        </div>

        {/* Detailed Results */}
        <div className="space-y-3">
          <h3 className="font-semibold text-lg mb-3">
            Question-by-Question Results
          </h3>
          <div className="max-h-60 overflow-y-auto space-y-2">
            {results.map((result, index) => (
              <div
                key={result.questionId}
                className={`p-3 rounded-lg border ${
                  result.isCorrect
                    ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                    : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                }`}
              >
                <div className="flex items-start gap-3">
                  {result.isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm mb-1">
                      Question {result.questionId}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="font-medium text-gray-600 dark:text-gray-400">
                          Your Answer:
                        </span>
                        <div
                          className={`mt-1 p-2 rounded ${
                            result.isCorrect
                              ? "bg-green-100 dark:bg-green-800/30"
                              : "bg-red-100 dark:bg-red-800/30"
                          }`}
                        >
                          {displayAnswer(result.userAnswer) || "No answer"}
                        </div>
                      </div>

                      <div>
                        <span className="font-medium text-gray-600 dark:text-gray-400">
                          Correct Answer:
                        </span>
                        <div className="mt-1 p-2 bg-blue-100 dark:bg-blue-800/30 rounded">
                          {displayAnswer(result.correctAnswer)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-center pt-4">
          <Button
            onClick={onStartAnother}
            size="lg"
            className="w-full md:w-auto"
          >
            Start Another Test
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function ListeningTestPage({
  params,
}: {
  params: { slug: string };
}) {
  const [test, setTest] = useState<ListeningTestData | null>(null);
  const [loading, setLoading] = useState(true);
  const [userAnswers, setUserAnswers] = useState<
    Record<string, string | string[]>
  >({});
  const [organizedAnswers, setOrganizedAnswers] = useState<
    Record<string, string | string[]>
  >({});
  const [timeLeft, setTimeLeft] = useState(40 * 60);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const tenMinuteWarningShown = useRef(false);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await fetch(`/api/listening/${params.slug}`);
      if (res.ok) setTest(await res.json());
      else console.error("Failed to fetch test");
      setLoading(false);
    })();
  }, [params.slug]);

  useEffect(() => {
    if (!test || loading) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 1;
        if (next <= 10 * 60 && !tenMinuteWarningShown.current) {
          setShowWarningModal(true);
          tenMinuteWarningShown.current = true;
        }
        if (next <= 0) {
          clearInterval(timer);
          handleFinishExam();
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [test, loading]);

  const handleInputChange = (questionId: string, value: string) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleCheckboxChange = (
    qid: string,
    option: string,
    checked: boolean,
    maxSelections: number
  ) => {
    setUserAnswers((prev) => {
      const current = (prev[qid] as string[]) || [];
      let next;

      if (checked) {
        if (current.length >= maxSelections) {
          return prev;
        }
        next = [...current, option].sort();
      } else {
        next = current.filter((v) => v !== option);
      }

      return { ...prev, [qid]: next };
    });
  };

  const handleRadioChange = (qid: string, value: string) => {
    setUserAnswers((prev) => ({ ...prev, [qid]: value }));
  };

  const handleFinishExam = () => {
    console.log("FINAL USER ANSWERS:", userAnswers);

    // Organize answers by question for better readability
    const organizedAnswers: Record<string, string | string[]> = {};

    // For multi-choice questions, distribute answers to individual questions
    Object.entries(userAnswers).forEach(([key, value]) => {
      if (key.startsWith("mc-")) {
        // Handle multiple choice questions
        const answers = value as string[];
        const questionNumbers = key.replace("mc-", "").split(",");

        questionNumbers.forEach((qNum, index) => {
          if (answers[index]) {
            organizedAnswers[`Q${qNum.trim()}`] = answers[index];
          }
        });
      } else if (key.startsWith("sc-")) {
        // Handle single choice questions
        const questionNumber = key.replace("sc-", "");
        organizedAnswers[`Q${questionNumber}`] = value as string;
      } else {
        // Handle regular input questions
        organizedAnswers[key] = value;
      }
    });

    console.log("ORGANIZED ANSWERS:", organizedAnswers);

    // Store organized answers and show result modal
    setOrganizedAnswers(organizedAnswers);
    setShowResultModal(true);
  };

  const handleStartAnother = () => {
    setShowResultModal(false);
    router.push("/"); // Navigate to root page
  };

  const parsedContent = useMemo(() => {
    if (!test?.content) return null;

    const html = test.content;
    let keySeq = 0;
    const nextKey = () => `k-${keySeq++}`;

    let mcCounter = 0;
    let scCounter = 0;

    const getOptionLetter = (s: string) => {
      const m = s.trim().match(/^([A-Za-z])/);
      return m ? m[1].toUpperCase() : s.trim();
    };

    // Helper function to extract question number from text
    const extractQuestionNumber = (text: string): string | null => {
      const match = text.match(/Q(\d+)/);
      return match ? match[1] : null;
    };

    // Helper function to extract multiple question numbers
    const extractMultipleQuestionNumbers = (text: string): string[] => {
      const matches = text.match(/Q(\d+)(?:[-,]\s*Q(\d+))?/);
      if (matches) {
        if (matches[2]) {
          // Range like Q11-Q12 or Q11,Q12
          const start = parseInt(matches[1]);
          const end = parseInt(matches[2]);
          const result = [];
          for (let i = start; i <= end; i++) {
            result.push(i.toString());
          }
          return result;
        } else {
          // Single question
          return [matches[1]];
        }
      }
      return [];
    };

    const renderInlineWithInputs = (innerHtml: string) => {
      // Simple approach: replace Q{number} {} patterns with inline components
      const parts = [];
      let lastIndex = 0;
      const regex = /Q(\d+)\s*\{\}/g;
      let match;

      while ((match = regex.exec(innerHtml)) !== null) {
        // Add text before the match
        if (match.index > lastIndex) {
          const beforeText = innerHtml.slice(lastIndex, match.index);
          parts.push(
            <span
              key={nextKey()}
              dangerouslySetInnerHTML={{ __html: beforeText }}
            />
          );
        }

        // Add Q number and input
        const qNum = match[1];
        parts.push(
          <span key={nextKey()} className="inline-block">
            <span className="mr-1">Q{qNum}</span>
            <input
              onChange={(e) => handleInputChange(`Q${qNum}`, e.target.value)}
              className="inline-block align-baseline mx-1 px-1 py-0.5 w-32 bg-transparent border-0 border-b border-gray-400 focus:outline-none focus:ring-0 focus:border-black dark:focus:border-white"
              type="text"
            />
          </span>
        );

        lastIndex = regex.lastIndex;
      }

      // Add remaining text
      if (lastIndex < innerHtml.length) {
        const remainingText = innerHtml.slice(lastIndex);
        parts.push(
          <span
            key={nextKey()}
            dangerouslySetInnerHTML={{ __html: remainingText }}
          />
        );
      }

      return parts;
    };

    const renderFigureTable = (fig: HTMLElement) => {
      const table = fig.querySelector("table");
      if (!table) return null;
      const thead = table.querySelector("thead");
      const tbody = table.querySelector("tbody");
      const headers = Array.from(thead?.querySelectorAll("th") || []).map(
        (th) => th.innerHTML
      );
      const rows = Array.from(tbody?.querySelectorAll("tr") || []);

      return (
        <div key={nextKey()} className="my-6 overflow-x-auto">
          <table className="min-w-full border-collapse border border-slate-300 dark:border-slate-700">
            {headers.length > 0 && (
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800">
                  {headers.map((h) => (
                    <th
                      key={nextKey()}
                      className="border border-slate-300 dark:border-slate-700 px-4 py-2 text-left font-semibold"
                    >
                      <span dangerouslySetInnerHTML={{ __html: h }} />
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {rows.map((row, rIdx) => {
                const cells = Array.from(row.querySelectorAll("td"));
                return (
                  <tr
                    key={nextKey()}
                    className={
                      rIdx % 2 === 0
                        ? "bg-white dark:bg-slate-900"
                        : "bg-slate-50 dark:bg-slate-800/50"
                    }
                  >
                    {cells.map((cell) => (
                      <td
                        key={nextKey()}
                        className="border border-slate-300 dark:border-slate-700 px-4 py-2"
                      >
                        {renderInlineWithInputs(cell.innerHTML)}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
    };

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const out: React.ReactNode[] = [];
    const nodes = Array.from(doc.body.childNodes);

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement;
        const textContent = (el.textContent || "").trim();

        if (el.tagName === "FIGURE" && el.classList.contains("table")) {
          out.push(renderFigureTable(el));
          continue;
        }

        // Handle UL/LI elements specifically to preserve bullet points
        if (el.tagName === "UL") {
          const listItems = Array.from(el.querySelectorAll("li"));
          out.push(
            <ul
              key={nextKey()}
              className="list-disc list-inside my-4 space-y-1"
            >
              {listItems.map((li) => (
                <li key={nextKey()} className="my-1">
                  {li.innerHTML.includes("Q") && li.innerHTML.includes("{}") ? (
                    renderInlineWithInputs(li.innerHTML)
                  ) : (
                    <span dangerouslySetInnerHTML={{ __html: li.innerHTML }} />
                  )}
                </li>
              ))}
            </ul>
          );
          continue;
        }

        // Handle OL elements specifically
        if (el.tagName === "OL") {
          const listItems = Array.from(el.querySelectorAll("li"));
          out.push(
            <ol
              key={nextKey()}
              className="list-decimal list-inside my-4 space-y-1"
            >
              {listItems.map((li) => (
                <li key={nextKey()} className="my-1">
                  {li.innerHTML.includes("Q") && li.innerHTML.includes("{}") ? (
                    renderInlineWithInputs(li.innerHTML)
                  ) : (
                    <span dangerouslySetInnerHTML={{ __html: li.innerHTML }} />
                  )}
                </li>
              ))}
            </ol>
          );
          continue;
        }

        const isMultiChoiceStart = textContent.startsWith("-[");
        const isSingleChoiceStart = textContent.startsWith("-(");

        if (isMultiChoiceStart || isSingleChoiceStart) {
          const isMulti = isMultiChoiceStart;
          const endMarker = isMulti ? "-]" : "-)";

          if (isMulti) mcCounter++;
          else scCounter++;

          let contentHtml = el.innerHTML;
          // Look ahead for concatenated content until the end marker
          let nextIndex = i + 1;
          while (nextIndex < nodes.length) {
            const nextNode = nodes[nextIndex] as HTMLElement;
            if (
              nextNode.nodeType !== Node.ELEMENT_NODE ||
              (nextNode.textContent || "").includes(endMarker)
            ) {
              contentHtml += nextNode.textContent;
              i = nextIndex; // Move main loop counter forward
              break;
            }
            contentHtml += nextNode.outerHTML;
            nextIndex++;
          }

          const cleanedContent = contentHtml
            .replace(/-\[|&nbsp;|\s*<p>&nbsp;<\/p>\s*|-\(|\)-\]/g, "")
            .replace(/<p>\s*<\/p>/g, "");

          let parts: string[] = [];
          let questionHtml = "";
          let optionHtmls: string[] = [];

          // Check if content uses @ format or <ol><li> format
          if (cleanedContent.includes("@")) {
            // Original @ format
            parts = cleanedContent.split("@").filter((p) => p.trim());
            questionHtml = parts[0] || "";
            optionHtmls = parts.slice(1);
          } else if (
            cleanedContent.includes("<ol>") ||
            cleanedContent.includes("<li>")
          ) {
            // New <ol><li> format
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = cleanedContent;

            // Extract question (everything before <ol> or first <li>)
            const olElement = tempDiv.querySelector("ol");
            const firstLi = tempDiv.querySelector("li");

            if (olElement) {
              // Get everything before the <ol>
              const beforeOl = cleanedContent.substring(
                0,
                cleanedContent.indexOf("<ol>")
              );
              questionHtml = beforeOl;

              // Get all <li> elements
              const liElements = olElement.querySelectorAll("li");
              optionHtmls = Array.from(liElements).map((li, index) => {
                const letter = String.fromCharCode(65 + index); // A, B, C, D, E...
                return `${letter} ${li.innerHTML}`;
              });
            } else if (firstLi) {
              // Get everything before the first <li>
              const beforeFirstLi = cleanedContent.substring(
                0,
                cleanedContent.indexOf("<li>")
              );
              questionHtml = beforeFirstLi;

              // Get all <li> elements
              const liElements = tempDiv.querySelectorAll("li");
              optionHtmls = Array.from(liElements).map((li, index) => {
                const letter = String.fromCharCode(65 + index); // A, B, C, D, E...
                return `${letter} ${li.innerHTML}`;
              });
            }
          } else {
            // Fallback: assume @ format but split by common patterns
            parts = cleanedContent.split("@").filter((p) => p.trim());
            questionHtml = parts[0] || "";
            optionHtmls = parts.slice(1);
          }

          if (isMulti) {
            // Extract question numbers for multiple choice
            const questionNumbers =
              extractMultipleQuestionNumbers(questionHtml);
            const qid = `mc-${questionNumbers.join(",")}`;
            const maxSelections = questionNumbers.length;

            out.push(
              <div
                key={nextKey()}
                className="my-6 p-6 border rounded-lg bg-slate-50 dark:bg-slate-800"
              >
                <div
                  className="font-semibold mb-4"
                  dangerouslySetInnerHTML={{ __html: questionHtml }}
                />
                <div className="space-y-3">
                  {optionHtmls.map((optHtml, idxOpt) => {
                    const value = getOptionLetter(optHtml);
                    const isSelected = (
                      (userAnswers[qid] as string[]) || []
                    ).includes(value);
                    const currentSelections = (
                      (userAnswers[qid] as string[]) || []
                    ).length;
                    const isDisabled =
                      !isSelected && currentSelections >= maxSelections;

                    return (
                      <div
                        key={nextKey()}
                        className="flex items-start space-x-3"
                      >
                        <Checkbox
                          id={`${qid}-${idxOpt}`}
                          className="mt-1"
                          checked={isSelected}
                          disabled={isDisabled}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange(
                              qid,
                              value,
                              !!checked,
                              maxSelections
                            )
                          }
                        />
                        <Label
                          htmlFor={`${qid}-${idxOpt}`}
                          className={`text-sm cursor-pointer flex-1 ${
                            isDisabled ? "opacity-50" : ""
                          }`}
                          dangerouslySetInnerHTML={{ __html: optHtml }}
                        />
                      </div>
                    );
                  })}
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  Select {maxSelections} option{maxSelections > 1 ? "s" : ""}(
                  {((userAnswers[qid] as string[]) || []).length}/
                  {maxSelections} selected)
                </div>
              </div>
            );
          } else {
            // Single choice question
            const questionNumber = extractQuestionNumber(questionHtml);
            const qid = `sc-${questionNumber}`;

            out.push(
              <div
                key={nextKey()}
                className="my-6 p-6 border rounded-lg bg-slate-50 dark:bg-slate-800"
              >
                <div
                  className="font-semibold mb-4"
                  dangerouslySetInnerHTML={{ __html: questionHtml }}
                />
                <RadioGroup
                  onValueChange={(value) => handleRadioChange(qid, value)}
                >
                  <div className="space-y-3">
                    {optionHtmls.map((optHtml, idxOpt) => {
                      const value = getOptionLetter(optHtml);

                      return (
                        <div
                          key={nextKey()}
                          className="flex items-start space-x-3"
                        >
                          <RadioGroupItem
                            value={value}
                            id={`${qid}-${idxOpt}`}
                            className="mt-1"
                          />
                          <Label
                            htmlFor={`${qid}-${idxOpt}`}
                            className="text-sm cursor-pointer flex-1"
                            dangerouslySetInnerHTML={{ __html: optHtml }}
                          />
                        </div>
                      );
                    })}
                  </div>
                </RadioGroup>
              </div>
            );
          }
          continue;
        }

        if (el.innerHTML.includes("Q") && el.innerHTML.includes("{}")) {
          const Tag = el.tagName.toLowerCase() as keyof JSX.IntrinsicElements;
          out.push(
            <Tag key={nextKey()} className="my-4">
              {renderInlineWithInputs(el.innerHTML)}
            </Tag>
          );
        } else {
          out.push(
            <div
              key={nextKey()}
              dangerouslySetInnerHTML={{ __html: el.outerHTML }}
            />
          );
        }
      }
    }
    return <>{out}</>;
  }, [test?.content, userAnswers]); // Added userAnswers to dependency array for checkbox state

  if (loading) return <div className="text-center p-10">Loading Test...</div>;
  if (!test)
    return (
      <div className="text-center p-10 text-red-500">
        Could not load the test.
      </div>
    );

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <AlertDialog open={showWarningModal} onOpenChange={setShowWarningModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Time Reminder</AlertDialogTitle>
            <AlertDialogDescription>
              You have 10 minutes left to complete the test.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ResultModal
        isOpen={showResultModal}
        onClose={() => setShowResultModal(false)}
        backendAnswers={test?.answers || {}}
        userAnswers={organizedAnswers}
        onStartAnother={handleStartAnother}
      />

      <header className="mb-6">
        <h1 className="text-3xl font-bold">{test.title}</h1>
      </header>

      <main className="max-w-none">{parsedContent}</main>

      <footer className="sticky bottom-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4 mt-8 border-t">
        <div className="flex items-center justify-between">
          <audio controls src={test.audioUrl} className="w-1/2" />
          <div className="text-2xl font-mono" title="Time Remaining">
            {String(minutes).padStart(2, "0")}:
            {String(seconds).padStart(2, "0")}
          </div>
          <Button size="lg" onClick={handleFinishExam}>
            Finish Exam
          </Button>
        </div>
      </footer>
    </div>
  );
}
