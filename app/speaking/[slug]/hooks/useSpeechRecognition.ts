// hooks/use-speech-recognition.ts
"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// Define the interface for the SpeechRecognition API
interface ISpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((this: ISpeechRecognition, ev: any) => any) | null;
  onerror: ((this: ISpeechRecognition, ev: any) => any) | null;
  onend: ((this: ISpeechRecognition, ev: Event) => any) | null;
}

// Extend the Window interface
declare global {
  interface Window {
    SpeechRecognition: { new (): ISpeechRecognition };
    webkitSpeechRecognition: { new (): ISpeechRecognition };
  }
}

export const useSpeechRecognition = () => {
  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  // Ref to track if the stop was intentional (user-triggered)
  const stopListeningRef = useRef(false);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result) => result.transcript)
          .join("");
        setText(transcript);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
      };

      // This is the key change: handle automatic stops
      recognition.onend = () => {
        // If the stop was not intentional and we are still in "listening" mode, restart it
        if (!stopListeningRef.current) {
          recognition.start(); // Restart listening
        } else {
          setIsListening(false);
        }
      };

      recognitionRef.current = recognition;
    } else {
      setIsSupported(false);
    }
  }, []);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      setText(""); // Clear previous text
      stopListeningRef.current = false; // Set intent to "not stop"
      recognitionRef.current.start();
      setIsListening(true);
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      stopListeningRef.current = true; // Set intent to "stop"
      recognitionRef.current.stop();
      // onend will handle setting isListening to false
    }
  }, [isListening]);

  return { text, isListening, isSupported, startListening, stopListening };
};
