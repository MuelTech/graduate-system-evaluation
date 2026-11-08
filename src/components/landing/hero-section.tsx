"use client";

import Link from "next/link";
import {
  ChevronDown,
  GraduationCap,
  Presentation,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { setActiveEvaluationRole } from "@/lib/evaluation-session";

export function HeroSection() {
  return (
    <section className="relative flex min-h-150 items-center justify-center overflow-hidden bg-(--earist-primary)">
      {/* Background Image Placeholder with Maroon Gradient Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/campus-hero.jpg')",
        }}
      />
      <div className="absolute inset-0 bg-linear-to-b from-[#1a0a0a]/85 via-(--earist-primary)/75 to-(--earist-primary)/95" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 text-center sm:px-6 lg:px-8">
        {/* Evaluation Edition Badge */}
        <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-(--earist-accent)/60 bg-black/30 px-4 py-1.5 text-xs font-semibold tracking-wide text-(--earist-accent) backdrop-blur-xs">
          <Sparkles className="h-3.5 w-3.5" />
          UI/UX SYSTEM EVALUATION EDITION — INTERACTIVE RESPONDENT WALKTHROUGH
        </div>

        {/* Headline */}
        <h1 className="mx-auto mb-4 max-w-4xl text-4xl leading-tight font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Graduate School Information System
        </h1>

        {/* Sub-headline */}
        <p className="mx-auto mb-8 max-w-3xl text-lg text-white/85 italic sm:text-xl">
          Eulogio &quot;Amang&quot; Rodriguez Institute of Science and Technology
        </p>

        <p className="mx-auto mb-10 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">
          Welcome, Evaluator! Select a respondent role below to explore all
          unlocked Thesis Journey stages, interactive Scenario Switchers,
          Collaborative Defense Workspace tools, and guided coach-marks—no
          password required.
        </p>

        {/* Primary Respondent Entry CTA Buttons */}
        <div
          data-guide="hero-role-entry"
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link
            href="/student/dashboard"
            onClick={() => setActiveEvaluationRole("student")}
            className="inline-flex h-13 items-center justify-center gap-2.5 rounded-lg bg-(--earist-accent) px-7 text-base font-bold text-(--earist-primary) shadow-lg transition-all hover:scale-[1.02] hover:bg-(--earist-accent)/90"
          >
            <GraduationCap className="h-5 w-5" />
            Evaluate as Graduate Student
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/panelist/dashboard"
            onClick={() => setActiveEvaluationRole("panelist")}
            className="inline-flex h-13 items-center justify-center gap-2.5 rounded-lg border-2 border-white bg-white/10 px-7 text-base font-bold text-white shadow-lg backdrop-blur-xs transition-all hover:scale-[1.02] hover:bg-white hover:text-(--earist-primary)"
          >
            <Presentation className="h-5 w-5" />
            Evaluate as Faculty / Panelist
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-5">
          <Link
            href="/login"
            className="text-xs font-medium text-(--earist-accent) underline-offset-4 hover:underline"
          >
            Or open the Respondent Role Selector &amp; Evaluation Overview (/login) →
          </Link>
        </div>

        {/* Scroll Down Indicator */}
        <div className="mt-14 flex flex-col items-center">
          <span className="mb-2 text-sm text-white/60">Scroll Down</span>
          <ChevronDown className="h-6 w-6 animate-bounce text-white/60" />
        </div>
      </div>
    </section>
  );
}
