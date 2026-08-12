import axios from "axios";
import { UI_ROUTES } from "@/lib/routes";

export const apiClient = axios.create({
  baseURL: "/api", // Points to your Next.js API routes
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error)
);