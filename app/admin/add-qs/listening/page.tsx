// // "use client";

// // import { useState } from "react";
// // import { Input } from "@/components/ui/input";
// // import { Label } from "@/components/ui/label";
// // import { Button } from "@/components/ui/button";

// // export default function AdminListeningPage() {
// //   const [title, setTitle] = useState("");
// //   const [audio, setAudio] = useState<File | null>(null);
// //   const [sections, setSections] = useState([
// //     { start: 1, end: 10, image: null as File | null },
// //     { start: 11, end: 20, image: null as File | null },
// //     { start: 21, end: 30, image: null as File | null },
// //     { start: 31, end: 40, image: null as File | null },
// //   ]);
// //   const [answers, setAnswers] = useState<string[]>(Array(40).fill(""));
// //   const [loading, setLoading] = useState(false);
// //   const [status, setStatus] = useState<{
// //     type: "success" | "error";
// //     message: string;
// //   } | null>(null);

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     setStatus(null);

// //     // basic validation
// //     if (!title)
// //       return setStatus({ type: "error", message: "Title is required." });
// //     if (!audio)
// //       return setStatus({ type: "error", message: "Audio file is required." });
// //     if (sections.some((s) => !s.image)) {
// //       return setStatus({
// //         type: "error",
// //         message: "All 4 section images are required.",
// //       });
// //     }

// //     try {
// //       setLoading(true);
// //       const formData = new FormData();
// //       formData.append("title", title);
// //       formData.append("audio", audio);

// //       sections.forEach((sec, idx) => {
// //         formData.append(`sectionImage${idx + 1}`, sec.image!);
// //         formData.append(`sectionStart${idx + 1}`, String(sec.start));
// //         formData.append(`sectionEnd${idx + 1}`, String(sec.end));
// //       });

// //       answers.forEach((ans, idx) => {
// //         formData.append(`answer${idx + 1}`, ans); // supports "a/b/c" multi-answer
// //       });

// //       const res = await fetch("/api/listening", {
// //         method: "POST",
// //         body: formData,
// //       });
// //       if (!res.ok) {
// //         const err = await res.json().catch(() => ({}));
// //         throw new Error(err?.error || "Upload failed");
// //       }

// //       setStatus({
// //         type: "success",
// //         message: "Listening test uploaded successfully!",
// //       });
// //       // reset form
// //       setTitle("");
// //       setAudio(null);
// //       setSections([
// //         { start: 1, end: 10, image: null },
// //         { start: 11, end: 20, image: null },
// //         { start: 21, end: 30, image: null },
// //         { start: 31, end: 40, image: null },
// //       ]);
// //       setAnswers(Array(40).fill(""));
// //     } catch (e: any) {
// //       setStatus({
// //         type: "error",
// //         message: e.message || "Something went wrong.",
// //       });
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="max-w-5xl mx-auto p-6 space-y-8">
// //       <h1 className="text-3xl font-bold">Upload IELTS Listening Test</h1>

// //       <form onSubmit={handleSubmit} className="space-y-6">
// //         {/* Title */}
// //         <div className="space-y-2">
// //           <Label htmlFor="title">Test Title</Label>
// //           <Input
// //             id="title"
// //             value={title}
// //             onChange={(e) => setTitle(e.target.value)}
// //             required
// //           />
// //         </div>

// //         {/* Audio */}
// //         <div className="space-y-2">
// //           <Label htmlFor="audio">Audio File</Label>
// //           <Input
// //             id="audio"
// //             type="file"
// //             accept="audio/*"
// //             onChange={(e) => setAudio(e.target.files?.[0] || null)}
// //             required
// //           />
// //         </div>

