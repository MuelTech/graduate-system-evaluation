"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";
import { usePathname } from "next/navigation";

export type EvaluationRole = "applicant" | "student" | "panelist";

export interface EvaluationUser {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  role: EvaluationRole;
  accessToken: string;
  mustChangePassword: boolean;
  applicantId?: string;
  studentNumber?: string;
  program?: string;
  facultyId?: string;
  academicRank?: string;
  specialization?: string;
  officeAffiliation?: string;
  facultyProfile?: {
    id: string;
    isExternal: boolean;
    isAvailableAsAdviser: boolean;
    canEvaluateEssays: boolean;
  };
}

export interface EvaluationSession {
  user: EvaluationUser;
  expires: string;
}

export const EVALUATION_PERSONAS: Record<EvaluationRole, EvaluationUser> = {
  applicant: {
    id: "applicant-eval-01",
    name: "Maria Lourdes G. Villanueva",
    firstName: "Maria Lourdes",
    lastName: "Villanueva",
    email: "mlgvillanueva@applicant.earist.edu.ph",
    role: "applicant",
    accessToken: "eval-token-applicant-01",
    mustChangePassword: false,
    applicantId: "APP-2026-0142",
    program:
      "Master of Arts in Education major in Administration and Supervision",
  },
  student: {
    id: "student-eval-01",
    name: "Juan M. Dela Cruz",
    firstName: "Juan",
    lastName: "Dela Cruz",
    email: "jmdelacruz.gs@earist.edu.ph",
    role: "student",
    accessToken: "eval-token-student-01",
    mustChangePassword: false,
    studentNumber: "2025-GS-00142",
    program:
      "Master of Arts in Education Major in Administration and Supervision (MAEd-AS)",
  },
  panelist: {
    id: "panelist-eval-01",
    name: "Dr. Maria Clara R. Santos, EdD",
    firstName: "Maria Clara",
    lastName: "Santos",
    email: "mcrsantos@earist.edu.ph",
    role: "panelist",
    accessToken: "eval-token-panelist-01",
    mustChangePassword: false,
    facultyId: "FAC-GS-0089",
    academicRank: "Associate Professor V",
    specialization:
      "Educational Leadership, Curriculum Development, & Policy Research",
    officeAffiliation: "EARIST Graduate School — College of Education",
    facultyProfile: {
      id: "panelist-eval-01",
      isExternal: false,
      isAvailableAsAdviser: true,
      canEvaluateEssays: true,
    },
  },
};

const STORAGE_KEY = "earist-eval-active-role";

let currentRole: EvaluationRole = "student";
const listeners = new Set<() => void>();

function notifyListeners() {
  for (const listener of listeners) {
    listener();
  }
}

export function getActiveEvaluationRole(): EvaluationRole {
  if (typeof window !== "undefined") {
    const pathname = window.location.pathname;
    if (pathname.startsWith("/panelist") || pathname.startsWith("/faculty")) {
      return "panelist";
    }
    if (pathname.startsWith("/student")) {
      return "student";
    }
    if (pathname.startsWith("/applicant")) {
      return "applicant";
    }
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (
        saved === "applicant" ||
        saved === "student" ||
        saved === "panelist"
      ) {
        currentRole = saved;
      }
    } catch {
      // Ignore storage access errors in restricted frames
    }
  }
  return currentRole;
}

export function setActiveEvaluationRole(nextRole: EvaluationRole): void {
  currentRole = nextRole;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, nextRole);
    } catch {
      // Ignore storage access errors
    }
  }
  notifyListeners();
}

