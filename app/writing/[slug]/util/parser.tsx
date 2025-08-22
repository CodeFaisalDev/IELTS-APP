import React from "react";

/**
 * Simple parser for writing test content
 * Unlike reading tests, writing tests just need to render HTML content
 * No complex question parsing needed - just clean HTML rendering
 */

interface ParseWritingContentProps {
  html: string;
}

/**
 * Safely renders HTML content with proper styling
 * Ensures content is displayed with proper typography and spacing
 * Handles images and other media elements properly
 */
export const renderWritingContent = ({
  html,
}: ParseWritingContentProps): React.ReactNode => {
  if (!html) return null;

  // Clean and process the HTML
  const cleanHtml = sanitizeHtml(html);

  return (
    <div
      className="prose dark:prose-invert max-w-none 
                 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-4
                 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mb-3
                 [&_h3]:text-lg [&_h3]:font-medium [&_h3]:mb-2
                 [&_p]:mb-4 [&_p]:leading-relaxed
                 [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-4
                 [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-4
                 [&_li]:mb-1 [&_li]:leading-relaxed
                 [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:my-4 [&_img]:shadow-md
                 [&_table]:border-collapse [&_table]:border [&_table]:border-gray-300 [&_table]:w-full [&_table]:my-4
                 [&_th]:border [&_th]:border-gray-300 [&_th]:bg-gray-50 [&_th]:px-4 [&_th]:py-2 [&_th]:font-semibold
                 [&_td]:border [&_td]:border-gray-300 [&_td]:px-4 [&_td]:py-2
                 [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-4
                 [&_strong]:font-bold [&_em]:italic
                 [&_code]:bg-gray-100 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm
                 [&_pre]:bg-gray-100 [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:my-4
                 [&_figure]:my-4 [&_figcaption]:text-sm [&_figcaption]:text-gray-600 [&_figcaption]:text-center [&_figcaption]:mt-2"
      dangerouslySetInnerHTML={{ __html: cleanHtml }}
    />
  );
};

/**
 * Main parser function for writing test content
 * Takes HTML content and returns rendered React components
 */
export const parseWritingTestContent = (html: string): React.ReactNode => {
  if (!html || html.trim() === "") {
    return (
      <div className="text-center text-gray-500 py-8">
        <p>No content available for this section.</p>
      </div>
    );
  }

  return renderWritingContent({ html });
};

/**
 * Utility function to clean and sanitize HTML content
 * Removes potentially dangerous elements while preserving formatting
 */
export const sanitizeHtml = (html: string): string => {
  if (!html) return "";

  // Basic sanitization - remove script tags and other potentially dangerous elements
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "")
    .replace(/<embed\b[^<]*>/gi, "")
    .replace(/<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi, "");
};

/**
 * Helper function to extract text content from HTML
 * Useful for word counting or text analysis
 */
export const extractTextFromHtml = (html: string): string => {
  if (!html) return "";

  // Create a temporary div to parse HTML
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;

  return tempDiv.textContent || tempDiv.innerText || "";
};

/**
 * Helper function to estimate reading time
 * Assumes average reading speed of 200 words per minute
 */
export const estimateReadingTime = (html: string): number => {
  const text = extractTextFromHtml(html);
  const wordCount = text.split(/\s+/).filter((word) => word.length > 0).length;
  return Math.ceil(wordCount / 200); // Minutes
};

/**
 * Helper function to get word count from HTML content
 */
export const getWordCountFromHtml = (html: string): number => {
  const text = extractTextFromHtml(html);
  return text.split(/\s+/).filter((word) => word.length > 0).length;
};