// //         {/* Sections */}
// //         <div className="space-y-4">
// //           <h2 className="text-xl font-semibold">Sections</h2>
// //           {sections.map((sec, idx) => (
// //             <div key={idx} className="border p-4 rounded-md space-y-4">
// //               <h3 className="font-bold">Section {idx + 1}</h3>
// //               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
// //                 <div>
// //                   <Label htmlFor={`start-${idx}`}>Start Q#</Label>
// //                   <Input
// //                     id={`start-${idx}`}
// //                     type="number"
// //                     value={sec.start}
// //                     onChange={(e) => {
// //                       const s = [...sections];
// //                       s[idx].start = Number(e.target.value);
// //                       setSections(s);
// //                     }}
// //                     required
// //                   />
// //                 </div>
// //                 <div>
// //                   <Label htmlFor={`end-${idx}`}>End Q#</Label>
// //                   <Input
// //                     id={`end-${idx}`}
// //                     type="number"
// //                     value={sec.end}
// //                     onChange={(e) => {
// //                       const s = [...sections];
// //                       s[idx].end = Number(e.target.value);
// //                       setSections(s);
// //                     }}
// //                     required
// //                   />
// //                 </div>
// //                 <div>
// //                   <Label htmlFor={`img-${idx}`}>Section Image</Label>
// //                   <Input
// //                     id={`img-${idx}`}
// //                     type="file"
// //                     accept="image/*"
// //                     onChange={(e) => {
// //                       const s = [...sections];
// //                       s[idx].image = e.target.files?.[0] || null;
// //                       setSections(s);
// //                     }}
// //                     required
// //                   />
// //                 </div>
// //               </div>
// //             </div>
// //           ))}
// //         </div>

// //         {/* Answers */}
// //         <div>
// //           <h2 className="text-xl font-semibold mb-2">Answers</h2>
// //           <p className="text-sm text-muted-foreground mb-4">
// //             For multiple correct answers, separate with "/" (e.g.,{" "}
// //             <i>newspaper/newspapers</i>).
// //           </p>
// //           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
// //             {answers.map((ans, idx) => (
// //               <div key={idx} className="flex items-center gap-2">
// //                 <Label className="w-6">{idx + 1}.</Label>
// //                 <Input
// //                   value={ans}
// //                   onChange={(e) => {
// //                     const next = [...answers];
// //                     next[idx] = e.target.value;
// //                     setAnswers(next);
// //                   }}
// //                   placeholder="Answer"
// //                   autoComplete="off"
// //                   spellCheck={false}
// //                 />
// //               </div>
// //             ))}
// //           </div>
// //         </div>

// //         <Button type="submit" className="w-full" disabled={loading}>
// //           {loading ? "Uploading..." : "Upload Listening Test"}
// //         </Button>

// //         {status && (
// //           <div
// //             className={`mt-3 p-2 rounded ${
// //               status.type === "success"
// //                 ? "bg-green-100 text-green-700"
// //                 : "bg-red-100 text-red-700"
// //             }`}
// //           >
// //             {status.message}
// //           </div>
// //         )}
// //       </form>
// //     </div>
// //  );
// // }

// // app/admin/add-qs/listening/page.tsx
// // app/admin/add-qs/listening/page.tsx
// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { QuestionForm } from "@/components/custom/QuestionForm";
// // UI components for displaying alerts
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// type Question = {
//   type: string;
//   content: any;
//   correctAnswers: string[]; // Correctly defined as an array of strings
// };

// export default function AddListeningTestPage() {
//   // State variables for the test's basic information
//   const [title, setTitle] = useState("");
//   const [slug, setSlug] = useState("");
//   const [audioFile, setAudioFile] = useState<File | null>(null);

//   // State array to hold all the question objects for the test
//   const [questions, setQuestions] = useState<Question[]>([]);

//   // State for managing the form's submission process
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // State for alert notifications: stores the message and type ('success' or 'error')
//   const [alert, setAlert] = useState<{
//     type: "success" | "error" | null;
//     message: string | null;
//   }>({ type: null, message: null });

//   const router = useRouter();

//   // Function to add a new question to the 'questions' state array
//   const handleAddQuestion = (type: string) => {
//     let newQuestion: Question = { type: type, content: {}, correctAnswers: [] };

//     if (type === "fill-in-the-blank") {
//       newQuestion.content = { text: "" };
//       // The correctAnswers is already an array, so just update its value
//       newQuestion.correctAnswers = [""];
//     } else if (type === "multiple-choice") {
//       newQuestion.content = {
//         questionText: "",
//         options: [{ text: "" }],
//       };
//       // Assign an array here as well
//       newQuestion.correctAnswers = [""];
//     }