function subscribeRole(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function buildEvaluationSession(
  role: EvaluationRole = getActiveEvaluationRole(),
): EvaluationSession {
  return {
    user: EVALUATION_PERSONAS[role],
    expires: "2099-12-31T23:59:59.000Z",
  };
}

export async function getSession(): Promise<EvaluationSession> {
  return buildEvaluationSession(getActiveEvaluationRole());
}

/** Server/client compatible auth() helper for `@/auth` alias */
export async function auth(): Promise<EvaluationSession> {
  return buildEvaluationSession(getActiveEvaluationRole());
}

export async function signIn(
  providerOrRole?: string,
  options?: {
    callbackUrl?: string;
    role?: EvaluationRole | "faculty";
    redirect?: boolean;
    [key: string]: unknown;
  },
): Promise<{ ok: true; error: null; status: 200; url: string | null }> {
  const rawRole = options?.role ?? providerOrRole;
  const targetRole: EvaluationRole =
    rawRole === "applicant"
      ? "applicant"
      : rawRole === "panelist" || rawRole === "faculty"
        ? "panelist"
        : "student";
  setActiveEvaluationRole(targetRole);
  const destination =
    options?.callbackUrl ??
    (targetRole === "applicant"
      ? "/applicant/dashboard"
      : targetRole === "panelist"
        ? "/faculty/dashboard"
        : "/student/dashboard");

  if (typeof window !== "undefined" && options?.redirect !== false) {
    window.location.assign(destination);
  }
  return { ok: true, error: null, status: 200, url: destination };
}

export async function signOut(options?: {
  callbackUrl?: string;
  redirect?: boolean;
}): Promise<{ url: string }> {
  const destination = options?.callbackUrl ?? "/login";
  if (typeof window !== "undefined" && options?.redirect !== false) {
    window.location.assign(destination);
  }
  return { url: destination };
}

interface EvaluationContextValue {
  role: EvaluationRole;
  persona: EvaluationUser;
  personas: typeof EVALUATION_PERSONAS;
  session: EvaluationSession;
  setRole: (role: EvaluationRole) => void;
  switchEvaluationRole: (role: EvaluationRole) => void;
}

const EvaluationSessionContext = createContext<EvaluationContextValue | null>(
  null,
);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const storeRole = useSyncExternalStore<EvaluationRole>(
    subscribeRole,
    () => currentRole,
    () => "student",
  );

  const effectiveRole: EvaluationRole = useMemo(() => {
    if (pathname?.startsWith("/panelist") || pathname?.startsWith("/faculty")) {
      return "panelist";
    }
    if (pathname?.startsWith("/student")) return "student";
    if (pathname?.startsWith("/applicant")) return "applicant";
    return storeRole;
  }, [pathname, storeRole]);

  useEffect(() => {
    if (
      (pathname?.startsWith("/panelist") || pathname?.startsWith("/faculty")) &&
      currentRole !== "panelist"
    ) {
      setActiveEvaluationRole("panelist");
    } else if (pathname?.startsWith("/student") && currentRole !== "student") {
      setActiveEvaluationRole("student");
    } else if (
      pathname?.startsWith("/applicant") &&
      currentRole !== "applicant"
    ) {
      setActiveEvaluationRole("applicant");
    }
  }, [pathname]);

  const setRole = useCallback((nextRole: EvaluationRole) => {
    setActiveEvaluationRole(nextRole);
  }, []);

  const value = useMemo<EvaluationContextValue>(() => {
    const session = buildEvaluationSession(effectiveRole);
    return {
      role: effectiveRole,
      persona: session.user,
      personas: EVALUATION_PERSONAS,
      session,
      setRole,
      switchEvaluationRole: setRole,
    };
  }, [effectiveRole, setRole]);

  return (
    <EvaluationSessionContext.Provider value={value}>
      {children}
    </EvaluationSessionContext.Provider>
  );
}

export function useSession(): {
  data: EvaluationSession;
  status: "authenticated" | "loading" | "unauthenticated";
  update: (data?: unknown) => Promise<EvaluationSession>;
} {
  const ctx = useContext(EvaluationSessionContext);
  const fallbackRole = getActiveEvaluationRole();
  const session = ctx?.session ?? buildEvaluationSession(fallbackRole);
  return {
    data: session,
    status: "authenticated",
    update: async () => session,
  };
}

export function useEvaluationRole() {
  const ctx = useContext(EvaluationSessionContext);
  const fallbackRole = getActiveEvaluationRole();
  const role = ctx?.role ?? fallbackRole;
  return {
    role,
    user: EVALUATION_PERSONAS[role],
    persona: EVALUATION_PERSONAS[role],
    personas: EVALUATION_PERSONAS,
    setRole: setActiveEvaluationRole,
    switchEvaluationRole: setActiveEvaluationRole,
  };
}

export const useEvaluationContext = useEvaluationRole;
export const useEvaluationSession = useEvaluationRole;

