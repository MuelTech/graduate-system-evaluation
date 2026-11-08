"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, GraduationCap, Presentation, UserCheck } from "lucide-react";
import { setActiveEvaluationRole } from "@/lib/evaluation-session";
import { PageGuideTrigger } from "@/components/evaluation/page-guide-overlay";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/programs", label: "Programs" },
  { href: "/repository", label: "Research Repository" },
  { href: "/faq", label: "FAQ" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-(--earist-border-gray) bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <GraduationCap className="h-8 w-8 text-(--earist-primary)" />
          <div className="flex flex-col">
            <span className="text-lg leading-tight font-bold text-(--earist-primary)">
              EARIST
            </span>
            <span className="text-xs leading-tight text-(--earist-secondary)">
              Graduate School
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-(--earist-body-text) transition-colors hover:text-(--earist-primary)"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA Buttons */}
        <div
          data-guide="public-navbar-ctas"
          className="hidden md:flex md:items-center md:gap-2.5"
        >
          <PageGuideTrigger compact />
          <Link
            href="/student/dashboard"
            onClick={() => setActiveEvaluationRole("student")}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-(--earist-accent) px-4 text-xs font-semibold text-(--earist-primary) transition-colors hover:bg-(--earist-accent)/90"
          >
            <GraduationCap className="h-4 w-4" />
            Student View
          </Link>
          <Link
            href="/panelist/dashboard"
            onClick={() => setActiveEvaluationRole("panelist")}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border-2 border-(--earist-primary) px-4 text-xs font-semibold text-(--earist-primary) transition-colors hover:bg-(--earist-primary) hover:text-white"
          >
            <Presentation className="h-4 w-4" />
            Faculty / Panelist View
          </Link>
          <Link
            href="/login"
            className="inline-flex h-9 items-center justify-center gap-1 rounded-lg bg-(--earist-surface-gray) px-3 text-xs font-medium text-(--earist-body-text) transition-colors hover:text-(--earist-primary)"
          >
            <UserCheck className="h-3.5 w-3.5" />
            Role Selector
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <X className="h-6 w-6 text-(--earist-primary)" />
          ) : (
            <Menu className="h-6 w-6 text-(--earist-primary)" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="border-t border-(--earist-border-gray) bg-white md:hidden">
          <div className="container mx-auto space-y-1 px-4 pt-2 pb-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded-md px-3 py-2 text-sm font-medium text-(--earist-body-text) transition-colors hover:bg-(--earist-surface-light-red) hover:text-(--earist-primary)"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-2">
              <Link
                href="/student/dashboard"
                onClick={() => {
                  setActiveEvaluationRole("student");
                  setIsOpen(false);
                }}
                className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-(--earist-accent) px-5 text-sm font-semibold text-(--earist-primary)"
              >
                <GraduationCap className="h-4 w-4" />
                Evaluate as Student
              </Link>
              <Link
                href="/panelist/dashboard"
                onClick={() => {
                  setActiveEvaluationRole("panelist");
                  setIsOpen(false);
                }}
                className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border-2 border-(--earist-primary) px-5 text-sm font-semibold text-(--earist-primary)"
              >
                <Presentation className="h-4 w-4" />
                Evaluate as Faculty / Panelist
              </Link>
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="inline-flex h-9 items-center justify-center rounded-lg bg-(--earist-surface-gray) px-5 text-sm font-medium text-(--earist-body-text)"
              >
                Role Selector (/login)
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
