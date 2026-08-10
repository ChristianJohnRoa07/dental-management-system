"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Stethoscope,
  Activity,
  Calendar as CalendarIcon,
  Users,
  Search,
  Bell,
  CalendarPlus,
  Menu,
  X,
} from "lucide-react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { UI_ROUTES } from "@/lib/routes";
import { getNavItemsForRole } from "@/config/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  toggleMobileMenu,
  closeMobileMenu,
  setSearchQuery,
} from "@/lib/redux/slice/dashboard/dashboardSlice";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  const { isMobileOpen, searchQuery } = useAppSelector((state) => state.dashboard);
  
  // const userRole = useAppSelector((state) => state.user?.role) || "DOCTOR"; Uncomment this upon implementation of roles
  const userRole = "DOCTOR";

  const navItems = useMemo(() => getNavItemsForRole(userRole), [userRole]);

  // Automatically close mobile sidebar when path changes
  useEffect(() => {
    dispatch(closeMobileMenu());
  }, [pathname, dispatch]);

  const handleSetIsMobileOpen = (open: boolean) => {
    dispatch(toggleMobileMenu(open));
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 antialiased overflow-hidden">
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => dispatch(closeMobileMenu())}
        />
      )}

      {/* Sidebar Navigation */}
      <Sidebar
        isMobileOpen={isMobileOpen}
        navItems={navItems}
        setIsMobileOpen={handleSetIsMobileOpen}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 shrink-0 gap-3">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            {/* Hamburger Button for Mobile/Tablet */}
            <button
              type="button"
              onClick={() => dispatch(toggleMobileMenu(true))}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg lg:hidden"
              aria-label="Open Sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Search Input */}
            <div className="relative w-full">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search patients, procedures..."
                value={searchQuery}
                onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white"></span>
            </button>

            <div className="h-6 w-px bg-slate-200 my-auto hidden sm:block"></div>

            <Link
              href={UI_ROUTES.APPOINTMENTS.NEW}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-3 sm:px-4 py-2 rounded-lg shadow-sm transition-colors"
            >
              <CalendarPlus className="h-4 w-4" />
              <span className="hidden sm:inline">New Appointment</span>
            </Link>
          </div>
        </header>

        {/* Page Content Workspace */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
