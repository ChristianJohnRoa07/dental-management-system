import { apiClient } from "../axiosClient";

export interface UserData {
  id: string;
  username: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
  token: string;
}

export interface UserResponse {
  status: "success" | "error";
  data?: UserData;
  message?: string;
}

export const userApiService = {
  getCurrentUser: async (): Promise<UserResponse> => {
    return apiClient.get("/auth/user");
  },
};