//     setQuestions([...questions, newQuestion]);
//   };

//   // Function to update an existing question in the 'questions' state array
//   const handleUpdateQuestion = (index: number, newQuestion: any) => {
//     const updatedQuestions = [...questions];
//     updatedQuestions[index] = newQuestion;
//     setQuestions(updatedQuestions);
//   };

//   // Function to delete a question from the 'questions' state array
//   const handleDeleteQuestion = (index: number) => {
//     const updatedQuestions = questions.filter((_, i) => i !== index);
//     setQuestions(updatedQuestions);
//   };

//   // Main form submission handler
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setAlert({ type: null, message: null }); // Clear any previous alerts at the start of submission

//     // Basic form validation to ensure all required fields are filled
//     if (!title || !slug || !audioFile || questions.length === 0) {
//       setAlert({
//         type: "error",
//         message: "Please fill in all fields and add at least one question.",
//       });
//       setIsSubmitting(false);
//       return;
//     }

//     // Simplified audio path handling. In a real-world app, you'd upload this file
//     // to a cloud storage service and get a URL back.
//     const audioPath = `/audio/${slug}.mp3`;

//     // Map the questions state to the format expected by the database schema.
//     // 'content' will hold the question text and options.
//     const content = questions.map((q) => ({
//       type: q.type,
//       content: q.content,
//     }));
//     // 'correctAnswers' will hold just the answer keys.
//     const correctAnswers = questions.map((q) => q.correctAnswers);

//     try {
//       // Send a POST request to your backend API route
//       const response = await fetch("/api/admin/listening", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           title,
//           slug,
//           audioPath,
//           content,
//           correctAnswers,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to create test");
//       }

//       // Set a success alert and redirect after a short delay
//       setAlert({
//         type: "success",
//         message: "Listening test created successfully!",
//       });
//       setTimeout(() => {
//         router.push("/admin/dashboard");
//       }, 2000);
//     } catch (error) {
//       // Set an error alert if the API call fails
//       setAlert({
//         type: "error",
//         message: "An unexpected error occurred. Please try again.",
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-8">
//       <h1 className="text-3xl font-bold mb-6">Create New Listening Test</h1>

//       {/* Conditionally render the alert component if an alert message exists */}
//       {alert.message && (
//         <Alert
//           className={`mb-4 ${
//             alert.type === "success"
//               ? "bg-green-100 text-green-700"
//               : "bg-red-100 text-red-700"
//           }`}
//         >
//           <AlertTitle>
//             {alert.type === "success" ? "Success" : "Error"}
//           </AlertTitle>
//           <AlertDescription>{alert.message}</AlertDescription>
//         </Alert>
//       )}

//       <form onSubmit={handleSubmit} className="space-y-8">
//         <div className="space-y-4 border p-6 rounded-md">
//           <h2 className="text-xl font-semibold">Test Details</h2>
//           {/* Input fields for basic test information */}
//           <div className="grid gap-2">
//             <Label htmlFor="title">Title</Label>
//             <Input
//               id="title"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               placeholder="e.g., IELTS Practice Test 1"
//             />
//           </div>
//           <div className="grid gap-2">
//             <Label htmlFor="slug">Slug (URL-friendly name)</Label>
//             <Input
//               id="slug"
//               value={slug}
//               onChange={(e) => setSlug(e.target.value)}
//               placeholder="e.g., practice-test-1"
//             />
//           </div>
//           <div className="grid gap-2">
//             <Label htmlFor="audio">Audio File (MP3)</Label>
//             <Input
//               id="audio"
//               type="file"
//               accept=".mp3"
//               onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
//             />
//           </div>
//         </div>

