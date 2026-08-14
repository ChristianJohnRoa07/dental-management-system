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
import { DENTAL_PALETTE } from "@/lib/common/colors";
import { TITLE, APP_NAME } from "@/lib/constants";

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

function Tooth({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M18.5 3C16.5 3 15 4.5 12 6.5C9 4.5 7.5 3 5.5 3C3 3 2 5 2 8c0 4.5 2 9.5 3.5 12.5C6.3 22.1 7.8 22 9 20c.8-1.3 1.5-3 3-3s2.2 1.7 3 3c1.2 2 2.7 2.1 3.5.5C20 17.5 22 12.5 22 8c0-3-1-5-3.5-5z" />
    </svg>
  );
}

export function AppSidebar({ navItems, user, onLogout }: SidebarProps) {
  const pathname = usePathname();
  const { logout } = useSession();
  const { setOpenMobile, isMobile, state } = useSidebar();

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
  const displayEmail = email?.toLocaleLowerCase();

  return (
    <Sidebar collapsible="icon" className="border-r border-slate-200 bg-white">
      {/* Header Branding */}
      <SidebarHeader className="border-b border-slate-100 p-4 group-data-[collapsible=icon]:p-2">
        <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
          <div
            className="h-8 w-8 rounded-lg flex items-center justify-center text-white shrink-0"
            style={{ backgroundColor: DENTAL_PALETTE.primary.DEFAULT }}
          >
            <Tooth className="h-5 w-5" />
          </div>
          <div className="flex flex-col min-w-0 group-data-[collapsible=icon]:hidden">
            <h1 className="text-base font-bold text-slate-900 leading-tight truncate">
              {TITLE}
            </h1>
            <p className="text-xs text-slate-500 truncate">{APP_NAME}</p>
          </div>
        </div>
      </SidebarHeader>

      {/* Navigation Links */}
      <SidebarContent className="p-2 group-data-[collapsible=icon]:px-0">
        <SidebarGroup className="p-0 group-data-[collapsible=icon]:p-0">
          <SidebarGroupContent>
            <SidebarMenu className="group-data-[collapsible=icon]:items-center">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <SidebarMenuItem
                    key={item.href}
                    className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-full"
                  >
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={item.label}
                      onClick={() => setOpenMobile(false)}
                      className={`w-full cursor-pointer h-10 px-3.5 rounded-lg text-sm font-medium transition-colors group-data-[collapsible=icon]:!size-10 group-data-[collapsible=icon]:!p-0 group-data-[collapsible=icon]:justify-center ${
                        isActive
                          ? "!bg-emerald-50 !text-emerald-700 font-semibold hover:!bg-emerald-100 hover:!text-emerald-900 data-[active=true]:!bg-emerald-50 data-[active=true]:!text-emerald-800"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                      render={
                        <Link
                          href={item.href}
                          className="flex items-center justify-start group-data-[collapsible=icon]:justify-center w-full h-full gap-3 group-data-[collapsible=icon]:gap-0"
                        />
                      }
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                      <span className="truncate group-data-[collapsible=icon]:hidden">
                        {item.label}
                      </span>
                      {item.badge !== undefined && (
                        <SidebarMenuBadge className="ml-auto bg-emerald-100 text-emerald-800 text-xs font-semibold px-2 py-0.5 rounded-full group-data-[collapsible=icon]:hidden">
                          {item.badge}
                        </SidebarMenuBadge>
                      )}
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
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-slate-100 data-[state=open]:text-sidebar-accent-foreground cursor-pointer group-data-[collapsible=icon]:!p-0 group-data-[collapsible=icon]:justify-center"
                  />
                }
              >
                <Avatar className="h-8 w-8 rounded-lg border border-slate-200 shrink-0">
                  <AvatarFallback className="bg-emerald-100 font-bold text-emerald-800 text-xs rounded-lg">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight min-w-0 group-data-[collapsible=icon]:hidden">
                  <span className="truncate font-semibold text-slate-900">
                    {displayName}
                  </span>
                  <span className="truncate text-xs text-slate-500 capitalize">
                    {role?.toLowerCase()}
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto size-4 text-slate-400 shrink-0 group-data-[collapsible=icon]:hidden" />
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-xl p-1"
                side={
                  isMobile ? "bottom" : state === "collapsed" ? "right" : "top"
                }
                align="end"
                sideOffset={4}
              >
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
                        <span className="truncate text-xs text-slate-500 lowercase">
                          {displayEmail}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => setOpenMobile(false)}
                    className="cursor-pointer"
                    render={
                      <Link
                        href="#"
                        className="cursor-pointer flex items-center gap-2 w-full text-slate-700"
                      />
                    }
                  >
                    <User className="h-4 w-4 text-slate-500" />
                    <span>Manage Account</span>
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
