"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiClientRequest } from "@/lib/api.client";
import { cn } from "@/lib/utils";
import {
  formatWallDate,
  formatWallTime,
  MAX_VISIBLE_NOTIFICATIONS,
  MAX_VISIBLE_OTHER_UPCOMING,
  MAX_VISIBLE_TASKS,
  MAX_VISIBLE_WAITING,
  panelistDashboardQueryKey,
  type PanelistAttentionCategory,
  type PanelistDashboard,
  type PanelistNotification,
  type UpcomingDefenseItem,
} from "@/lib/panelist-dashboard";
import type { ApiApplication, Panelist } from "@/types/index";
import {
  AlertCircle,
  ArrowRight,
  Bell,
  BookOpen,
  Calendar,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  FileSignature,
  Gavel,
  MapPin,
  PlayCircle,
  UserCheck,
} from "lucide-react";

const CATEGORY_BADGE: Record<
  PanelistAttentionCategory,
  { label: string; className: string }
> = {
  EVALUATION: {
    label: "Evaluation",
    className: "border-red-200 bg-red-50 text-red-700",
  },
  CHAIRMAN_CONCLUSION: {
    label: "Chairman Decision",
    className: "border-red-200 bg-red-50 text-red-700",
  },
  RAPPORTEUR_FINALIZE: {
    label: "Rapporteur Report",
    className: "border-red-200 bg-red-50 text-red-700",
  },
  TITLE_START: {
    label: "Start Defense",
    className: "border-amber-200 bg-amber-50 text-amber-800",
  },
  RAP_SIGNATURE: {
    label: "E-Signature",
    className: "border-amber-200 bg-amber-50 text-amber-800",
  },
  ADVISER_REQUEST: {
    label: "Adviser Request",
    className: "border-amber-200 bg-amber-50 text-amber-800",
  },
  ADVISER_MANUSCRIPT_REVIEW: {
    label: "Manuscript Review",
    className: "border-amber-200 bg-amber-50 text-amber-800",
  },
};

function CategoryIcon({ category }: { category: PanelistAttentionCategory }) {
  switch (category) {
    case "EVALUATION":
      return <ClipboardCheck className="h-4 w-4 text-[#e02b20]" />;
    case "CHAIRMAN_CONCLUSION":
      return <Gavel className="h-4 w-4 text-[#e02b20]" />;
    case "RAPPORTEUR_FINALIZE":
    case "RAP_SIGNATURE":
      return <FileSignature className="h-4 w-4 text-[#e02b20]" />;
    case "TITLE_START":
      return <PlayCircle className="h-4 w-4 text-[#e02b20]" />;
    case "ADVISER_REQUEST":
      return <UserCheck className="h-4 w-4 text-[#e02b20]" />;
    case "ADVISER_MANUSCRIPT_REVIEW":
      return <BookOpen className="h-4 w-4 text-[#e02b20]" />;
  }
}

