"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Stethoscope, X, LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number | string;
}

interface SidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  navItems: NavItem[];
}

export function Sidebar({
  isMobileOpen,
  setIsMobileOpen,
  navItems,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
        isMobileOpen ? "translate-x-0 shadow-xl" : "-translate-x-full"
      }`}
    >
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
            <Stethoscope className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-bold text-base text-slate-900 leading-tight">
              Dr. Jones Portal
            </h1>
            <p className="text-xs text-slate-500">Dental Management</p>
          </div>
        </div>

        {/* Close button for Mobile/Tablet */}
        <button
          type="button"
          onClick={() => setIsMobileOpen(false)}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 lg:hidden"
          aria-label="Close Sidebar"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-emerald-50 text-emerald-700 font-semibold"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
              {item.badge !== undefined && (
                <span className="ml-auto bg-emerald-100 text-emerald-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Profile Footer */}
      <div className="p-4 border-t border-slate-100 flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center font-bold text-slate-700 text-sm">
          DJ
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-900 truncate">
            Dr. Sarah Jones
          </p>
          <p className="text-xs text-slate-500 truncate">Lead Orthodontist</p>
        </div>
      </div>
    </aside>
  );
}