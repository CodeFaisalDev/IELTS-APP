import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/custom/theme-provider";
import { ThemeToggle } from "@/components/custom/theme-toggle";
import { Toaster } from "@/components/ui/sonner";

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
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex min-h-screen flex-col">
            <header className="border-b p-4 flex justify-between items-center">
              <h1 className="text-xl font-bold">IELTS Practice App</h1>
              <ThemeToggle />
            </header>
            <main className="flex-1 p-4">{children}</main>
            <Toaster />
            <footer className="border-t p-4 text-center text-sm">
              © {new Date().getFullYear()} IELTS Practice App
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
