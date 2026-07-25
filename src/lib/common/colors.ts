// src/constants/colors.ts

export const DENTAL_PALETTE = {
  // Brand & Core Clinical Colors
  primary: {
    DEFAULT: "#0284C7", // Medical Sky/Teal
    hover: "#0369A1",
    light: "#E0F2FE",
  },
  secondary: {
    DEFAULT: "#0F172A", // Deep Navy Slate
    foreground: "#F8FAFC",
  },

  // Appointment & Workflow Statuses
  appointment: {
    scheduled: "#3B82F6", // Blue
    confirmed: "#10B981", // Green
    completed: "#64748B",  // Slate / Neutral
    cancelled: "#EF4444",  // Red
  },

  // Dental Charting & Tooth Conditions
  charting: {
    healthy: "#10B981",     // Green
    decayed: "#EF4444",     // Red / Caries
    filled: "#3B82F6",      // Blue / Restored
    crown: "#8B5CF6",       // Purple
    missing: "#94A3B8",     // Muted Gray
    impaction: "#F97316",   // Orange
  },

  // System Feedback
  status: {
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    info: "#06B6D4",
  },
} as const;

// TypeScript Types derived directly from constants
export type DentalPalette = typeof DENTAL_PALETTE;
export type AppointmentStatus = keyof typeof DENTAL_PALETTE.appointment;
export type ToothCondition = keyof typeof DENTAL_PALETTE.charting;