"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Stethoscope,
  User,
  LucideIcon,
  LogOut,
  ChevronsUpDown,
} from "lucide-react";
import { Role } from "@/app/generated/prisma/enums";
import { useSession } from "@/components/providers/session-provider";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuBadge,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number | string;
}

export interface SidebarUserData {
  firstName?: string;
  lastName?: string;
  role?: string;
  email?: string;
}

interface SidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  navItems: NavItem[];
  user: SidebarUserData;
  onLogout?: () => void;
}

export function AppSidebar({
  navItems,
  user,
  onLogout,
}: SidebarProps) {
  const pathname = usePathname();
  const { logout } = useSession();
  const { setOpenMobile, isMobile } = useSidebar();

  const { firstName, lastName, role, email } = user;

  const fullName = user
    ? `${firstName || ""} ${lastName || ""}`.trim()
    : "User";

  const initials = user
    ? `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() || "U"
    : "U";

  const handleLogout = async () => {
    if (onLogout) {
      onLogout();
    } else {
      await logout();
    }
  };

  const isDoctorOrAdmin = role === Role.DOCTOR || role === Role.ADMIN;
  const displayName = isDoctorOrAdmin ? `Dr. ${fullName}` : fullName;

  return (
    <Sidebar
      collapsible="offcanvas"
      className="border-r border-slate-200 bg-white"
    >
      {/* Header Branding */}
      <SidebarHeader className="border-b border-slate-100 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-600/20">
            <Stethoscope className="h-6 w-6" />
          </div>
          <div className="flex flex-col min-w-0">
            <h1 className="text-base font-bold text-slate-900 leading-tight truncate">
              Dr. Jones Portal
            </h1>
            <p className="text-xs text-slate-500 truncate">Dental Management</p>
          </div>
        </div>
      </SidebarHeader>

      {/* Navigation Links */}
      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      isActive={isActive}
                      onClick={() => setOpenMobile(false)}
                      className={`w-full h-10 px-3.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-emerald-50 text-emerald-700 font-semibold hover:bg-emerald-100 hover:text-emerald-800"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <Link
                        href={item.href}
                        className="flex items-center gap-3"
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span className="truncate">{item.label}</span>
                        {item.badge !== undefined && (
                          <SidebarMenuBadge className="ml-auto bg-emerald-100 text-emerald-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                            {item.badge}
                          </SidebarMenuBadge>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* User Profile & Logout Footer */}
      <SidebarFooter className="border-t border-slate-100 p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 data-[state=open]:bg-slate-100 transition-colors text-left outline-none">
                <Avatar className="h-8 w-8 rounded-lg border border-slate-200 shrink-0">
                  <AvatarFallback className="bg-emerald-100 font-bold text-emerald-800 text-xs rounded-lg">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight min-w-0">
                  <span className="truncate font-semibold text-slate-900">
                    {displayName}
                  </span>
                  <span className="truncate text-xs text-slate-500 capitalize">
                    {role?.toLowerCase()}
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto size-4 text-slate-400 shrink-0" />
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-xl p-1"
                side={isMobile ? "bottom" : "top"}
                align="end"
                sideOffset={4}
              >
                {/* Wrapped in DropdownMenuGroup to satisfy Base UI context */}
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-2 py-1.5 text-left text-sm">
                      <Avatar className="h-8 w-8 rounded-lg border border-slate-200">
                        <AvatarFallback className="bg-emerald-100 font-bold text-emerald-800 text-xs rounded-lg">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight min-w-0">
                        <span className="truncate font-semibold text-slate-900">
                          {displayName}
                        </span>
                        <span className="truncate text-xs text-slate-500 capitalize">
                          {email?.toLowerCase()}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  <DropdownMenuItem >
                    <Link
                      href=""
                      className="cursor-pointer flex items-center gap-2"
                      onClick={() => setOpenMobile(false)}
                    >
                      <User className="h-4 w-4 text-slate-500" />
                      <span>Manage Account</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600 focus:bg-red-50 focus:text-red-600 cursor-pointer flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
