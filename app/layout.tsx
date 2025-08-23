import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/custom/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/custom/Navbar";
import ClientFooter from "@/components/custom/ClientFooter";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IELTS Practice App",
  description: "AI-powered IELTS preparation for Bangladeshi students",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex min-h-screen flex-col bg-gray-100 dark:bg-gray-900">
            {/* Header with new Navbar component */}
            <Navbar />

            {/* Main Content */}
            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </main>

            {/* Toaster */}
            <Toaster />

            {/* Footer */}
            <ClientFooter />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
