import {
  Activity,
  Calendar as CalendarIcon,
  User,
  ShieldUser,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";
import { UI_ROUTES } from "@/lib/routes";

export type UserRole = "ADMIN" | "DOCTOR" | "RECEPTIONIST";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number | string;
  roles?: UserRole[];
}

export const BASE_NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: UI_ROUTES.DASHBOARD,
    icon: Activity,
    roles: ["ADMIN", "DOCTOR", "RECEPTIONIST"],
  },
  {
    label: "Appointments",
    href: UI_ROUTES.APPOINTMENTS,
    icon: CalendarIcon,
    badge: 12,
    roles: ["ADMIN", "DOCTOR", "RECEPTIONIST"],
  },
  {
    label: "Patients",
    href: UI_ROUTES.PATIENTS,
    icon: User,
    roles: ["ADMIN", "DOCTOR", "RECEPTIONIST"],
  },
  {
    label: "Procedures & Services",
    href: UI_ROUTES.PROCEDURES,
    icon: Stethoscope,
    roles: ["ADMIN", "DOCTOR"],
  },
  {
    label: "Accounts Management",
    href: UI_ROUTES.ACCOUNTS_MANAGEMENT,
    icon: ShieldUser,
    roles: ["ADMIN"],
  },
];

export const getNavItemsForRole = (userRole?: UserRole | string): NavItem[] => {
  if (!userRole) return BASE_NAV_ITEMS;

  return BASE_NAV_ITEMS.filter(
    (item) => !item.roles || item.roles.includes(userRole as UserRole),
  );
};
