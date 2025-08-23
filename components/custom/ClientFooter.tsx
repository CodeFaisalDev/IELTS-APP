// Create a ClientFooter component
"use client";
import { useEffect, useState } from "react";

const ClientFooter = () => {
  const [year, setYear] = useState("");

  useEffect(() => {
    setYear(new Date().getFullYear().toString());
  }, []);

  return (
    <footer className="w-full bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-sm text-gray-600 dark:text-gray-400">
        © {year || "2024"} IELTS Practice App. All rights reserved.
      </div>
    </footer>
  );
};

export default ClientFooter;
