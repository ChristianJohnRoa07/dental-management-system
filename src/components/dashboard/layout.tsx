"use client";

import React, { useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, Bell, CalendarPlus, Menu } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/appSidebar";
import { UI_ROUTES } from "@/lib/routes";
import { getNavItemsForRole } from "@/config/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  toggleMobileMenu,
  closeMobileMenu,
} from "@/lib/redux/slice/dashboard/dashboardSlice";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isMobileOpen } = useAppSelector(
    (state) => state.dashboard,
  );
  const { user, status } = useAppSelector((state) => state.user);

  const userData = useMemo(() => {
    if (!user) return { firstName: "", lastName: "", role: "", email: "" };

    return {
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      email: user.email
    };
  }, [user]);

  const navItems = useMemo(
    () => getNavItemsForRole(userData.role),
    [userData.role],
  );

  // Automatically close mobile sidebar when path changes
  useEffect(() => {
    dispatch(closeMobileMenu());
  }, [pathname, dispatch]);

  const handleSetIsMobileOpen = (open: boolean) => {
    dispatch(toggleMobileMenu(open));
  };

  useEffect(() => {
    if (status === "failed" || (status === "succeeded" && !user)) {
      router.replace(UI_ROUTES.AUTH.LOGIN);
    }
  }, [status, user, router]);

  // Show loading indicator while verifying cookie session
  if (status === "idle" || status === "loading") {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center space-y-3 bg-slate-50">
        <Loader2 className="h-8 w-8 text-emerald-600 animate-spin" />
        <p className="text-sm font-medium text-slate-600">
          Verifying session...
        </p>
      </div>
    );
  }

  // Render dashboard children if authenticated
  if (!user) return null;

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-full bg-slate-50 font-sans text-slate-900 antialiased overflow-hidden">

        {/* Sidebar Navigation */}
        <AppSidebar
          isMobileOpen={isMobileOpen}
          navItems={navItems}
          setIsMobileOpen={handleSetIsMobileOpen}
          user={userData}
        />

        {/* Main Container */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Top Header */}
          <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 shrink-0 gap-3">
            <div className="flex items-center gap-3 flex-1 max-w-md">
              <SidebarTrigger className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg" />

              
            </div>
          </header>

          {/* Page Content Workspace */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
