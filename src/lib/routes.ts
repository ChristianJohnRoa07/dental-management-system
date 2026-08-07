export const API_RECOGNIZED_ROUTES = /^\/api\/(user|auth|procedures|patients|appointments)/;

export const API_PROTECTED_ROUTES = /^\/api\/(procedures|patients|appointments)/;

export const UI_ROUTES = {
  HOME: "/",
  AUTH: {
    LOGIN: "/login",
    REGISTER: "/register",
    VERIFY_ACCOUNT: "/verify-account",
    FORGOT_PASSWORD: "/forgot-password",
    RESET_PASSWORD: "/reset-password"
  },
  DASHBOARD: "/dashboard",
  APPOINTMENTS: {
    ROOT: "/appointments",
    NEW: "/appointments/new",
    DETAILS: (id: string | number) => `/appointments/${id}`,
  },
  PATIENTS: {
    ROOT: "/patients",
    DETAILS: (id: string | number) => `/patients/${id}`,
  },
  PROCEDURES: "/procedures",
} as const;

export type AppRoute = typeof UI_ROUTES;