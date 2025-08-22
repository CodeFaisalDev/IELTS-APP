import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Handlers } from "../types";

type UserAnswers = Record<string, string | string[]>;

export const parseTestContent = (
  html: string,
  userAnswers: UserAnswers,
  handlers: Handlers
): React.ReactNode => {
  if (!html) return null;

  let keySeq = 0;
  const nextKey = () => `k-${keySeq++}`;

  const getOptionLetter = (s: string) => {
    const m = s.trim().match(/^([A-Za-z])/);
    return m ? m[1].toUpperCase() : s.trim();
  };

  const extractQuestionNumber = (text: string): string | null => {
    const match = text.match(/Q(\d+)/);
    return match ? match[1] : null;
  };

  const extractMultipleQuestionNumbers = (text: string): string[] => {
    const matches = text.match(/Q(\d+)(?:[-,]\s*Q(\d+))?/);
    if (matches) {
      if (matches[2]) {
        const start = parseInt(matches[1]);
        const end = parseInt(matches[2]);
        return Array.from({ length: end - start + 1 }, (_, i) =>
          (start + i).toString()
        );
      }
      return [matches[1]];
    }
    return [];
  };

  const renderInlineWithInputs = (innerHtml: string) => {
    const parts = [];
    let lastIndex = 0;
    const regex = /Q(\d+)\s*\{\}/g;
    let match;

    while ((match = regex.exec(innerHtml)) !== null) {
      if (match.index > lastIndex) {
        parts.push(
          <span
            key={nextKey()}
            dangerouslySetInnerHTML={{
              __html: innerHtml.slice(lastIndex, match.index),
            }}
          />
        );
      }
      const qNum = match[1];
      parts.push(
        <span key={nextKey()} className="inline-block">
          <span className="mr-1">Q{qNum}</span>
          <input
            onChange={(e) =>
              handlers.handleInputChange(`Q${qNum}`, e.target.value)
            }
            className="inline-block align-baseline mx-1 px-1 py-0.5 w-32 bg-transparent border-0 border-b border-gray-400 focus:outline-none focus:ring-0 focus:border-black dark:focus:border-white"
            type="text"
          />
        </span>
      );
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < innerHtml.length) {
      parts.push(
        <span
          key={nextKey()}
          dangerouslySetInnerHTML={{ __html: innerHtml.slice(lastIndex) }}
        />
      );
    }
    return parts;
  };

  const renderFigureTable = (fig: HTMLElement) => {
    const table = fig.querySelector("table");
    if (!table) return null;
    const headers = Array.from(table.querySelectorAll("thead th")).map(
      (th) => th.innerHTML
    );
    const rows = Array.from(table.querySelectorAll("tbody tr"));

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
            {rows.map((row, rIdx) => (
              <tr
                key={nextKey()}
                className={
                  rIdx % 2 === 0
                    ? "bg-white dark:bg-slate-900"
                    : "bg-slate-50 dark:bg-slate-800/50"
                }
              >
                {Array.from(row.querySelectorAll("td")).map((cell) => (
                  <td
                    key={nextKey()}
                    className="border border-slate-300 dark:border-slate-700 px-4 py-2"
                  >
                    {renderInlineWithInputs(cell.innerHTML)}
                  </td>
                ))}
              </tr>
            ))}
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
    if (node.nodeType !== Node.ELEMENT_NODE) continue;

    const el = node as HTMLElement;
    const textContent = (el.textContent || "").trim();

    if (el.tagName === "FIGURE" && el.classList.contains("table")) {
      out.push(renderFigureTable(el));
      continue;
    }

    if (el.tagName === "UL" || el.tagName === "OL") {
      const ListTag = el.tagName.toLowerCase() as "ul" | "ol";
      const listItems = Array.from(el.querySelectorAll("li"));
      out.push(
        <ListTag
          key={nextKey()}
          className={`list-${
            el.tagName === "OL" ? "decimal" : "disc"
          } list-inside my-4 space-y-1`}
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
        </ListTag>
      );
      continue;
    }

    const isMultiChoiceStart = textContent.startsWith("-[");
    const isSingleChoiceStart = textContent.startsWith("-(");

    if (isMultiChoiceStart || isSingleChoiceStart) {
      const isMulti = isMultiChoiceStart;
      let contentHtml = el.innerHTML;
      let nextIndex = i + 1;
      while (nextIndex < nodes.length) {
        const nextNode = nodes[nextIndex] as HTMLElement;
        if (
          nextNode.nodeType !== Node.ELEMENT_NODE ||
          (nextNode.textContent || "").includes(isMulti ? "-]" : "-)")
        ) {
          contentHtml += nextNode.textContent;
          i = nextIndex;
          break;
        }
        contentHtml += nextNode.outerHTML;
        nextIndex++;
      }

      const cleanedContent = contentHtml
        .replace(/-\[|&nbsp;|\s*<p>&nbsp;<\/p>\s*|-\(|\)-\]/g, "")
        .replace(/<p>\s*<\/p>/g, "");
      let questionHtml = "";
      let optionHtmls: string[] = [];

      if (cleanedContent.includes("@")) {
        const parts = cleanedContent.split("@").filter((p) => p.trim());
        questionHtml = parts[0] || "";
        optionHtmls = parts.slice(1);
      } else if (
        cleanedContent.includes("<ol>") ||
        cleanedContent.includes("<li>")
      ) {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = cleanedContent;
        const olElement = tempDiv.querySelector("ol");
        const firstLi = tempDiv.querySelector("li");
        const splitPoint = olElement ? "<ol>" : firstLi ? "<li>" : "";

        if (splitPoint) {
          questionHtml = cleanedContent.substring(
            0,
            cleanedContent.indexOf(splitPoint)
          );
          const liElements = tempDiv.querySelectorAll("li");
          optionHtmls = Array.from(liElements).map(
            (li, index) => `${String.fromCharCode(65 + index)} ${li.innerHTML}`
          );
        }
      }

      if (isMulti) {
        const questionNumbers = extractMultipleQuestionNumbers(questionHtml);
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
                const isDisabled =
                  !isSelected &&
                  ((userAnswers[qid] as string[]) || []).length >=
                    maxSelections;
                return (
                  <div key={nextKey()} className="flex items-start space-x-3">
                    <Checkbox
                      id={`${qid}-${idxOpt}`}
                      className="mt-1"
                      checked={isSelected}
                      disabled={isDisabled}
                      onCheckedChange={(checked) =>
                        handlers.handleCheckboxChange(
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
              Select {maxSelections} option{maxSelections > 1 ? "s" : ""} ({" "}
              {((userAnswers[qid] as string[]) || []).length}/{maxSelections}{" "}
              selected)
            </div>
          </div>
        );
      } else {
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
              onValueChange={(value) => handlers.handleRadioChange(qid, value)}
            >
              <div className="space-y-3">
                {optionHtmls.map((optHtml, idxOpt) => {
                  const value = getOptionLetter(optHtml);
                  return (
                    <div key={nextKey()} className="flex items-start space-x-3">
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

  return <>{out}</>;
};