//         {/* Section for dynamically adding and rendering questions */}
//         <div className="space-y-4 border p-6 rounded-md">
//           <h2 className="text-xl font-semibold">Questions</h2>
//           {/* Map over the questions state and render a QuestionForm for each item */}
//           {questions.map((q, index) => (
//             <QuestionForm
//               key={index}
//               question={q}
//               onUpdate={handleUpdateQuestion}
//               onDelete={handleDeleteQuestion}
//               index={index}
//             />
//           ))}
//           {/* Buttons to add new question types */}
//           <div className="flex gap-4">
//             <Button
//               type="button"
//               onClick={() => handleAddQuestion("fill-in-the-blank")}
//               variant="outline"
//             >
//               Add Fill-in-the-Blank
//             </Button>
//             <Button
//               type="button"
//               onClick={() => handleAddQuestion("multiple-choice")}
//               variant="outline"
//             >
//               Add Multiple Choice
//             </Button>
//           </div>
//         </div>

//         {/* Submit button for the entire form */}
//         <Button type="submit" disabled={isSubmitting} className="w-full">
//           {isSubmitting ? "Creating..." : "Create Test"}
//         </Button>
//       </form>
//     </div>
//   );
// }

// app/admin/add-qs/listening/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import CKEditorWrapper from "@/components/custom/CKEditorWrapper"; // The wrapper you just created

export default function AddListeningTestPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [content, setContent] = useState(
    `<h2>Questions 1-6</h2><p>Write <strong>ONE WORD</strong> for each answer.</p><p>Address: 24 {} Road</p><p>Heard about company from: {}</p><h2>Questions 11-12</h2><p>Choose <strong>TWO</strong> letters A-E.</p><p>-[Which TWO facilities at the leisure club have recently been improved?@A. the gym@B. the tracks@C. the indoor pool-]</p><h2>Question 21</h2><p>-(Students entering the design competition have to@A. produce an energy-efficient design.@B. adapt an existing energy-saving appliance.@C. develop a new use for current technology.-)</p>`
  );
  const [answers, setAnswers] = useState<{ [key: string]: string }>({
    "1": "",
    "2": "",
  });

  const handleAnswerChange = (num: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [num]: value }));
  };

  const addAnswerField = () => {
    const nextKey = Object.keys(answers).length + 1;
    setAnswers((prev) => ({ ...prev, [String(nextKey)]: "" }));
  };

  const formatAnswersForSubmit = () => {
    const formatted: { [key: string]: string | string[] } = {};
    for (const key in answers) {
      const value = answers[key];
      if (value.includes("/")) {
        formatted[key] = value.split("/").map((s) => s.trim());
      } else {
        formatted[key] = value;
      }
    }
    return JSON.stringify(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug || !audioFile || !content) {
      alert("Please fill all fields");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("slug", slug);
    formData.append("audio", audioFile);
    formData.append("content", content);
    formData.append("answers", formatAnswersForSubmit());

    const res = await fetch("/api/listening", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      alert("Test created successfully!");
      router.push("/admin");
    } else {
      alert("Failed to create test.");
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Add New IELTS Listening Test</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Practice Test 1"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={slug}
            onChange={(e) =>
              setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))
            }
            placeholder="e.g., practice-test-1"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="audio">Audio File (MP3)</Label>
          <Input
            id="audio"
            type="file"
            accept="audio/mp3"
            onChange={(e) =>
              setAudioFile(e.target.files ? e.target.files[0] : null)
            }
          />
        </div>
        <div className="space-y-2">
          <Label>Questions & Content</Label>
          <p className="text-sm text-muted-foreground">
            Use {"{}"} for blanks, -[...] for multiple choice (use @ for
            options), and -(...) for single choice (use O for options).
          </p>
          <CKEditorWrapper value={content} onChange={setContent} />
        </div>

        <div className="space-y-4 rounded-md border p-4">
          <h3 className="font-semibold">Answers</h3>
          <p className="text-sm text-muted-foreground">
            For multiple possible answers, separate with a forward slash (e.g.,
            fish/fishes).
          </p>
          {Object.entries(answers).map(([key, value]) => (
            <div key={key} className="flex items-center gap-2">
              <Label
                htmlFor={`ans-${key}`}
                className="w-12"
              >{`Q ${key}:`}</Label>
              <Input
                id={`ans-${key}`}
                value={value}
                onChange={(e) => handleAnswerChange(key, e.target.value)}
              />
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addAnswerField}>
            Add Answer Field
          </Button>
        </div>

        <Button type="submit" size="lg">
          Create Test
        </Button>
      </form>
    </div>
  );
}
