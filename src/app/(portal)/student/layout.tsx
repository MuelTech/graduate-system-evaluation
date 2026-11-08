"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChatbotWidget } from "@/components/chatbot/chatbot-widget";
import { signOut, useSession } from "next-auth/react";
import { NotificationBell } from "@/components/layout/notification-bell";
import { RoleSwitcherPill } from "@/components/evaluation/role-switcher-pill";
import { PageGuideTrigger } from "@/components/evaluation/page-guide-overlay";
import {
  LayoutDashboard,
  User,
  BookOpen,
  Milestone,
  FileText,
  Bell,
  GraduationCap,
  Menu,
  X,
  LogOut,
  ChevronLeft,
  ChevronDown,
  Megaphone,
  Library,
  CheckCircle2,
  CircleDot,
  Circle,
  Clock,
  LockOpen,
} from "lucide-react";
import { useStudentThesisJourney } from "@/hooks/use-student-thesis-journey";
import {
  JOURNEY_STEP_ORDER,
  journeyLabelFor,
  journeyRouteFor,
} from "@/lib/student-thesis-journey";
import type {
  JourneyStepKey,
  JourneyStepState,
  JourneyStepView,
} from "@/types/student-thesis-journey";

const topNavItems = [
  { href: "/student/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/student/profile", label: "Profile", icon: User },
  { href: "/student/curriculum", label: "Curriculum", icon: BookOpen },
  { href: "/student/journey", label: "Academic Journey", icon: Milestone },
];

const bottomNavItems = [
  { href: "/student/repository", label: "Repository", icon: Library },
  { href: "/student/announcements", label: "Announcements", icon: Megaphone },
  { href: "/student/notifications", label: "Notifications", icon: Bell },
];

function statusIcon(state: JourneyStepState | "LOADING" | "ERROR") {
  switch (state) {
    case "COMPLETED":
      return (
        <CheckCircle2 className="h-4 w-4 text-emerald-300" aria-hidden />
      );
    case "CURRENT":
      return (
        <CircleDot className="h-4 w-4 text-(--earist-accent)" aria-hidden />
      );
    case "AVAILABLE":
      return <Circle className="h-4 w-4 text-sky-300" aria-hidden />;
    case "WAITING":
      return <Clock className="h-4 w-4 text-amber-300" aria-hidden />;
    case "LOCKED":
      return <LockOpen className="h-3.5 w-3.5 text-amber-200/80" aria-hidden />;
    default:
      return (
        <Circle
          className="h-4 w-4 animate-pulse text-white/30"
          aria-hidden
        />
      );
  }
}

