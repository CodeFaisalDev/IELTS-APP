// app/listening/[slug]/page.tsx
"use client";

import { useEffect, useRef, useState, useMemo } from "react"; // Added useMemo
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

interface ListeningTestData {
  id: string;
  title: string;
  audioUrl: string;
  content: string;
  answers: any;
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
  const [timeLeft, setTimeLeft] = useState(40 * 60);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const tenMinuteWarningShown = useRef(false);

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

  const handleInputChange = (qNum: number, value: string) => {
    setUserAnswers((prev) => ({ ...prev, [String(qNum)]: value }));
  };

  const handleCheckboxChange = (
    qid: string,
    option: string,
    checked: boolean
  ) => {
    setUserAnswers((prev) => {
      const current = (prev[qid] as string[]) || [];
      const next = checked
        ? [...current, option]
        : current.filter((v) => v !== option);
      return { ...prev, [qid]: next.sort() };
    });
  };

  const handleRadioChange = (qid: string, value: string) => {
    setUserAnswers((prev) => ({ ...prev, [qid]: value }));
  };

  const handleFinishExam = () => {
    console.log("FINAL USER ANSWERS:", userAnswers);
    alert("Exam Finished! Check the console for your answers.");
  };

  // --- THE COMBINED SOLUTION ---
  // We use useMemo to run the powerful DOMParser logic only ONCE.
  // This prevents the inputs from being reset on every state change.
  const parsedContent = useMemo(() => {
    if (!test?.content) return null;

    const html = test.content;
    let keySeq = 0;
    const nextKey = () => `k-${keySeq++}`;

    let fillCounter = 0;
    let mcCounter = 0;
    let scCounter = 0;

    const getOptionLetter = (s: string) => {
      const m = s.trim().match(/^([A-Za-z])/);
      return m ? m[1].toUpperCase() : s.trim();
    };

    const renderInlineWithInputs = (innerHtml: string) => {
      const parts = innerHtml.split("{}");
      const children: React.ReactNode[] = [];
      parts.forEach((seg, idx) => {
        if (seg) {
          children.push(
            <span key={nextKey()} dangerouslySetInnerHTML={{ __html: seg }} />
          );
        }
        if (idx < parts.length - 1) {
          fillCounter++;
          const qNum = fillCounter;
          children.push(
            <input
              key={nextKey()}
              onChange={(e) => handleInputChange(qNum, e.target.value)}
              className="inline-block align-baseline mx-2 px-1 py-0.5 w-44 bg-transparent border-0 border-b border-gray-400 focus:outline-none focus:ring-0 focus:border-black dark:focus:border-white"
              type="text"
            />
          );
        }
      });
      return children;
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

        const isMultiChoiceStart = textContent.startsWith("-[");
        const isSingleChoiceStart = textContent.startsWith("-(");

        if (isMultiChoiceStart || isSingleChoiceStart) {
          const isMulti = isMultiChoiceStart;
          const endMarker = isMulti ? "-]" : "-)";

          if (isMulti) mcCounter++;
          else scCounter++;
          const qid = isMulti ? `mc-${mcCounter}` : `sc-${scCounter}`;

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

          const parts = cleanedContent.split("@").filter((p) => p.trim());
          const questionHtml = parts[0] || "";
          const optionHtmls = parts.slice(1);

          out.push(
            <div
              key={nextKey()}
              className="my-6 p-6 border rounded-lg bg-slate-50 dark:bg-slate-800"
            >
              <div
                className="font-semibold mb-4"
                dangerouslySetInnerHTML={{ __html: questionHtml }}
              />
              {isMulti ? (
                <div className="space-y-3">
                  {optionHtmls.map((optHtml, idxOpt) => {
                    const value = getOptionLetter(optHtml);
                    return (
                      <div
                        key={nextKey()}
                        className="flex items-start space-x-3"
                      >
                        <Checkbox
                          id={`${qid}-${idxOpt}`}
                          className="mt-1"
                          onCheckedChange={(checked) =>
                            handleCheckboxChange(qid, value, !!checked)
                          }
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
              ) : (
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
              )}
            </div>
          );
          continue;
        }

        if (el.innerHTML.includes("{}")) {
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
  }, [test?.content]); // This dependency array is crucial!

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
