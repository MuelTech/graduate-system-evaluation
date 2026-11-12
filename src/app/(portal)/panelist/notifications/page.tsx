"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Calendar,
} from "lucide-react";
import { apiClientRequest } from "@/lib/api.client";
import type { NotificationItem } from "@/types/index";

export default function PanelistNotificationsPage() {
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery<NotificationItem[]>({
    queryKey: ["panelistNotifications"],
    queryFn: async () =>
      (await apiClientRequest("/notifications")) as NotificationItem[],
  });

  const markAsRead = useMutation({
    mutationFn: async (id: string) =>
      apiClientRequest(`/notifications/${id}/read`, { method: "PUT" }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["panelistNotifications"] });
      void queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const getIcon = (type: string) => {
    switch (type) {
      case "MEMO":
        return <Bell className="h-5 w-5 text-blue-500" />;
      case "DEFENSE_SCHEDULE":
        return <Calendar className="h-5 w-5 text-purple-500" />;
      case "RESIDENCY_WARNING":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <FileCheck className="h-5 w-5 text-green-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#e02b20]">Notifications</h2>
        <p className="text-sm text-[#333333]">
          Track defense assignments, incoming Thesis Adviser Requests,
          manuscript review submissions, and Rapporteur Report signature alerts.
        </p>
      </div>

      <Card
        data-guide="notifications-list"
        className="border-gray-200 shadow-sm"
      >
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-sm text-[#333333]">
              Loading...
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-12 text-center">
              <CheckCircle2 className="mx-auto mb-3 h-10 w-10 text-green-500 opacity-50" />
              <p className="text-sm font-bold text-[#333333]">
                You&apos;re all caught up!
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {notifications.map((n: NotificationItem) => (
                <div
                  key={n.id}
                  className={`flex gap-4 p-4 transition-colors sm:p-6 ${
                    n.isRead ? "bg-white" : "bg-red-50/40"
                  }`}
                >
                  <div className="mt-1">{getIcon(n.type || "MEMO")}</div>
                  <div className="flex-1">
                    <div className="mb-1 flex items-start justify-between">
                      <h4
                        className={`text-sm font-bold ${
                          n.isRead ? "text-[#333333]" : "text-[#e02b20]"
                        }`}
                      >
                        {n.title}
                      </h4>
                      <span className="text-[10px] text-gray-500">
                        {new Date(n.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p
                      className={`mb-3 text-sm ${
                        n.isRead ? "text-[#333333]" : "text-black"
                      }`}
                    >
                      {n.message}
                    </p>
                    {!n.isRead && (
                      <button
                        type="button"
                        onClick={() => markAsRead.mutate(n.id)}
                        className="flex cursor-pointer items-center gap-1 text-xs font-bold text-[#e02b20] hover:underline"
                      >
                        <CheckCircle2 className="h-3 w-3" /> Mark as Read
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
