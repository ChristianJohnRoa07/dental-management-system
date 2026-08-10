import axios from "axios";

export const apiClient = axios.create({
  baseURL: "/api", // Points to your Next.js API routes
  headers: {
    "Content-Type": "application/json",
  },
});

// Response Interceptor for global error handling
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || "An unexpected error occurred.";
    return Promise.reject(new Error(message));
  }
);