"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { usePathname } from "next/navigation";
import {
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
  CheckCircle2,
  Compass,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getRouteGuideConfig,
  type GuidePlacement,
  type GuideStep,
  type RouteGuideConfig,
} from "@/lib/evaluation-mock/guide-definitions";

interface GuideStoreState {
  isOpen: boolean;
  stepIndex: number;
  customSteps: GuideStep[] | null;
}

let guideState: GuideStoreState = {
  isOpen: false,
  stepIndex: 0,
  customSteps: null,
};

const listeners = new Set<() => void>();

function notifyGuideListeners() {
  for (const listener of listeners) {
    listener();
  }
}

function subscribeGuide(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getGuideSnapshot(): GuideStoreState {
  return guideState;
}

const SERVER_SNAPSHOT: GuideStoreState = {
  isOpen: false,
  stepIndex: 0,
  customSteps: null,
};

export function openPageGuide(customSteps?: GuideStep[], startIndex = 0) {
  guideState = {
    isOpen: true,
    stepIndex: startIndex,
    customSteps: customSteps ?? null,
  };
  notifyGuideListeners();
}

export function closePageGuide() {
  if (!guideState.isOpen) return;
  guideState = {
    ...guideState,
    isOpen: false,
  };
  notifyGuideListeners();
}

export function setPageGuideStep(nextIndex: number) {
  guideState = {
    ...guideState,
    stepIndex: Math.max(0, nextIndex),
  };
  notifyGuideListeners();
}

interface PageGuideContextValue {
  isOpen: boolean;
  stepIndex: number;
  routeConfig: RouteGuideConfig;
  activeSteps: GuideStep[];
  openGuide: (steps?: GuideStep[]) => void;
  closeGuide: () => void;
  nextStep: () => void;
  prevStep: () => void;
}

const PageGuideContext = createContext<PageGuideContextValue | null>(null);

export function usePageGuide(): PageGuideContextValue {
  const ctx = useContext(PageGuideContext);
  const pathname = usePathname();
  const state = useSyncExternalStore(
    subscribeGuide,
    getGuideSnapshot,
    () => SERVER_SNAPSHOT,
  );

  const routeConfig = useMemo(() => getRouteGuideConfig(pathname), [pathname]);
  const activeSteps = state.customSteps ?? routeConfig.steps;

  const openGuide = useCallback((steps?: GuideStep[]) => {
    openPageGuide(steps, 0);
  }, []);

  const closeGuide = useCallback(() => {
    closePageGuide();
  }, []);

  const nextStep = useCallback(() => {
    if (state.stepIndex + 1 >= activeSteps.length) {
      closePageGuide();
    } else {
      setPageGuideStep(state.stepIndex + 1);
    }
  }, [state.stepIndex, activeSteps.length]);

  const prevStep = useCallback(() => {
    if (state.stepIndex > 0) {
      setPageGuideStep(state.stepIndex - 1);
    }
  }, [state.stepIndex]);

  if (ctx) return ctx;

  return {
    isOpen: state.isOpen,
    stepIndex: state.stepIndex,
    routeConfig,
    activeSteps,
    openGuide,
    closeGuide,
    nextStep,
    prevStep,
  };
}

export function PageGuideProvider({
  children,
  includeOverlay = true,
}: {
  children: React.ReactNode;
  includeOverlay?: boolean;
}) {
  const pathname = usePathname();
  const state = useSyncExternalStore(
    subscribeGuide,
    getGuideSnapshot,
    () => SERVER_SNAPSHOT,
  );

  const routeConfig = useMemo(() => getRouteGuideConfig(pathname), [pathname]);
  const activeSteps = state.customSteps ?? routeConfig.steps;

  // Close guide when route changes
  useEffect(() => {
    closePageGuide();
  }, [pathname]);

  const openGuide = useCallback((steps?: GuideStep[]) => {
    openPageGuide(steps, 0);
  }, []);

  const closeGuide = useCallback(() => {
    closePageGuide();
  }, []);

  const nextStep = useCallback(() => {
    if (state.stepIndex + 1 >= activeSteps.length) {
      closePageGuide();
    } else {
      setPageGuideStep(state.stepIndex + 1);
    }
  }, [state.stepIndex, activeSteps.length]);

  const prevStep = useCallback(() => {
    if (state.stepIndex > 0) {
      setPageGuideStep(state.stepIndex - 1);
    }
  }, [state.stepIndex]);

  const value = useMemo<PageGuideContextValue>(
    () => ({
      isOpen: state.isOpen,
      stepIndex: state.stepIndex,
      routeConfig,
      activeSteps,
      openGuide,
      closeGuide,
      nextStep,
      prevStep,
    }),
    [
      state.isOpen,
      state.stepIndex,
      routeConfig,
      activeSteps,
      openGuide,
      closeGuide,
      nextStep,
      prevStep,
    ],
  );

  return (
    <PageGuideContext.Provider value={value}>
      {children}
      {includeOverlay && <PageGuideOverlay />}
    </PageGuideContext.Provider>
  );
}

export function PageGuideTrigger({
  className = "",
  label = "Page Guide",
  compact = false,
}: {
  className?: string;
  label?: string;
  compact?: boolean;
}) {
  const { openGuide, isOpen } = usePageGuide();

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={() => openGuide()}
      data-guide="page-guide-trigger"
      aria-label="Open interactive page guide"
      className={`group relative inline-flex items-center gap-1.5 rounded-full border-(--earist-accent)/70 bg-amber-50/90 px-3 py-1.5 text-xs font-semibold text-(--earist-primary) shadow-xs transition-all hover:border-(--earist-primary) hover:bg-(--earist-primary) hover:text-white ${
        isOpen ? "ring-2 ring-(--earist-accent)" : ""
      } ${className}`}
    >
      <HelpCircle className="h-3.5 w-3.5 text-(--earist-primary) transition-colors group-hover:text-(--earist-accent)" />
      <span>{compact ? "Guide" : label}</span>
      <span className="hidden rounded-full bg-(--earist-primary)/10 px-1.5 py-0.2 text-[10px] font-bold text-(--earist-primary) group-hover:bg-white/20 group-hover:text-white sm:inline-block">
        Tour
      </span>
    </Button>
  );
}