function statusExplanation(
  step: JourneyStepView | undefined,
  fallbackState: "LOADING" | "ERROR" = "LOADING",
): string {
  if (!step) {
    return fallbackState === "ERROR"
      ? "Unlocked for evaluation"
      : "Loading journey status";
  }
  switch (step.state) {
    case "COMPLETED":
      return "Completed (Click to evaluate)";
    case "CURRENT":
      return "Current step (Click to evaluate)";
    case "AVAILABLE":
      return "Available (Click to evaluate)";
    case "WAITING":
      return step.detail || step.lockReason || "Waiting (Unlocked for evaluation)";
    case "LOCKED":
      return `${step.label} — Unlocked in Evaluation Mode`;
    default:
      return step.label;
  }
}

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  // Default open so respondents immediately see all 5 unlocked Thesis Journey steps
  const [thesisOpen, setThesisOpen] = useState(true);
  const {
    data: journey,
    isLoading: journeyLoading,
    isError: journeyError,
  } = useStudentThesisJourney();
  void journeyLoading;

  const stepByKey = new Map<JourneyStepKey, JourneyStepView>(
    (journey?.steps ?? []).map((s) => [s.key, s]),
  );

  return (
    <div className="flex min-h-screen bg-(--earist-surface-gray)">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-(--earist-primary) transition-all duration-300 ${
          collapsed ? "w-17" : "w-65"
        } ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
          <Link href="/student/dashboard" className="flex items-center gap-2">
            <GraduationCap className="h-7 w-7 text-(--earist-accent)" />
            {!collapsed && (
              <div className="flex flex-col">
                <span className="text-sm leading-tight font-bold text-white">
                  EARIST
                </span>
                <span className="text-[10px] leading-tight text-white/80">
                  Student Portal
                </span>
              </div>
            )}
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-white hover:text-(--earist-accent) lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav
          data-guide="student-sidebar-nav"
          className="flex-1 overflow-y-auto px-2 py-4"
        >
          <ul className="space-y-1">
            {topNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-(--earist-accent) text-(--earist-primary)"
                        : "text-white hover:bg-white/10 hover:text-(--earist-accent)"
                    }`}
                    title={collapsed ? item.label : undefined}
                  >
                    <item.icon className="h-5 w-5 shrink-0" />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                </li>
              );
            })}

            {/* Thesis Journey parent & unlocked 5-step submenu */}
            <li data-guide="student-thesis-journey-menu">
              <div className="flex items-center">
                <Link
                  href="/student/thesis"
                  onClick={() => setSidebarOpen(false)}
                  className={`flex flex-1 items-center gap-3 rounded-l-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    pathname === "/student/thesis"
                      ? "bg-(--earist-accent) text-(--earist-primary)"
                      : pathname.startsWith("/student/thesis/")
                        ? "bg-white/15 text-(--earist-accent)"
                        : "text-white hover:bg-white/10 hover:text-(--earist-accent)"
                  }`}
                  title={collapsed ? "Thesis Journey" : undefined}
                >
                  <FileText className="h-5 w-5 shrink-0" />
                  {!collapsed && (
                    <span className="flex-1 text-left">Thesis Journey</span>
                  )}
                </Link>
                {!collapsed && (
                  <button
                    type="button"
                    aria-expanded={thesisOpen}
                    aria-label="Toggle Thesis Journey submenu"
                    onClick={() => setThesisOpen((v) => !v)}
                    className={`rounded-r-lg px-2.5 py-2.5 text-sm transition-colors ${
                      pathname === "/student/thesis"
                        ? "bg-(--earist-accent) text-(--earist-primary)"
                        : "text-white hover:bg-white/10 hover:text-(--earist-accent)"
                    }`}
                  >
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        thesisOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                )}
              </div>

              {!collapsed && thesisOpen && (
                <ul className="mt-1 ml-6 space-y-1 border-l border-white/10 pl-3">
                  {JOURNEY_STEP_ORDER.map((key) => {
                    const step = stepByKey.get(key);
                    const href = journeyRouteFor(key);
                    const label = journeyLabelFor(key, step?.label);
                    const isChildActive = pathname === href;
                    const isCurrent = step?.state === "CURRENT";
                    // Evaluation Mode: All 5 Thesis Journey steps are ALWAYS unlocked
                    const isNavigable = true;
                    const tip = statusExplanation(
                      step,
                      journeyError ? "ERROR" : "LOADING",
                    );
                    const stateForIcon: JourneyStepState | "LOADING" | "ERROR" =
                      step?.state ?? (journeyError ? "ERROR" : "COMPLETED");

                    void isNavigable;

                    return (
                      <li key={key}>
                        <Link
                          href={href}
                          title={tip}
                          onClick={() => setSidebarOpen(false)}
                          className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                            isChildActive
                              ? "bg-(--earist-accent) font-medium text-(--earist-primary)"
                              : isCurrent
                                ? "bg-white/10 font-medium text-white"
                                : "text-white/85 hover:bg-white/10 hover:text-(--earist-accent)"
                          }`}
                        >
                          <span className="flex items-center justify-between gap-2">
                            <span>{label}</span>
                            <span
                              title={tip}
                              aria-label={tip}
                              role="img"
                              className="rounded p-0.5"
                            >
                              {statusIcon(stateForIcon)}
                            </span>
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>

            {bottomNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-(--earist-accent) text-(--earist-primary)"
                        : "text-white hover:bg-white/10 hover:text-(--earist-accent)"
                    }`}
                    title={collapsed ? item.label : undefined}
                  >
                    <item.icon className="h-5 w-5 shrink-0" />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hidden border-t border-white/10 p-2 lg:block">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex w-full items-center justify-center rounded-lg p-2 text-white transition-colors hover:bg-white/10 hover:text-(--earist-accent)"
          >
            <ChevronLeft
              className={`h-5 w-5 transition-transform ${collapsed ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        <div className="border-t border-white/10 p-2">
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10 hover:text-(--earist-accent)"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!collapsed && <span>Switch Respondent Role</span>}
          </button>
        </div>
      </aside>

      <div
        className={`flex flex-1 flex-col transition-all duration-300 ${
          collapsed ? "lg:ml-17" : "lg:ml-65"
        }`}
      >
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-(--earist-border-gray) bg-white px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-(--earist-body-text) lg:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1
              className="text-lg font-bold text-(--earist-primary)"
              style={{ fontFamily: '"Calibri", sans-serif' }}
            >
              Student Portal
            </h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <PageGuideTrigger />
            <RoleSwitcherPill currentRole="student" />
            <NotificationBell role="STUDENT" />
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full bg-(--earist-primary) text-sm font-bold text-white uppercase"
              title={session?.user?.email || "Student"}
            >
              {session?.user?.email?.charAt(0).toUpperCase() || "J"}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>

      <ChatbotWidget />
    </div>
  );
}
