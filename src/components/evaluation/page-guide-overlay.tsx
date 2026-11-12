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
      className={`guide-btn-highlight group relative inline-flex items-center gap-2 rounded-full border-2 border-[#f9a825] bg-linear-to-r from-amber-50 via-white to-amber-50 px-3.5 py-1.5 text-xs font-bold text-[#b71c1c] transition-all duration-300 hover:scale-105 hover:border-[#b71c1c] hover:bg-[#b71c1c] hover:text-white hover:shadow-[0_4px_20px_rgba(183,28,28,0.35)] active:scale-95 ${
        isOpen
          ? "ring-4 ring-[#f9a825] ring-offset-1"
          : "ring-2 ring-[#f9a825]/40"
      } ${className}`}
    >
      {/* Live Animated Beacon / Pulsing Attention Ping */}
      <span className="relative flex h-2.5 w-2.5 items-center justify-center">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#f9a825] opacity-85" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-[#f9a825] shadow-xs" />
      </span>

      <Sparkles className="h-3.5 w-3.5 text-[#f9a825] transition-transform duration-300 group-hover:rotate-12 group-hover:scale-115 group-hover:text-amber-200" />
      <span className="font-bold tracking-tight">{compact ? "Guide" : label}</span>
      <span className="hidden rounded-full bg-[#b71c1c]/10 px-1.5 py-0.5 text-[10px] font-extrabold tracking-wider text-[#b71c1c] uppercase transition-colors group-hover:bg-white/20 group-hover:text-white sm:inline-block">
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

function isSidebarTarget(selector?: string): boolean {
  if (!selector) return false;
  return (
    selector.includes("sidebar-nav") ||
    selector.includes("thesis-journey-menu") ||
    selector.includes("sidebar")
  );
}

function isElementVisibleInViewport(el: Element): boolean {
  if (typeof window === "undefined") return false;
  const rect = el.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return false;
  // If element is translated completely offscreen to the left or right (e.g. mobile hidden sidebar)
  if (rect.right <= 10 || rect.left >= window.innerWidth - 10) return false;
  // If element is placed completely offscreen vertically
  if (rect.bottom <= 0 || rect.top >= window.innerHeight) return false;

  const style = window.getComputedStyle(el);
  if (
    style.display === "none" ||
    style.visibility === "hidden" ||
    style.opacity === "0"
  ) {
    return false;
  }
  return true;
}

