"use client";

import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Eye, Layers, Sparkles } from "lucide-react";
import {
  useScenario,
  type ScenarioOption,
  type ScenarioPageKey,
} from "@/lib/evaluation-mock/scenario-store";

export interface ScenarioSwitcherBarProps {
  pageKey: ScenarioPageKey;
  title?: string;
  helperText?: string;
  optionsOverride?: ScenarioOption[];
  compact?: boolean;
  className?: string;
  onScenarioChange?: (scenarioId: string) => void;
}

export function ScenarioSwitcherBar({
  pageKey,
  title = "Evaluation Scenario Preview:",
  helperText = "Switch between stages below to evaluate how this page looks at each point in the workflow.",
  optionsOverride,
  compact = false,
  className = "",
  onScenarioChange,
}: ScenarioSwitcherBarProps) {
  const queryClient = useQueryClient();
  const { scenario, setScenario, options: storeOptions } = useScenario(pageKey);

  const options = optionsOverride ?? storeOptions;
  const activeOption =
    options.find((opt) => opt.id === scenario) ?? options[0];

  const handleSelectScenario = (scenarioId: string) => {
    setScenario(scenarioId);
    onScenarioChange?.(scenarioId);
    void queryClient.invalidateQueries();
  };

  if (compact) {
    return (
      <div
        data-guide="scenario-switcher"
        className={`flex flex-wrap items-center justify-between gap-2 rounded-lg border border-(--earist-accent)/60 bg-amber-50/90 px-3 py-1.5 text-xs shadow-xs ${className}`}
      >
        <div className="flex items-center gap-1.5 font-semibold text-(--earist-primary)">
          <Eye className="h-3.5 w-3.5 text-(--earist-primary)" />
          <span>{title}</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {options.map((opt) => {
            const isActive = opt.id === scenario;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelectScenario(opt.id)}
                aria-pressed={isActive}
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-all ${
                  isActive
                    ? "bg-(--earist-primary) text-white shadow-xs ring-2 ring-(--earist-accent)/70"
                    : "border border-amber-300/80 bg-white text-slate-700 hover:border-(--earist-primary)/50 hover:bg-amber-100/50 hover:text-(--earist-primary)"
                }`}
              >
                <span>{opt.label}</span>
                {opt.badge && (
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[9px] font-bold uppercase tracking-wide ${
                      isActive
                        ? "bg-(--earist-accent) text-slate-950"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {opt.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <section
      data-guide="scenario-switcher"
      aria-label="Evaluation Scenario Switcher"
      className={`rounded-xl border border-(--earist-accent)/60 bg-amber-50/85 p-3.5 shadow-xs transition-all sm:p-4 ${className}`}
    >
      <div className="flex flex-col gap-3">
        {/* Top Row: Label + Active Stage Badge */}
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="flex items-start gap-2.5">
            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-(--earist-primary) text-(--earist-accent) shadow-xs">
              <Eye className="h-4 w-4" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-(--earist-primary)">
                  {title}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-(--earist-accent)/50 bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                  <Sparkles className="h-3 w-3 text-(--earist-accent)" />
                  Interactive Mode
                </span>
              </div>
              <p className="mt-0.5 text-xs text-slate-600">{helperText}</p>
            </div>
          </div>

          {activeOption?.badge && (
            <div className="hidden items-center gap-1.5 rounded-full bg-(--earist-primary)/10 px-2.5 py-1 text-[11px] font-semibold text-(--earist-primary) md:inline-flex">
              <Layers className="h-3.5 w-3.5" />
              <span>Active Stage: {activeOption.badge}</span>
            </div>
          )}
        </div>

        {/* Scenario Pill Buttons */}
        <div
          role="tablist"
          aria-label="Workflow stage scenarios"
          className="flex flex-wrap items-center gap-2"
        >
          {options.map((opt) => {
            const isActive = opt.id === scenario;
            return (
              <button
                key={opt.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => handleSelectScenario(opt.id)}
                className={`group inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-(--earist-primary) text-white shadow-sm ring-2 ring-(--earist-accent)"
                    : "border border-amber-300/90 bg-white text-slate-700 hover:border-(--earist-primary) hover:bg-amber-100/50 hover:text-(--earist-primary)"
                }`}
              >
                <span>{opt.label}</span>
                {opt.badge && (
                  <span
                    className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      isActive
                        ? "bg-(--earist-accent) text-slate-950"
                        : "bg-slate-100 text-slate-600 group-hover:bg-amber-200/60 group-hover:text-(--earist-primary)"
                    }`}
                  >
                    {opt.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Active Scenario Description Bar */}
        {activeOption?.description && (
          <div className="flex items-center gap-2 rounded-lg border border-amber-200/80 bg-white/85 px-3 py-2 text-xs text-slate-700">
            <span className="font-semibold text-(--earist-primary) shrink-0">
              Currently Showing:
            </span>
            <span>{activeOption.description}</span>
          </div>
        )}
      </div>
    </section>
  );
}