interface TargetRect {
  top: number;
  left: number;
  width: number;
  height: number;
  bottom: number;
  right: number;
}

const CARD_WIDTH = 380;
const CARD_ESTIMATED_HEIGHT = 250;
const SPOTLIGHT_PADDING = 8;
const CARD_GAP = 28;

function resolveTargetElement(selectorList: string): Element | null {
  if (typeof document === "undefined" || !selectorList) return null;
  const selectors = selectorList
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  for (const sel of selectors) {
    try {
      const el = document.querySelector(sel);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          return el;
        }
      }
    } catch {
      // Ignore invalid selector syntax
    }
  }
  return null;
}

function computeCardAndArrowGeometry(
  targetRect: TargetRect | null,
  preferredPlacement: GuidePlacement = "bottom",
  viewportW: number,
  viewportH: number,
): {
  cardTop: number;
  cardLeft: number;
  resolvedPlacement: GuidePlacement;
  arrowStart: { x: number; y: number } | null;
  arrowEnd: { x: number; y: number } | null;
  arrowControl: { x: number; y: number } | null;
} {
  if (!targetRect || viewportW === 0 || viewportH === 0) {
    return {
      cardTop: Math.max(24, viewportH / 2 - CARD_ESTIMATED_HEIGHT / 2),
      cardLeft: Math.max(16, viewportW / 2 - CARD_WIDTH / 2),
      resolvedPlacement: "bottom",
      arrowStart: null,
      arrowEnd: null,
      arrowControl: null,
    };
  }

  const effectiveCardWidth = Math.min(CARD_WIDTH, viewportW - 32);
  const targetCenterX = targetRect.left + targetRect.width / 2;
  const targetCenterY = targetRect.top + targetRect.height / 2;

  // Determine best placement with available viewport space
  let placement: GuidePlacement = preferredPlacement;
  const spaceBottom = viewportH - targetRect.bottom;
  const spaceTop = targetRect.top;
  const spaceRight = viewportW - targetRect.right;
  const spaceLeft = targetRect.left;

  if (
    placement === "bottom" &&
    spaceBottom < CARD_ESTIMATED_HEIGHT + CARD_GAP &&
    spaceTop > spaceBottom
  ) {
    placement = "top";
  } else if (
    placement === "top" &&
    spaceTop < CARD_ESTIMATED_HEIGHT + CARD_GAP &&
    spaceBottom > spaceTop
  ) {
    placement = "bottom";
  } else if (
    placement === "right" &&
    spaceRight < effectiveCardWidth + CARD_GAP
  ) {
    placement = spaceBottom >= spaceTop ? "bottom" : "top";
  } else if (
    placement === "left" &&
    spaceLeft < effectiveCardWidth + CARD_GAP
  ) {
    placement = spaceBottom >= spaceTop ? "bottom" : "top";
  }

  let cardTop = 24;
  let cardLeft = 16;
  let arrowStart = { x: 0, y: 0 };
  let arrowEnd = { x: 0, y: 0 };

  if (placement === "bottom") {
    cardTop = Math.min(
      viewportH - CARD_ESTIMATED_HEIGHT - 16,
      targetRect.bottom + SPOTLIGHT_PADDING + CARD_GAP,
    );
    cardLeft = Math.max(
      16,
      Math.min(
        viewportW - effectiveCardWidth - 16,
        targetCenterX - effectiveCardWidth / 2,
      ),
    );
    arrowStart = {
      x: Math.max(
        cardLeft + 32,
        Math.min(cardLeft + effectiveCardWidth - 32, targetCenterX),
      ),
      y: cardTop - 4,
    };
    arrowEnd = {
      x: targetCenterX,
      y: targetRect.bottom + SPOTLIGHT_PADDING + 4,
    };
  } else if (placement === "top") {
    cardTop = Math.max(
      16,
      targetRect.top - SPOTLIGHT_PADDING - CARD_GAP - CARD_ESTIMATED_HEIGHT,
    );
    cardLeft = Math.max(
      16,
      Math.min(
        viewportW - effectiveCardWidth - 16,
        targetCenterX - effectiveCardWidth / 2,
      ),
    );
    arrowStart = {
      x: Math.max(
        cardLeft + 32,
        Math.min(cardLeft + effectiveCardWidth - 32, targetCenterX),
      ),
      y: cardTop + CARD_ESTIMATED_HEIGHT - 12,
    };
    arrowEnd = {
      x: targetCenterX,
      y: targetRect.top - SPOTLIGHT_PADDING - 4,
    };
  } else if (placement === "right") {
    cardLeft = Math.min(
      viewportW - effectiveCardWidth - 16,
      targetRect.right + SPOTLIGHT_PADDING + CARD_GAP,
    );
    cardTop = Math.max(
      16,
      Math.min(
        viewportH - CARD_ESTIMATED_HEIGHT - 16,
        targetCenterY - CARD_ESTIMATED_HEIGHT / 2,
      ),
    );
    arrowStart = {
      x: cardLeft - 4,
      y: Math.max(
        cardTop + 32,
        Math.min(cardTop + CARD_ESTIMATED_HEIGHT - 32, targetCenterY),
      ),
    };
    arrowEnd = {
      x: targetRect.right + SPOTLIGHT_PADDING + 4,
      y: targetCenterY,
    };
  } else {
    // left
    cardLeft = Math.max(
      16,
      targetRect.left - SPOTLIGHT_PADDING - CARD_GAP - effectiveCardWidth,
    );
    cardTop = Math.max(
      16,
      Math.min(
        viewportH - CARD_ESTIMATED_HEIGHT - 16,
        targetCenterY - CARD_ESTIMATED_HEIGHT / 2,
      ),
    );
    arrowStart = {
      x: cardLeft + effectiveCardWidth + 4,
      y: Math.max(
        cardTop + 32,
        Math.min(cardTop + CARD_ESTIMATED_HEIGHT - 32, targetCenterY),
      ),
    };
    arrowEnd = {
      x: targetRect.left - SPOTLIGHT_PADDING - 4,
      y: targetCenterY,
    };
  }

  const arrowControl = {
    x: (arrowStart.x + arrowEnd.x) / 2,
    y:
      placement === "bottom" || placement === "top"
        ? (arrowStart.y + arrowEnd.y) / 2
        : arrowStart.y,
  };

  return {
    cardTop,
    cardLeft,
    resolvedPlacement: placement,
    arrowStart,
    arrowEnd,
    arrowControl,
  };
}

