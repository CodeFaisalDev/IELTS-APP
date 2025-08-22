import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Handlers, UserAnswers } from "../types";

// Regex to find and replace inline fill-in-the-blank questions
const INLINE_INPUT_REGEX = /(Q\d+\s*\{\})/g;

// Regex to split the main content by question blocks
const BLOCK_SPLITTER_REGEX = /(-\$[\s\S]*?-\$|-%[\s\S]*?-%)/;

const extractQuestionNumber = (text: string): string | null => {
  const match = text.match(/Q(\d+)/);
  return match ? match[1] : null;
};

/**
 * Renders standard HTML content, but finds and replaces any inline Q#{}
 * with interactive input components. This preserves bullet points and formatting.
 */
const renderHtmlWithInputs = (
  html: string,
  userAnswers: UserAnswers,
  handlers: Handlers
): React.ReactNode => {
  if (!html) return null;

  // Simple approach: replace Q#{} patterns in HTML string, then render
  const processedHtml = html.replace(INLINE_INPUT_REGEX, (match) => {
    const qNum = extractQuestionNumber(match);
    if (!qNum) return match;

    // Create a placeholder that we'll replace with React components
    return `<span class="inline-input-placeholder" data-question="Q${qNum}"></span>`;
  });

  // Create a temporary div to parse the processed HTML
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = processedHtml;

  // Function to recursively convert DOM nodes to React elements
  const convertNodeToReact = (
    node: ChildNode,
    index: number
  ): React.ReactNode => {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent;
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as Element;
      const tagName = element.tagName.toLowerCase();

      // Handle our input placeholders
      if (element.classList.contains("inline-input-placeholder")) {
        const qid = element.getAttribute("data-question");
        if (!qid) return null;

        const qNum = qid.replace("Q", "");
        return (
          <span
            key={`input-${qid}-${index}`}
            className="inline-flex items-baseline whitespace-nowrap"
          >
            <span className="mr-1 font-semibold text-sm">{qid}</span>
            <input
              type="text"
              value={userAnswers[qid] || ""}
              onChange={(e) => handlers.handleInputChange(qid, e.target.value)}
              className="inline-block align-baseline mx-1 px-2 py-0.5 w-48 min-w-[3rem] bg-transparent border-0 border-b border-gray-400 focus:outline-none focus:ring-0 focus:border-black dark:focus:border-white text-sm"
              placeholder=""
            />
          </span>
        );
      }

      // Convert child nodes
      const children = Array.from(element.childNodes)
        .map((child, i) => convertNodeToReact(child, i))
        .filter((child) => child !== null);

      // Create props object
      const props: any = { key: `${tagName}-${index}` };

      // Copy relevant attributes
      if (element.className) {
        props.className = element.className;
      }
      if (element.id) {
        props.id = element.id;
      }

      // Handle paragraph and div containers that might contain aligned images
      if (tagName === "p" || tagName === "div") {
        const existingClass = element.getAttribute("class") || "";
        const style = element.getAttribute("style") || "";
        const inlineStyle = parseInlineStyle(style);
        
        // Preserve text alignment from rich text editor
        if (existingClass.includes("text-center") || 
            inlineStyle.textAlign === "center") {
          props.className = `${props.className || ""} text-center`.trim();
        } else if (existingClass.includes("text-right") || 
                   inlineStyle.textAlign === "right") {
          props.className = `${props.className || ""} text-right`.trim();
        } else if (existingClass.includes("text-left") || 
                   inlineStyle.textAlign === "left") {
          props.className = `${props.className || ""} text-left`.trim();
        }
        
        if (style) {
          props.style = { ...parseInlineStyle(style) };
        }
      }

      // Handle image tags specifically
      if (tagName === "img") {
        const src = element.getAttribute("src");
        const alt = element.getAttribute("alt") || "";
        const width = element.getAttribute("width");
        const height = element.getAttribute("height");
        const style = element.getAttribute("style");
        
        if (src) {
          props.src = src;
          props.alt = alt;
          
          // Preserve alignment from rich text editor
          let imageClasses = "max-w-full h-auto";
          
          // Check for alignment in style or class
          const existingClass = element.getAttribute("class") || "";
          const inlineStyle = parseInlineStyle(style || "");
          
          // Detect center alignment
          if (existingClass.includes("center") || 
              existingClass.includes("mx-auto") ||
              inlineStyle.textAlign === "center" ||
              inlineStyle.marginLeft === "auto" ||
              (inlineStyle.marginLeft === "auto" && inlineStyle.marginRight === "auto")) {
            imageClasses += " mx-auto block";
          }
          // Detect right alignment
          else if (existingClass.includes("right") || 
                   existingClass.includes("ml-auto") ||
                   inlineStyle.textAlign === "right" ||
                   inlineStyle.float === "right") {
            imageClasses += " ml-auto block";
          }
          // Detect left alignment (default)
          else if (existingClass.includes("left") || 
                   inlineStyle.textAlign === "left" ||
                   inlineStyle.float === "left") {
            imageClasses += " mr-auto block";
          }
          
          props.className = `${existingClass} ${imageClasses}`.trim();
          
          if (width) props.width = width;
          if (height) props.height = height;
          if (style) {
            props.style = { 
              ...parseInlineStyle(style),
              // Preserve display and margin styles for alignment
              ...(inlineStyle.display && { display: inlineStyle.display }),
              ...(inlineStyle.margin && { margin: inlineStyle.margin }),
              ...(inlineStyle.marginLeft && { marginLeft: inlineStyle.marginLeft }),
              ...(inlineStyle.marginRight && { marginRight: inlineStyle.marginRight }),
              ...(inlineStyle.textAlign && { textAlign: inlineStyle.textAlign })
            };
          }
          
          // Add loading and error handling
          props.loading = "lazy";
          props.onError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
            console.error("Image failed to load:", src);
            e.currentTarget.style.display = "none";
          };
        }
      }

      // Add styling for list items to preserve bullet points
      if (tagName === "li") {
        props.className = `${
          props.className || ""
        } flex items-baseline gap-1`.trim();
        props.style = { listStyleType: "disc", marginLeft: "1.5rem" };
      }

      // Handle other common HTML attributes
      const attributesToCopy = ["href", "target", "rel", "title"];
      attributesToCopy.forEach(attr => {
        const value = element.getAttribute(attr);
        if (value) props[attr] = value;
      });

      return React.createElement(tagName, props, ...children);
    }

    return null;
  };

  // Convert all child nodes
  const reactElements = Array.from(tempDiv.childNodes)
    .map((child, index) => convertNodeToReact(child, index))
    .filter((element) => element !== null);

  return <>{reactElements}</>;
};