export default function PanelistDashboardPage() {
  const [showAllTasks, setShowAllTasks] = useState(false);

  const dashboardQuery = useQuery<PanelistDashboard>({
    queryKey: panelistDashboardQueryKey,
    queryFn: async () =>
      (await apiClientRequest(
        "/thesis/defense/panelist/dashboard",
      )) as PanelistDashboard,
  });

  const notificationsQuery = useQuery<PanelistNotification[]>({
    queryKey: ["panelistNotifications"],
    queryFn: async () =>
      (await apiClientRequest("/notifications")) as PanelistNotification[],
  });

  const { data: panelistProfile } = useQuery<Panelist | null>({
    queryKey: ["panelistLayoutProfile"],
    queryFn: async () => {
      try {
        return (await apiClientRequest("/panelists/me")) as Panelist;
      } catch {
        return null;
      }
    },
    staleTime: 60_000,
  });

  const canEvaluateEssays = Boolean(panelistProfile?.canEvaluateEssays);

  const { data: examApps = [] } = useQuery<ApiApplication[]>({
    queryKey: ["examRecords"],
    queryFn: async () =>
      (await apiClientRequest("/exam/applications")) as ApiApplication[],
    enabled: canEvaluateEssays,
  });

  const pendingEssayCount = (Array.isArray(examApps) ? examApps : []).filter(
    (app) => app.status === "TAKEN" && !app.essayEvaluationCompleted,
  ).length;

  const dashboard = dashboardQuery.data;
  const upcomingCount = dashboard?.kpis.upcomingDefenses ?? 0;
  const pendingCount = dashboard?.kpis.pendingTasks ?? 0;
  const tasks = dashboard?.needsAttention ?? [];
  const activeDefenses = dashboard?.activeDefenses ?? [];
  const upcomingDefenses = dashboard?.upcomingDefenses ?? [];
  const waitingItems = dashboard?.waitingOnOthers ?? [];

  const visibleTasks = showAllTasks
    ? tasks
    : tasks.slice(0, MAX_VISIBLE_TASKS);
  const nextDefense: UpcomingDefenseItem | undefined = upcomingDefenses[0];
  const otherUpcoming = upcomingDefenses.slice(
    1,
    1 + MAX_VISIBLE_OTHER_UPCOMING,
  );
  const visibleWaiting = waitingItems.slice(0, MAX_VISIBLE_WAITING);

  const notifications = Array.isArray(notificationsQuery.data)
    ? notificationsQuery.data
    : [];
  const visibleNotifications = notifications.slice(
    0,
    MAX_VISIBLE_NOTIFICATIONS,
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#e02b20]">Faculty Overview</h2>
        <p className="text-sm text-[#333333]">
          Manage your defense schedules, pending evaluations, and advisee
          responsibilities.
        </p>
      </div>

      {/* KPI Band */}
      <div
        data-guide="panelist-kpi-cards"
        className={`grid grid-cols-1 gap-4 ${
          canEvaluateEssays ? "md:grid-cols-3" : "md:grid-cols-2"
        }`}
      >
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="flex items-center space-x-4 p-6">
            <div className="rounded-lg bg-red-50 p-3 text-[#e02b20]">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold tracking-wider text-[#333333] uppercase">
                Upcoming Defenses
              </p>
              <p className="text-2xl font-extrabold text-[#333333]">
                {dashboardQuery.isLoading
                  ? "—"
                  : dashboardQuery.isError
                    ? "—"
                    : upcomingCount}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 shadow-sm">
          <CardContent className="flex items-center space-x-4 p-6">
            <div className="rounded-lg bg-amber-50 p-3 text-[#f9a825]">
              <FileSignature className="h-6 w-6 text-yellow-700" />
            </div>
            <div>
              <p className="text-xs font-bold tracking-wider text-[#333333] uppercase">
                Pending Tasks
              </p>
              <p className="text-2xl font-extrabold text-[#333333]">
                {dashboardQuery.isLoading
                  ? "—"
                  : dashboardQuery.isError
                    ? "—"
                    : pendingCount}
              </p>
            </div>
          </CardContent>
        </Card>

        {canEvaluateEssays && (
          <Link href="/faculty/essay-evaluations" className="block">
            <Card className="h-full border-gray-200 shadow-sm transition-colors hover:border-[#e02b20]/40 hover:bg-red-50/20">
              <CardContent className="flex items-center justify-between p-6">
                <div className="flex items-center space-x-4">
                  <div className="rounded-lg bg-red-50 p-3 text-[#e02b20]">
                    <ClipboardCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold tracking-wider text-[#333333] uppercase">
                      Pending Essay Evaluations
                    </p>
                    <p className="text-2xl font-extrabold text-[#333333]">
                      {pendingEssayCount}
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-[#e02b20]" />
              </CardContent>
            </Card>
          </Link>
        )}
      </div>

      {/* Main Two-Column Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left: Needs Your Attention (7 cols) */}
        <Card
          data-guide="panelist-attention-list"
          className="border-gray-200 shadow-sm lg:col-span-7"
        >
          <CardHeader className="flex flex-row items-center justify-between border-b border-gray-200 pb-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-[#e02b20]" />
              <CardTitle className="text-lg font-bold text-[#333333]">
                Needs Your Attention
              </CardTitle>
            </div>
            {!dashboardQuery.isLoading && !dashboardQuery.isError && (
              <Badge
                variant="outline"
                className="border-gray-200 text-xs font-semibold text-[#333333]"
              >
                {tasks.length} {tasks.length === 1 ? "item" : "items"}
              </Badge>
            )}
          </CardHeader>
          <CardContent className="p-0">
            {dashboardQuery.isLoading ? (
              <div className="p-8 text-center text-sm text-[#333333]">
                Loading tasks…
              </div>
            ) : dashboardQuery.isError ? (
              <div className="flex flex-col items-center gap-3 p-8 text-center">
                <AlertCircle className="h-6 w-6 text-[#e02b20]" />
                <p className="text-sm font-medium text-[#333333]">
                  Could not load your pending tasks right now.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => dashboardQuery.refetch()}
                >
                  Retry
                </Button>
              </div>
            ) : tasks.length === 0 ? (
              <div className="flex flex-col items-center gap-2 p-10 text-center">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
                <p className="text-sm font-semibold text-[#333333]">
                  You have no pending actions right now.
                </p>
                <p className="max-w-sm text-xs text-[#333333]">
                  New evaluations, signatures, and adviser reviews will appear
                  here when they require your action.
                </p>
              </div>
            ) : (
              <div>
                <div className="divide-y divide-gray-200">
                  {visibleTasks.map((task) => {
                    const badge = CATEGORY_BADGE[task.category];
                    return (
                      <div
                        key={task.id}
                        className="flex flex-col justify-between gap-3 p-4 transition-colors hover:bg-gray-50 sm:flex-row sm:items-center"
                      >
                        <div className="min-w-0 space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <CategoryIcon category={task.category} />
                            <p className="text-sm font-bold text-[#333333]">
                              {task.title}
                            </p>
                            <Badge
                              variant="outline"
                              className={`text-[11px] font-semibold ${badge.className}`}
                            >
                              {badge.label}
                            </Badge>
                          </div>
                          <p className="text-xs text-[#333333]">
                            {task.studentName ? (
                              <span className="font-semibold text-[#333333]">
                                {task.studentName}
                              </span>
                            ) : null}
                            {task.studentName && task.stage ? " · " : null}
                            {task.stage ?? null}
                            {(task.studentName || task.stage) &&
                            task.responsibility
                              ? " · "
                              : null}
                            <span>Role: {task.responsibility}</span>
                          </p>
                          <p className="text-xs text-[#333333]">
                            {task.statusText}
                            {task.date
                              ? ` · ${formatWallDate(task.date)}`
                              : ""}
                          </p>
                        </div>

                        <div className="shrink-0">
                          <Link
                            href={task.href}
                            className={cn(
                              buttonVariants({ size: "sm" }),
                              "bg-[#e02b20] text-white hover:bg-[#e02b20]/90",
                            )}
                          >
                            {task.actionLabel}
                            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {tasks.length > MAX_VISIBLE_TASKS && (
                  <div className="border-t border-gray-200 px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => setShowAllTasks((v) => !v)}
                      className="text-xs font-bold text-[#e02b20] hover:underline"
                    >
                      {showAllTasks
                        ? "Show fewer"
                        : `View all (${tasks.length})`}
                    </button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right: Active & Upcoming Defenses (5 cols) */}
        <Card
          data-guide="panelist-upcoming-list"
          className="border-gray-200 shadow-sm lg:col-span-5"
        >
          <CardHeader className="flex flex-row items-center justify-between border-b border-gray-200 pb-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-[#e02b20]" />
              <CardTitle className="text-lg font-bold text-[#333333]">
                Active &amp; Upcoming Defenses
              </CardTitle>
            </div>
            <Link
              href="/faculty/defenses"
              className="text-xs font-bold text-[#e02b20] hover:underline"
            >
              View All Defenses
            </Link>
          </CardHeader>
          <CardContent className="space-y-4 p-4">
            {dashboardQuery.isLoading ? (
              <div className="p-6 text-center text-sm text-[#333333]">
                Loading defense schedule…
              </div>
            ) : dashboardQuery.isError ? (
              <div className="flex flex-col items-center gap-3 p-6 text-center">
                <AlertCircle className="h-6 w-6 text-[#e02b20]" />
                <p className="text-sm font-medium text-[#333333]">
                  Could not load your defense schedule right now.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => dashboardQuery.refetch()}
                >
                  Retry
                </Button>
              </div>
            ) : activeDefenses.length === 0 && upcomingDefenses.length === 0 ? (
              <div className="p-8 text-center text-sm text-[#333333]">
                No upcoming or active defenses are currently assigned to you.
              </div>
            ) : (
              <>
                {activeDefenses.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-bold tracking-wider text-[#e02b20] uppercase">
                      Active Session Now
                    </p>
                    {activeDefenses.map((d) => (
                      <div
                        key={d.scheduleId}
                        className="rounded-lg border border-red-200 bg-red-50/70 p-3.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-[#333333]">
                              {d.studentName}
                            </p>
                            <p className="text-xs text-[#333333]">
                              {d.stageLabel} · Role: {d.roleLabel}
                            </p>
                          </div>
                          <Badge className="shrink-0 bg-[#e02b20] text-[10px] text-white">
                            {d.sessionStatusLabel}
                          </Badge>
                        </div>
                        <div className="mt-3 flex justify-end">
                          <Link
                            href={d.href}
                            className={cn(
                              buttonVariants({ size: "sm" }),
                              "bg-[#e02b20] text-white hover:bg-[#e02b20]/90",
                            )}
                          >
                            Open Workspace
                            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {nextDefense && (
                  <div className="space-y-2">
                    <p className="text-xs font-bold tracking-wider text-[#333333] uppercase">
                      Next Scheduled Defense
                    </p>
                    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-xs">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-[#333333]">
                            {nextDefense.studentName}
                          </p>
                          {nextDefense.programName && (
                            <p className="truncate text-xs text-[#333333]">
                              {nextDefense.programName}
                            </p>
                          )}
                        </div>
                        <Badge
                          variant="outline"
                          className="shrink-0 border-gray-200 text-[11px] font-semibold text-[#333333]"
                        >
                          {nextDefense.stageLabel}
                        </Badge>
                      </div>

                      <div className="mt-3 space-y-1 text-xs text-[#333333]">
                        <p className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-[#e02b20]" />
                          <span className="font-semibold text-[#333333]">
                            {formatWallDate(nextDefense.defenseDate)}
                          </span>
                          <span>·</span>
                          <span>{formatWallTime(nextDefense.defenseTime)}</span>
                        </p>
                        {nextDefense.venueOrLink && (
                          <p className="flex items-center gap-1.5 truncate">
                            <MapPin className="h-3.5 w-3.5 shrink-0 text-[#e02b20]" />
                            <span className="truncate">
                              {nextDefense.venueOrLink}
                            </span>
                          </p>
                        )}
                        <p className="text-[11px]">
                          Role:{" "}
                          <span className="font-semibold text-[#333333]">
                            {nextDefense.roleLabel}
                          </span>
                        </p>
                      </div>

                      <div className="mt-3 flex justify-end">
                        <Link
                          href={nextDefense.href}
                          className={cn(
                            buttonVariants({ variant: "outline", size: "sm" }),
                          )}
                        >
                          Open Defense Workspace
                        </Link>
                      </div>
                    </div>
                  </div>
                )}

                {otherUpcoming.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-bold tracking-wider text-[#333333] uppercase">
                      Later Defenses
                    </p>
                    <div className="divide-y divide-gray-200 rounded-lg border border-gray-200">
                      {otherUpcoming.map((item) => (
                        <Link
                          key={item.scheduleId}
                          href={item.href}
                          className="flex items-center justify-between gap-2 p-3 text-xs transition-colors hover:bg-gray-50"
                        >
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-[#333333]">
                              {item.studentName} · {item.stageLabel}
                            </p>
                            <p className="text-[#333333]">
                              {formatWallDate(item.defenseDate)} at{" "}
                              {formatWallTime(item.defenseTime)} ·{" "}
                              {item.roleLabel}
                            </p>
                          </div>
                          <ArrowRight className="h-4 w-4 shrink-0 text-[#e02b20]" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Waiting on Others (renders only when non-empty) */}
      {visibleWaiting.length > 0 && (
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-200 pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-[#333333]">
                  Waiting on Others
                </CardTitle>
                <p className="text-xs text-[#333333]">
                  Your part is complete on these records; another role is
                  responsible for the next step.
                </p>
              </div>
              <Badge
                variant="outline"
                className="border-gray-200 text-xs text-[#333333]"
              >
                Read-only
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-200">
              {visibleWaiting.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col justify-between gap-2 p-4 text-xs sm:flex-row sm:items-center"
                >
                  <div className="space-y-0.5">
                    <p className="font-bold text-[#333333]">
                      {item.studentName ?? "Student"} · {item.recordLabel}
                    </p>
                    <p className="text-[#333333]">
                      Waiting for:{" "}
                      <span className="font-semibold text-[#333333]">
                        {item.requirement}
                      </span>{" "}
                      ({item.responsibleRole})
                    </p>
                    <p className="text-[#333333]">{item.statusText}</p>
                  </div>
                  {item.href && (
                    <Link
                      href={item.href}
                      className="shrink-0 font-bold text-[#e02b20] hover:underline"
                    >
                      View Record
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Notifications */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between border-b border-gray-200 pb-4">
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-[#e02b20]" />
            <CardTitle className="text-lg font-bold text-[#333333]">
              Recent Notifications
            </CardTitle>
          </div>
          <Link
            href="/faculty/notifications"
            className="text-xs font-bold text-[#e02b20] hover:underline"
          >
            View All Notifications
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          {notificationsQuery.isLoading ? (
            <div className="p-8 text-center text-sm text-[#333333]">
              Loading notifications…
            </div>
          ) : notificationsQuery.isError ? (
            <div className="flex flex-col items-center gap-3 p-8 text-center">
              <AlertCircle className="h-6 w-6 text-[#e02b20]" />
              <p className="text-sm font-medium text-[#333333]">
                Could not load your notifications right now.
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => notificationsQuery.refetch()}
              >
                Retry
              </Button>
            </div>
          ) : visibleNotifications.length === 0 ? (
            <div className="p-8 text-center text-sm text-[#333333]">
              You have no recent notifications.
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {visibleNotifications.map((n) => (
                <div
                  key={n.id}
                  className="p-4 transition-colors hover:bg-gray-50"
                >
                  <div className="flex items-start justify-between">
                    <p className="text-sm font-bold text-[#333333]">
                      {n.title}
                    </p>
                    <span className="text-[10px] text-[#333333]">
                      {formatWallDate(n.createdAt)}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-[#333333]">{n.message}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