let mountedOverlayId: string | null = null;

export function PageGuideOverlay() {
  const instanceId = useId();
  const [isPrimaryInstance, setIsPrimaryInstance] = useState(false);
  const {
    isOpen,
    stepIndex,
    routeConfig,
    activeSteps,
    closeGuide,
    nextStep,
    prevStep,
  } = usePageGuide();

  const [targetRect, setTargetRect] = useState<TargetRect | null>(null);
  const [viewport, setViewport] = useState<{ w: number; h: number }>({
    w: 1280,
    h: 800,
  });

  // Prevent duplicate overlays if mounted in both root provider and portal layout
  useEffect(() => {
    if (!mountedOverlayId) {
      mountedOverlayId = instanceId;
      setIsPrimaryInstance(true);
    } else if (mountedOverlayId === instanceId) {
      setIsPrimaryInstance(true);
    }
    return () => {
      if (mountedOverlayId === instanceId) {
        mountedOverlayId = null;
      }
    };
  }, [instanceId]);

  const currentStep: GuideStep | undefined =
    activeSteps[Math.min(stepIndex, Math.max(0, activeSteps.length - 1))];

  const updateMeasurement = useCallback(() => {
    if (typeof window === "undefined" || !isOpen || !currentStep) return;
    setViewport({ w: window.innerWidth, h: window.innerHeight });

    const el = resolveTargetElement(currentStep.targetSelector);
    if (!el) {
      setTargetRect(null);
      return;
    }
    const r = el.getBoundingClientRect();
    setTargetRect({
      top: r.top,
      left: r.left,
      width: r.width,
      height: r.height,
      bottom: r.bottom,
      right: r.right,
    });
  }, [isOpen, currentStep]);

  // Scroll target into view when step changes
  useEffect(() => {
    if (typeof window === "undefined" || !isOpen || !currentStep) return;
    const el = resolveTargetElement(currentStep.targetSelector);
    if (el) {
      const rect = el.getBoundingClientRect();
      const inView =
        rect.top >= 60 &&
        rect.bottom <= window.innerHeight - 60 &&
        rect.left >= 0 &&
        rect.right <= window.innerWidth;
      if (!inView) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
    const initialTimer = window.setTimeout(updateMeasurement, 80);
    const settleTimer = window.setTimeout(updateMeasurement, 360);
    return () => {
      window.clearTimeout(initialTimer);
      window.clearTimeout(settleTimer);
    };
  }, [isOpen, currentStep, stepIndex, updateMeasurement]);

  // Listen to scroll, resize, and Escape key while open
  useEffect(() => {
    if (typeof window === "undefined" || !isOpen) return;
    updateMeasurement();

    const handleScrollOrResize = () => {
      updateMeasurement();
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeGuide();
      } else if (e.key === "ArrowRight") {
        nextStep();
      } else if (e.key === "ArrowLeft") {
        prevStep();
      }
    };

    window.addEventListener("resize", handleScrollOrResize);
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("resize", handleScrollOrResize);
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, updateMeasurement, closeGuide, nextStep, prevStep]);

  if (!isPrimaryInstance || !isOpen || !currentStep) {
    return null;
  }

  const totalSteps = activeSteps.length;
  const isLastStep = stepIndex + 1 >= totalSteps;

  const { cardTop, cardLeft, arrowStart, arrowEnd, arrowControl } =
    computeCardAndArrowGeometry(
      targetRect,
      currentStep.placement ?? "bottom",
      viewport.w,
      viewport.h,
    );

  const maskId = `earist-guide-spotlight-${instanceId.replace(/:/g, "")}`;
  const arrowMarkerId = `earist-guide-arrow-${instanceId.replace(/:/g, "")}`;

  const cutoutX = targetRect
    ? Math.max(4, targetRect.left - SPOTLIGHT_PADDING)
    : 0;
  const cutoutY = targetRect
    ? Math.max(4, targetRect.top - SPOTLIGHT_PADDING)
    : 0;
  const cutoutW = targetRect ? targetRect.width + SPOTLIGHT_PADDING * 2 : 0;
  const cutoutH = targetRect ? targetRect.height + SPOTLIGHT_PADDING * 2 : 0;

  return (
    <div
      className="fixed inset-0 z-[9999] pointer-events-auto"
      role="dialog"
      aria-modal="true"
      aria-label={routeConfig.pageTitle}
    >
      {/* SVG Backdrop with Spotlight Cutout & Directional Arrow */}
      <svg
        className="fixed inset-0 h-full w-full pointer-events-none"
        width={viewport.w}
        height={viewport.h}
        viewBox={`0 0 ${viewport.w} ${viewport.h}`}
      >
        <defs>
          <mask id={maskId}>
            <rect x="0" y="0" width={viewport.w} height={viewport.h} fill="white" />
            {targetRect && (
              <rect
                x={cutoutX}
                y={cutoutY}
                width={cutoutW}
                height={cutoutH}
                rx="12"
                ry="12"
                fill="black"
              />
            )}
          </mask>
          <marker
            id={arrowMarkerId}
            markerWidth="10"
            markerHeight="10"
            refX="7"
            refY="5"
            orient="auto"
          >
            <path d="M 0 1 L 9 5 L 0 9 z" fill="#D4A548" />
          </marker>
        </defs>

        {/* Semi-transparent dark backdrop */}
        <rect
          x="0"
          y="0"
          width={viewport.w}
          height={viewport.h}
          fill="rgba(15, 23, 42, 0.52)"
          mask={`url(#${maskId})`}
          className="pointer-events-auto cursor-pointer"
          onClick={closeGuide}
        />

        {/* Directional Curved Arrow from Coach-Mark Card to Target */}
        {targetRect && arrowStart && arrowEnd && arrowControl && (
          <g>
            <path
              d={`M ${arrowStart.x} ${arrowStart.y} Q ${arrowControl.x} ${arrowControl.y} ${arrowEnd.x} ${arrowEnd.y}`}
              fill="none"
              stroke="#7A1315"
              strokeWidth="5"
              strokeLinecap="round"
              opacity="0.35"
            />
            <path
              d={`M ${arrowStart.x} ${arrowStart.y} Q ${arrowControl.x} ${arrowControl.y} ${arrowEnd.x} ${arrowEnd.y}`}
              fill="none"
              stroke="#D4A548"
              strokeWidth="3"
              strokeDasharray="6 4"
              strokeLinecap="round"
              markerEnd={`url(#${arrowMarkerId})`}
            />
            <circle
              cx={arrowStart.x}
              cy={arrowStart.y}
              r="4.5"
              fill="#D4A548"
              stroke="#7A1315"
              strokeWidth="1.5"
            />
          </g>
        )}
      </svg>

      {/* Gold Spotlight Ring around Target Element */}
      {targetRect && (
        <div
          className="fixed pointer-events-none rounded-xl ring-2 ring-(--earist-accent) shadow-[0_0_0_4px_rgba(212,165,72,0.28)] transition-all duration-200"
          style={{
            top: cutoutY,
            left: cutoutX,
            width: cutoutW,
            height: cutoutH,
          }}
        >
          <span className="absolute -top-3 right-3 inline-flex items-center gap-1 rounded-full bg-(--earist-accent) px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-950 shadow-xs">
            <Sparkles className="h-2.5 w-2.5" />
            Step {stepIndex + 1} Target
          </span>
        </div>
      )}

      {/* Floating EARIST Coach-Mark Card */}
      <div
        className="fixed z-[10000] w-[min(380px,calc(100vw-32px))] overflow-hidden rounded-xl border border-(--earist-accent)/60 bg-white shadow-2xl transition-all duration-200"
        style={{
          top: cardTop,
          left: cardLeft,
        }}
      >
        {/* Maroon Institutional Header Banner */}
        <div className="flex items-center justify-between bg-(--earist-primary) px-4 py-2.5 text-white">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-(--earist-accent) text-xs font-bold text-slate-950">
              {stepIndex + 1}
            </span>
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-(--earist-accent)">
                Step {stepIndex + 1} of {totalSteps}
              </span>
              <span className="text-xs font-medium text-white/90 truncate max-w-[230px]">
                {routeConfig.pageTitle}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={closeGuide}
            aria-label="Close page guide"
            className="rounded-md p-1 text-white/80 transition-colors hover:bg-white/15 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Card Body */}
        <div className="p-4 space-y-3">
          <div className="flex items-start gap-2.5">
            <Compass className="mt-0.5 h-5 w-5 shrink-0 text-(--earist-primary)" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 leading-snug">
                {currentStep.title}
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                {currentStep.description}
              </p>
            </div>
          </div>

          {!targetRect && (
            <div className="rounded-lg border border-amber-200 bg-amber-50/70 px-3 py-2 text-[11px] text-amber-900">
              <strong>Evaluation Tip:</strong> Use the Scenario Switcher pills or
              navigation controls on this page to explore all interactive workflow
              states.
            </div>
          )}

          {/* Step Progress Dots */}
          <div className="flex items-center justify-center gap-1.5 pt-1">
            {activeSteps.map((step, idx) => (
              <button
                key={step.id}
                type="button"
                onClick={() => setPageGuideStep(idx)}
                aria-label={`Go to step ${idx + 1}: ${step.title}`}
                className={`h-1.5 rounded-full transition-all ${
                  idx === stepIndex
                    ? "w-6 bg-(--earist-primary)"
                    : "w-1.5 bg-slate-300 hover:bg-slate-400"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Footer Controls */}
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/80 px-4 py-2.5">
          <button
            type="button"
            onClick={closeGuide}
            className="text-xs font-medium text-slate-500 transition-colors hover:text-slate-800"
          >
            Skip Guide
          </button>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={stepIndex === 0}
              onClick={prevStep}
              className="h-8 px-2.5 text-xs"
            >
              <ChevronLeft className="mr-1 h-3.5 w-3.5" />
              Back
            </Button>

            <Button
              type="button"
              size="sm"
              onClick={nextStep}
              className="h-8 bg-(--earist-primary) px-3 text-xs font-semibold text-white hover:bg-(--earist-secondary)"
            >
              {isLastStep ? (
                <>
                  <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                  Finish
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="ml-1 h-3.5 w-3.5" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
