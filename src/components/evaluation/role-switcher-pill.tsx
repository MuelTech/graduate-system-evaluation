"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeftRight,
  GraduationCap,
  ShieldCheck,
  Home,
} from "lucide-react";
import {
  useEvaluationRole,
  type EvaluationRole,
} from "@/lib/evaluation-session";

export interface RoleSwitcherPillProps {
  currentRole?: EvaluationRole;
  compact?: boolean;
  showHomeLink?: boolean;
  className?: string;
}

export function RoleSwitcherPill({
  currentRole,
  compact = false,
  showHomeLink = true,
  className = "",
}: RoleSwitcherPillProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { role: storeRole, setRole } = useEvaluationRole();

  const activeRole: EvaluationRole = currentRole ?? storeRole;
  const isStudent = activeRole === "student";
  const targetRole: EvaluationRole = isStudent ? "panelist" : "student";
  const targetHref = isStudent ? "/panelist/dashboard" : "/student/dashboard";

  const handleSwitchRole = () => {
    setRole(targetRole);
    void queryClient.invalidateQueries();
    router.push(targetHref);
  };

  return (
    <div
      data-guide="role-switcher"
      className={`inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50/90 p-1 text-xs shadow-xs ${className}`}
    >
      {/* Active Respondent Persona Badge */}
      <div
        className="hidden items-center gap-1.5 rounded-full bg-white px-2.5 py-1 font-medium text-slate-700 shadow-2xs md:inline-flex"
        title={
          isStudent
            ? "Active Persona: Juan M. Dela Cruz (MAEd-AS Student)"
            : "Active Persona: Dr. Maria Clara R. Santos (Graduate Faculty / Panel Chair)"
        }
      >
        {isStudent ? (
          <GraduationCap className="h-3.5 w-3.5 text-(--earist-primary)" />
        ) : (
          <ShieldCheck className="h-3.5 w-3.5 text-(--earist-primary)" />
        )}
        <span className="text-[11px] text-slate-500">Viewing as:</span>
        <span className="text-[11px] font-bold text-(--earist-primary)">
          {isStudent ? "Student" : "Faculty / Panelist"}
        </span>
      </div>

      {/* 1-Click Switch Portal Button */}
      <button
        type="button"
        onClick={handleSwitchRole}
        className="inline-flex items-center gap-1.5 rounded-full bg-(--earist-primary) px-3 py-1 text-[11px] font-semibold text-white shadow-2xs transition-all hover:bg-(--earist-secondary) cursor-pointer"
        title={
          isStudent
            ? "Switch to Faculty / Panelist Portal (Dr. Maria Clara R. Santos)"
            : "Switch to Graduate Student Portal (Juan M. Dela Cruz)"
        }
      >
        <ArrowLeftRight className="h-3 w-3 text-(--earist-accent)" />
        <span>
          {compact
            ? isStudent
              ? "Faculty View"
              : "Student View"
            : isStudent
              ? "Switch to Faculty View"
              : "Switch to Student View"}
        </span>
      </button>

      {/* Quick Return to Role Selector (/login) */}
      {showHomeLink && !compact && (
        <Link
          href="/login"
          className="hidden items-center gap-1 rounded-full px-2 py-1 text-[11px] font-medium text-slate-600 transition-colors hover:bg-slate-200/70 hover:text-slate-900 lg:inline-flex"
          title="Return to Evaluation Role Selector"
        >
          <Home className="h-3 w-3" />
          <span>Roles</span>
        </Link>
      )}
    </div>
  );
}
