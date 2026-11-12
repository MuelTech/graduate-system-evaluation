"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClientRequest } from "@/lib/api.client";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { NotificationItem } from "@/types";
import {
  Bell,
  CheckCheck,
  CheckCircle2,
  CalendarClock,
  ShieldCheck,
  FileText,
  Clock,
} from "lucide-react";

export default function ApplicantNotificationsPage() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const { data: notifications = [], isLoading } = useQuery<NotificationItem[]>({
    queryKey: ["notifications", "APPLICANT"],
    queryFn: () => apiClientRequest("/notifications"),
  });

  const markReadMutation = useMutation({
    mutationFn: (id: string) =>
      apiClientRequest(`/notifications/${id}/read`, { method: "PUT" }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: () =>
      apiClientRequest("/notifications/read-all", { method: "POST" }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("All notifications marked as read.");
    },
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const filtered =
    filter === "unread"
      ? notifications.filter((n) => !n.isRead)
      : notifications;

  const getIcon = (type?: string) => {
    switch (type) {
      case "EXAM_SCHEDULE":
        return <CalendarClock className="h-4 w-4 text-[#e02b20]" />;
      case "ALIGNMENT":
        return <ShieldCheck className="h-4 w-4 text-green-600" />;
      default:
        return <FileText className="h-4 w-4 text-[#b71c1c]" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <PageHeader
          title="Notifications"
          description="Stay updated on your program alignment, entrance examination schedule, results, and COR verification."
        />
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => markAllReadMutation.mutate()}
            disabled={markAllReadMutation.isPending}
          >
            <CheckCheck className="mr-1.5 h-4 w-4 text-[#e02b20]" />
            Mark All as Read ({unreadCount})
          </Button>
        )}
      </div>

      <Card data-guide="notifications-list">
        <CardHeader className="flex flex-row items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-[#e02b20]" />
            <CardTitle className="text-base font-bold text-[#333333]">
              Applicant Activity Alerts
            </CardTitle>
            {unreadCount > 0 && (
              <Badge className="bg-[#e02b20] text-white">
                {unreadCount} Unread
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1 rounded-lg bg-gray-100 p-1">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors ${
                filter === "all"
                  ? "bg-white text-[#333333] shadow-2xs"
                  : "text-gray-600 hover:text-[#333333]"
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter("unread")}
              className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors ${
                filter === "unread"
                  ? "bg-white text-[#333333] shadow-2xs"
                  : "text-gray-600 hover:text-[#333333]"
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>
        </CardHeader>

        <CardContent className="divide-y divide-gray-100 p-0">
          {isLoading ? (
            <div className="p-8 text-center text-sm text-gray-500">
              Loading notifications...
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-10 text-center">
              <CheckCircle2 className="mx-auto mb-2 h-8 w-8 text-green-600" />
              <p className="text-sm font-semibold text-[#333333]">
                You&apos;re all caught up!
              </p>
              <p className="mt-1 text-xs text-gray-500">
                No unread notifications at the moment.
              </p>
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className={`flex flex-col justify-between gap-3 p-4 transition-colors sm:flex-row sm:items-center ${
                  !item.isRead ? "bg-[#FFF8F0]/80" : "bg-white hover:bg-gray-50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white shadow-2xs">
                    {getIcon(item.type)}
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-[#333333]">
                        {item.title}
                      </p>
                      {!item.isRead && (
                        <span className="inline-block h-2 w-2 rounded-full bg-[#e02b20]" />
                      )}
                    </div>
                    <p className="text-xs leading-relaxed text-gray-600">
                      {item.message}
                    </p>
                    <p className="flex items-center gap-1 text-[11px] text-gray-400">
                      <Clock className="h-3 w-3" />
                      {new Date(item.createdAt).toLocaleString("en-PH", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                </div>

                {!item.isRead && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => markReadMutation.mutate(item.id)}
                    className="self-end text-xs sm:self-center"
                  >
                    Mark as Read
                  </Button>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
