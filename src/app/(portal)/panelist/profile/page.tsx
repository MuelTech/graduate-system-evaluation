"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClientRequest } from "@/lib/api.client";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PageHeader } from "@/components/ui/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Award,
  Building2,
  CircleAlert,
  GraduationCap,
  Mail,
  RefreshCw,
  UserCheck,
} from "lucide-react";

interface PanelistProfile {
  id: string;
  isExternal: boolean;
  isAvailableAsAdviser: boolean;
  specialization?: string | null;
  officeAffiliation?: string | null;
  firstName?: string;
  lastName?: string;
  email?: string;
  academicRank?: string;
  department?: string;
}

/**
 * UIUX-3A: Faculty Profile & Adviser Availability control.
 * Uses the /panelists/me + /panelists/me/availability API.
 */
export default function PanelistProfile() {
  const queryClient = useQueryClient();

  const {
    data: profile,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useQuery<PanelistProfile>({
    queryKey: ["panelistProfile"],
    queryFn: async () =>
      (await apiClientRequest("/panelists/me")) as PanelistProfile,
  });

  const toggleMutation = useMutation({
    mutationFn: async (isAvailable: boolean) =>
      apiClientRequest("/panelists/me/availability", {
        method: "PATCH",
        body: JSON.stringify({ isAvailable }),
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["panelistProfile"] });
    },
  });

  const isExternal = profile?.isExternal === true;
  const saving = toggleMutation.isPending;
  const saveError = toggleMutation.isError;

  const specializations = (
    profile?.specialization ||
    "Artificial Intelligence, Machine Learning, Distributed Systems, Public Sector Digital Transformation"
  )
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profile"
        description="Manage your faculty academic profile, research specializations, and adviser availability."
      />

      {/* Faculty Profile Card */}
      <Card className="max-w-3xl" data-guide="panelist-profile-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <GraduationCap
              className="h-4 w-4 text-(--earist-secondary)"
              aria-hidden="true"
            />
            Faculty Credentials & Research Specializations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="space-y-3" aria-busy="true">
              <Skeleton className="h-6 w-64" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-(--earist-primary) text-lg font-bold text-white">
                    RS
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-base font-bold text-foreground">
                        Dr. Roberto M. Santos, DIT
                      </h2>
                      <Badge className="bg-(--earist-primary)/10 text-(--earist-primary)">
                        {isExternal ? "External Panelist" : "Internal Faculty"}
                      </Badge>
                    </div>
                    <p className="text-xs text-(--earist-body-text)">
                      Professor IV · Graduate School Core Faculty & Defense Chairperson
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 rounded-lg border border-(--earist-border-gray) bg-(--earist-surface-gray)/40 p-3.5 text-xs sm:grid-cols-2">
                <div className="flex items-center gap-2 text-(--earist-body-text)">
                  <Mail className="h-3.5 w-3.5 shrink-0 text-(--earist-secondary)" />
                  <span className="truncate font-medium text-foreground">
                    roberto.santos@earist.edu.ph
                  </span>
                </div>
                <div className="flex items-center gap-2 text-(--earist-body-text)">
                  <Building2 className="h-3.5 w-3.5 shrink-0 text-(--earist-secondary)" />
                  <span className="truncate font-medium text-foreground">
                    {profile?.officeAffiliation ||
                      "EARIST Graduate School — Computing & Information Sciences"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-(--earist-body-text) sm:col-span-2">
                  <Award className="h-3.5 w-3.5 shrink-0 text-(--earist-secondary)" />
                  <span>
                    Eligible Roles:{" "}
                    <strong className="text-foreground">
                      Committee Chairperson, Panel Member, Rapporteur, Thesis Adviser
                    </strong>
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold text-(--earist-body-text)">
                  Research Specializations (Used for Defense Committee Matching)
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {specializations.map((spec) => (
                    <Badge
                      key={spec}
                      variant="secondary"
                      className="bg-(--earist-surface-gray) text-xs font-medium text-foreground"
                    >
                      {spec}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Adviser Availability Card */}
      <Card className="max-w-3xl" data-guide="panelist-availability-toggle">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <UserCheck
              className="h-4 w-4 text-(--earist-secondary)"
              aria-hidden="true"
            />
            Adviser Availability
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading ? (
            <div className="flex items-center justify-between gap-4" aria-busy="true">
              <Skeleton className="h-5 w-56" />
              <Skeleton className="h-5 w-10 rounded-full" />
            </div>
          ) : isError || !profile ? (
            <div className="flex flex-col items-start gap-2 py-2">
              <p className="flex items-center gap-2 text-sm text-(--earist-body-text)">
                <CircleAlert
                  className="h-4 w-4 text-(--earist-secondary)"
                  aria-hidden="true"
                />
                Unable to load your availability setting.
              </p>
              <button
                type="button"
                onClick={() => void refetch()}
                disabled={isFetching}
                className="inline-flex items-center text-sm font-medium text-(--earist-secondary) hover:underline disabled:opacity-60"
              >
                <RefreshCw
                  className={cn(
                    "mr-1.5 h-3.5 w-3.5",
                    isFetching && "animate-spin",
                  )}
                  aria-hidden="true"
                />
                Retry
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 space-y-1">
                  <Label htmlFor="adviser-availability" className="text-sm font-medium">
                    Available as Thesis/Dissertation Adviser
                  </Label>
                  <p className="text-xs text-(--earist-body-text)">
                    When available, students may select you as an adviser from
                    your Title Defense panel (GS-020). This does not create an
                    adviser assignment by itself.
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2 pt-0.5">
                  <Switch
                    id="adviser-availability"
                    size="default"
                    checked={profile.isAvailableAsAdviser}
                    disabled={saving || isExternal}
                    onCheckedChange={(checked) =>
                      toggleMutation.mutate(checked)
                    }
                    aria-label="Available as Thesis/Dissertation Adviser"
                  />
                  <span
                    className={cn(
                      "text-xs font-medium",
                      profile.isAvailableAsAdviser
                        ? "text-emerald-700"
                        : "text-(--earist-body-text)",
                    )}
                  >
                    {saving
                      ? "Saving…"
                      : profile.isAvailableAsAdviser
                        ? "Available"
                        : "Not available"}
                  </span>
                </div>
              </div>

              {isExternal ? (
                <p className="text-xs text-(--earist-body-text)">
                  External panelists cannot serve as thesis/dissertation
                  advisers; this setting is unavailable for your account.
                </p>
              ) : null}

              {saveError ? (
                <p className="flex items-center gap-1.5 text-xs text-destructive">
                  <CircleAlert className="h-3.5 w-3.5" aria-hidden="true" />
                  {(toggleMutation.error as Error)?.message ||
                    "Unable to update your availability. Please try again."}
                </p>
              ) : null}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
