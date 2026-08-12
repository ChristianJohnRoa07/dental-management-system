"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { fetchCurrentUser, clearUser } from "@/lib/redux/slice/user/userSlice";
import { authApiService } from "@/lib/services/user/auth.service";
import { UI_ROUTES } from "@/lib/routes";
import { SESSION_DURATION } from "@/lib/constants";
import { apiClient } from "@/lib/services/axiosClient";

interface SessionContextType {
  user: any;
  status: "idle" | "loading" | "succeeded" | "failed";
  logout: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { user, status } = useAppSelector((state) => state.user);

  // Clear session memory & redirect to login
  const logout = useCallback(async () => {
    try {
      await authApiService.logout();
    } catch {
      // Ignore API failure on logout cleanup
    } finally {
      dispatch(clearUser());
      router.replace(UI_ROUTES.AUTH.LOGIN);
      router.refresh();
    }
  }, [dispatch, router]);

  // Session rehydration
  useEffect(() => {
    const isAuthPage =
      pathname?.includes("/login") || pathname?.includes("/forgot-password");
    if (status === "idle" && !isAuthPage) {
      dispatch(fetchCurrentUser());
    }
  }, [status, dispatch, pathname]);

  // Intercept 401 responses globally while leveraging Next.js router & Redux
  useEffect(() => {
    const interceptor = apiClient.interceptors.response.use(
      (response) => response,
      (error) => {
        const currentPath =
          typeof window !== "undefined" ? window.location.pathname : "";

        // Match any variation of auth/login endpoints or pages
        const isAuthEndpoint =
          error.config?.url?.includes("/auth/login") ||
          error.config?.url?.includes("/login");

        const isAuthPage =
          currentPath.includes("/login") ||
          currentPath.includes("/forgot-password");

        if (error.response?.status === 401 && !isAuthEndpoint && !isAuthPage) {
          dispatch(clearUser());
          router.replace(UI_ROUTES.AUTH.LOGIN);
        }
        return Promise.reject(error);
      },
    );

    return () => {
      apiClient.interceptors.response.eject(interceptor);
    };
  }, [dispatch, router]);

  useEffect(() => {
    if (!user) return;

    const timer = setTimeout(() => {
      logout();
    }, SESSION_DURATION);

    return () => clearTimeout(timer);
  }, [user, logout]);

  return (
    <SessionContext.Provider value={{ user, status, logout }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}