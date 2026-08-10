import axios from "axios";
import { UI_ROUTES } from "@/lib/routes";

export const apiClient = axios.create({
  baseURL: "/api", // Points to your Next.js API routes
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response Interceptor for global error handling
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // If any protected request returns 401 Unauthorized
    if (error.response && error.response.status === 401) {
      if (typeof window !== "undefined") {
        // Clear client storage if applicable and redirect to login
        window.location.href = UI_ROUTES.AUTH.LOGIN;
      }
    }
    return Promise.reject(error);
  }
);