function resolveTargetElement(selectorList: string): Element | null {
  if (typeof document === "undefined" || !selectorList) return null;
  const selectors = selectorList
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  for (const sel of selectors) {
    try {
      const el = document.querySelector(sel);
      if (el && isElementVisibleInViewport(el)) {
        return el;
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

  const isMobile = viewportW < 768;
  const effectiveCardWidth = Math.min(CARD_WIDTH, viewportW - 32);
  const targetCenterX = targetRect.left + targetRect.width / 2;
  const targetCenterY = targetRect.top + targetRect.height / 2;

  // On compact mobile screens, horizontally center card and place it either above or below
  if (isMobile) {
    const cardLeft = Math.max(16, (viewportW - effectiveCardWidth) / 2);
    const isTargetUpper = targetCenterY < viewportH / 2;
    const cardTop = isTargetUpper
      ? Math.min(
          viewportH - CARD_ESTIMATED_HEIGHT - 16,
          Math.max(16, targetRect.bottom + SPOTLIGHT_PADDING + 16),
        )
      : Math.max(
          16,
          Math.min(
            viewportH - CARD_ESTIMATED_HEIGHT - 16,
            targetRect.top - SPOTLIGHT_PADDING - CARD_ESTIMATED_HEIGHT - 16,
          ),
        );

    const arrowStart = isTargetUpper
      ? { x: cardLeft + effectiveCardWidth / 2, y: cardTop - 4 }
      : {
          x: cardLeft + effectiveCardWidth / 2,
          y: cardTop + CARD_ESTIMATED_HEIGHT + 4,
        };

    const arrowEnd = isTargetUpper
      ? {
          x: Math.max(20, Math.min(viewportW - 20, targetCenterX)),
          y: Math.min(cardTop - 8, targetRect.bottom + SPOTLIGHT_PADDING + 4),
        }
      : {
          x: Math.max(20, Math.min(viewportW - 20, targetCenterX)),
          y: Math.max(
            cardTop + CARD_ESTIMATED_HEIGHT + 8,
            targetRect.top - SPOTLIGHT_PADDING - 4,
          ),
        };

    const arrowControl = {
      x: (arrowStart.x + arrowEnd.x) / 2,
      y: (arrowStart.y + arrowEnd.y) / 2,
    };

    return {
      cardTop,
      cardLeft,
      resolvedPlacement: isTargetUpper ? "bottom" : "top",
      arrowStart,
      arrowEnd,
      arrowControl,
    };
  }

  // Determine best placement with available viewport space (Desktop)
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

  // Auto-toggle mobile sidebar when step targets sidebar navigation
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!isOpen || !currentStep) {
      window.dispatchEvent(
        new CustomEvent("earist-guide-sidebar-toggle", {
          detail: { open: false },
        }),
      );
      return;
    }

    const isMobile = window.innerWidth < 1024;
    const shouldOpenSidebar =
      isMobile && isSidebarTarget(currentStep.targetSelector);

    window.dispatchEvent(
      new CustomEvent("earist-guide-sidebar-toggle", {
        detail: { open: shouldOpenSidebar },
      }),
    );

    if (isMobile) {
      const t1 = setTimeout(updateMeasurement, 60);
      const t2 = setTimeout(updateMeasurement, 160);
      const t3 = setTimeout(updateMeasurement, 340);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }
  }, [isOpen, currentStep, updateMeasurement]);

  // Ensure sidebar is closed when guide overlay is unmounted
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("earist-guide-sidebar-toggle", {
            detail: { open: false },
          }),
        );
      }
    };
  }, []);

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
    ? Math.max(0, Math.min(viewport.w - 10, targetRect.left - SPOTLIGHT_PADDING))
    : 0;
  const cutoutY = targetRect
    ? Math.max(0, Math.min(viewport.h - 10, targetRect.top - SPOTLIGHT_PADDING))
    : 0;
  const rawCutoutW = targetRect ? targetRect.width + SPOTLIGHT_PADDING * 2 : 0;
  const rawCutoutH = targetRect ? targetRect.height + SPOTLIGHT_PADDING * 2 : 0;
  const cutoutW = Math.max(0, Math.min(viewport.w - cutoutX, rawCutoutW));
  const cutoutH = Math.max(0, Math.min(viewport.h - cutoutY, rawCutoutH));

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
            <path d="M 0 1 L 9 5 L 0 9 z" fill="#f9a825" />
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
              stroke="#f9a825"
              strokeWidth="3.5"
              strokeDasharray="8 6"
              strokeLinecap="round"
              markerEnd={`url(#${arrowMarkerId})`}
              className="guide-animated-dash"
            />
            <circle
              cx={arrowStart.x}
              cy={arrowStart.y}
              r="5"
              fill="#f9a825"
              stroke="#7A1315"
              strokeWidth="2"
            />
          </g>
        )}
      </svg>

      {/* Gold Spotlight Ring around Target Element */}
      {targetRect && cutoutW > 0 && cutoutH > 0 && (
        <div
          className="guide-spotlight-highlight fixed pointer-events-none rounded-xl ring-2 ring-[#f9a825] transition-all duration-300"
          style={{
            top: cutoutY,
            left: cutoutX,
            width: cutoutW,
            height: cutoutH,
          }}
        >
          <span className="absolute -top-3.5 right-3 inline-flex items-center gap-1.5 rounded-full bg-[#f9a825] px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-950 shadow-md">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-slate-950 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-slate-950" />
            </span>
            <Sparkles className="h-2.5 w-2.5" />
            Step {stepIndex + 1} Target
          </span>
        </div>
      )}

      {/* Floating EARIST Coach-Mark Card */}
      <div
        className="fixed z-[10000] w-[min(380px,calc(100vw-32px))] overflow-hidden rounded-xl border-2 border-[#f9a825] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.35)] transition-all duration-300 ease-out animate-in fade-in zoom-in-95"
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
