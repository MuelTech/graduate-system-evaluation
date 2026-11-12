"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  LayoutDashboard,
  FileSignature,
  Calendar,
  LogOut,
  Menu,
  X,
  User,
  BookOpen,
  Megaphone,
  Users,
  ClipboardCheck,
  PanelLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { NotificationBell } from "@/components/layout/notification-bell";
import { PortalBreadcrumbs } from "@/components/layout/portal-breadcrumbs";
import { PageGuideTrigger } from "@/components/evaluation/page-guide-overlay";
import { useEvaluationSession } from "@/lib/evaluation-session";
import { apiClientRequest } from "@/lib/api.client";
import type { Panelist } from "@/types/index";

const navItems = [
  { name: "Dashboard", href: "/faculty/dashboard", icon: LayoutDashboard },
  { name: "My Profile", href: "/faculty/profile", icon: User },
  {
    name: "Essay Evaluations",
    href: "/faculty/essay-evaluations",
    icon: ClipboardCheck,
    requiresEssayEval: true,
  },
  { name: "My Defenses", href: "/faculty/defenses", icon: Calendar },
  { name: "My Advisees", href: "/faculty/advisees", icon: Users },
  { name: "E-Signatures", href: "/faculty/signatures", icon: FileSignature },
  { name: "Research Repository", href: "/faculty/repository", icon: BookOpen },
  { name: "Announcements", href: "/faculty/announcements", icon: Megaphone },
];

export default function PanelistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const normalizedPathname = pathname.replace(/^\/panelist/, "/faculty");
  const router = useRouter();
  const { user } = useEvaluationSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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

  const canEvaluateEssays =
    panelistProfile ? Boolean(panelistProfile.canEvaluateEssays) : true;
  const visibleNavItems = navItems.filter(
    (item) => !item.requiresEssayEval || canEvaluateEssays,
  );

  // Immersive full-screen Defense Workspace: omit the outer Faculty sidebar and
  // top bar so the workspace owns 100% of the viewport without double headers.
  if (normalizedPathname.startsWith("/faculty/defense-workspace/")) {
    return <>{children}</>;
  }

  const handleSignOut = () => {
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#FFF8F0] md:flex-row">
      {/* Mobile Header */}
      <div className="flex items-center justify-between bg-[#b71c1c] p-4 text-white shadow-md md:hidden">
        <div className="flex items-center space-x-2">
          <Image
            src="/earist-logo.png"
            alt="EARIST Logo"
            width={32}
            height={32}
            className="object-contain"
          />
          <span className="text-lg font-bold tracking-wider">EARIST GS</span>
        </div>
        <div className="flex items-center gap-2">
          <PageGuideTrigger />
          <NotificationBell role="FACULTY" />
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded p-1 hover:bg-black/10"
          >
            {sidebarOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "block" : "hidden"
        } flex w-full shrink-0 flex-col bg-[#b71c1c] text-white shadow-xl transition-all duration-200 md:flex ${
          sidebarCollapsed ? "md:w-[72px]" : "md:w-64"
        }`}
      >
        <div
          className={`hidden items-center border-b border-white/10 transition-all duration-200 md:flex ${
            sidebarCollapsed
              ? "justify-center px-2 py-5"
              : "space-x-3 p-6"
          }`}
        >
          <Image
            src="/earist-logo.png"
            alt="EARIST Logo"
            width={sidebarCollapsed ? 36 : 45}
            height={sidebarCollapsed ? 36 : 45}
            className="shrink-0 object-contain drop-shadow"
          />
          {!sidebarCollapsed && (
            <div className="overflow-hidden">
              <h1 className="truncate text-xl leading-tight font-bold tracking-wider">
                EARIST
              </h1>
              <p className="truncate text-xs font-medium tracking-widest text-[#f9a825] uppercase">
                Faculty Portal
              </p>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <nav
            data-guide="faculty-sidebar-nav"
            className={`space-y-1 ${sidebarCollapsed ? "px-2" : "px-3"}`}
          >
            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                normalizedPathname === item.href ||
                normalizedPathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  title={sidebarCollapsed ? item.name : undefined}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center rounded-lg py-3 text-sm font-medium transition-colors ${
                    sidebarCollapsed
                      ? "justify-center px-2"
                      : "space-x-3 px-4"
                  } ${
                    isActive
                      ? "bg-[#f9a825] font-bold text-[#333333] shadow-sm"
                      : "text-white/90 hover:bg-black/15 hover:text-white"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 shrink-0 ${
                      isActive ? "text-[#333333]" : "text-white/80"
                    }`}
                  />
                  {!sidebarCollapsed && (
                    <span className="truncate">{item.name}</span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div
          className={`border-t border-white/10 bg-black/10 ${
            sidebarCollapsed ? "p-2" : "p-4"
          }`}
        >
          {!sidebarCollapsed && (
            <div className="mb-4 flex items-center space-x-3 px-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e02b20] text-sm font-bold">
                {user?.name?.charAt(0) || "F"}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium">
                  {user?.name}
                </p>
                <p className="truncate text-xs text-white/60">
                  {user?.email}
                </p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            title={sidebarCollapsed ? "Sign Out" : undefined}
            onClick={handleSignOut}
            className={`w-full cursor-pointer text-white/90 hover:bg-black/20 hover:text-white ${
              sidebarCollapsed ? "justify-center px-2" : "justify-start"
            }`}
          >
            <LogOut
              className={`h-4 w-4 shrink-0 ${sidebarCollapsed ? "" : "mr-2"}`}
            />
            {!sidebarCollapsed && "Sign Out"}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Top Desktop Bar */}
        <header className="z-10 hidden h-16 items-center justify-between border-b border-gray-200 bg-white px-6 md:flex">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarCollapsed((prev) => !prev)}
              aria-label={
                sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
              }
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="-ml-2 inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-md text-gray-600 transition-colors hover:bg-gray-100 hover:text-[#333333]"
            >
              <PanelLeft className="h-5 w-5" />
            </button>
            <div className="h-4 w-px bg-gray-200" />
            <PortalBreadcrumbs portal="faculty" />
          </div>
          <div className="flex items-center gap-4">
            <PageGuideTrigger />
            <div className="mr-1 text-right">
              <p className="text-sm leading-none font-bold text-[#333333]">
                {user?.name || "Faculty Member"}
              </p>
              <p className="mt-1 text-xs font-semibold tracking-wider text-[#e02b20] uppercase">
                Faculty Portal
              </p>
            </div>
            <NotificationBell role="FACULTY" />
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e02b20]/20 bg-[#e02b20]/10 font-bold text-[#e02b20] shadow-sm">
              {user?.name?.charAt(0) || "F"}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </div>
      </main>
    </div>
  );
}
