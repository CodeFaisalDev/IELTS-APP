"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "./theme-toggle";
import {
  Menu,
  User,
  BookOpen,
  FileText,
  Info,
  GraduationCap,
  HeartHandshake,
  Glasses,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const navLinks = [
  { name: "Practice", href: "/", icon: BookOpen },
  { name: "Blogs", href: "/blogs", icon: FileText },
  { name: "Privacy Policy", href: "/privacy-policy", icon: Glasses },
  { name: "Terms and Service", href: "/terms", icon: HeartHandshake },
  { name: "About Us", href: "/about", icon: Info },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* Logo and Site Name */}
        <div className="flex items-center space-x-2">
          <GraduationCap className="h-7 w-7 text-primary" />
          <Link href="/">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
              Take IELTS.IO
            </h1>
          </Link>
        </div>

        {/* Desktop Navigation Links with Icons and Active State */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`
                  flex items-center space-x-2
                  text-sm font-medium
                  transition-colors
                  ${
                    isActive
                      ? "text-primary dark:text-primary-foreground font-semibold"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                  }
                `}
              >
                <link.icon className="h-4 w-4" />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Icons (Mobile & Desktop) */}
        <div className="flex items-center space-x-4">
          {/* User Profile Placeholder */}
          <Avatar className="h-8 w-8 cursor-pointer border border-gray-200 dark:border-gray-700">
            <AvatarFallback className="bg-gray-100 dark:bg-gray-800">
              <User className="h-5 w-5 text-gray-500" />
            </AvatarFallback>
          </Avatar>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Mobile Menu Button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <button
                className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6 text-gray-800 dark:text-gray-200" />
              </button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700"
            >
              <SheetHeader className="mb-8">
                <SheetTitle className="text-center text-xl font-bold text-gray-900 dark:text-gray-100">
                  Menu
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col items-start space-y-4">
                {/* User Profile in Mobile Menu */}
                <div className="flex items-center space-x-4 mb-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      <User className="h-6 w-6 text-gray-500" />
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    User Profile
                  </span>
                </div>
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-3 w-full p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
                  >
                    <link.icon className="h-5 w-5" />
                    <span>{link.name}</span>
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