// Helper function to parse inline CSS styles
const parseInlineStyle = (styleStr: string): React.CSSProperties => {
  const styles: React.CSSProperties = {};
  if (!styleStr) return styles;
  
  styleStr.split(';').forEach(style => {
    const colonIndex = style.indexOf(':');
    if (colonIndex > 0) {
      const property = style.slice(0, colonIndex).trim();
      const value = style.slice(colonIndex + 1).trim();
      
      // Convert CSS property names to camelCase for React
      const camelCaseProperty = property.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
      (styles as any)[camelCaseProperty] = value;
    }
  });
  
  return styles;
};

export const parseReadingTestContent = (
  html: string,
  userAnswers: UserAnswers,
  handlers: Handlers
): React.ReactNode => {
  if (!html) return null;

  const parts = html.split(BLOCK_SPLITTER_REGEX);

  return (
    <div className="space-y-4">
      {parts.map((part, index) => {
        const key = `part-${index}`;
        const trimmedPart = part.trim();

        // Case 1: True/False/Not Given Block (-$ ... -$)
        if (trimmedPart.startsWith("-$") && trimmedPart.endsWith("-$")) {
          const content = part.slice(
            part.indexOf("-$") + 2,
            part.lastIndexOf("-$")
          );
          const questions = content
            .split("@")
            .filter((q) => q.trim().length > 0);
          return (
            <div
              key={key}
              className="my-6 p-4 border rounded-lg bg-slate-50 dark:bg-slate-800 space-y-4"
            >
              {questions.map((q, qIndex) => {
                const qNum = extractQuestionNumber(q);
                if (!qNum) return null;
                const qid = `Q${qNum}`;
                const instructionText = html.includes("YES if the statement")
                  ? ["YES", "NO"]
                  : ["TRUE", "FALSE"];
                return (
                  <div
                    key={`${key}-q-${qIndex}`}
                    className="flex flex-col sm:flex-row sm:items-center gap-4 py-2 border-b last:border-b-0"
                  >
                    <div
                      className="flex-grow font-medium"
                      dangerouslySetInnerHTML={{ __html: q.trim() }}
                    />
                    <RadioGroup
                      onValueChange={(value) =>
                        handlers.handleRadioChange(qid, value)
                      }
                      value={userAnswers[qid] || ""}
                      className="flex space-x-2 shrink-0"
                    >
                      {[...instructionText, "NOT GIVEN"].map(
                        (label, rIndex) => (
                          <div
                            key={rIndex}
                            className="flex items-center space-x-1"
                          >
                            <RadioGroupItem
                              value={label.toUpperCase()}
                              id={`${qid}-${label}`}
                            />
                            <Label
                              htmlFor={`${qid}-${label}`}
                              className="text-sm"
                            >
                              {label}
                            </Label>
                          </div>
                        )
                      )}
                    </RadioGroup>
                  </div>
                );
              })}
            </div>
          );
        }

        // Case 2: Matching Block (-% ... %-) - Fixed to show each question on separate line
        if (trimmedPart.startsWith("-%") && trimmedPart.endsWith("-%")) {
          const content = part
            .slice(part.indexOf("-%") + 2, part.lastIndexOf("-%"))
            .replace(/<[^>]*>/g, ""); // Strip html tags

          // Split by @ and also by Q pattern to handle cases where @ might be missing
          let questions = content.split("@").filter((q) => q.trim());

          // If we only got one item, try splitting by Q pattern
          if (questions.length === 1) {
            questions = content.split(/(?=Q\d+)/).filter((q) => q.trim());
          }

          return (
            <div
              key={key}
              className="my-6 p-4 border rounded-lg bg-slate-50 dark:bg-slate-800 space-y-3"
            >
              {questions.map((q, qIndex) => {
                const qText = q.replace(/{}/g, "").trim();
                const qNum = extractQuestionNumber(qText);
                if (!qNum) return null;
                const qid = `Q${qNum}`;

                // Remove the Q number from the text since we'll display it separately
                const displayText = qText.replace(/^Q\d+\s*/, "").trim();

                return (
                  <div
                    key={`${key}-q-${qIndex}`}
                    className="flex items-center gap-3 py-1"
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <span className="font-semibold text-sm min-w-[2.5rem]">
                        {qid}
                      </span>
                      <span className="text-sm">{displayText}</span>
                    </div>
                    <input
                      id={qid}
                      type="text"
                      value={userAnswers[qid] || ""}
                      onChange={(e) =>
                        handlers.handleInputChange(
                          qid,
                          e.target.value.toLowerCase()
                        )
                      }
                      className="w-48 px-2 py-1 bg-transparent border-b border-gray-400 focus:outline-none focus:ring-0 focus:border-black dark:focus:border-white text-sm"
                      placeholder="Answer"
                    />
                  </div>
                );
              })}
            </div>
          );
        }

        // Case 3: Regular HTML content (now preserves bullet points, formatting, and images)
        return (
          <div
            key={key}
            className="prose dark:prose-invert max-w-none [&_ul]:list-disc [&_ul]:ml-6 [&_ol]:list-decimal [&_ol]:ml-6 [&_li]:mb-1"
          >
            {renderHtmlWithInputs(part, userAnswers, handlers)}
          </div>
        );
      })}
    </div>
  );
};