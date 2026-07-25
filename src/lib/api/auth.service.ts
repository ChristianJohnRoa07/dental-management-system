import { apiClient } from "./axiosClient";

export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  isVerified: boolean;
  email: string;
  token?: string;
}

export const authApiService = {
  login: async (credentials: LoginPayload): Promise<LoginResponse> => {
    return apiClient.post("/auth/login", credentials);
  },
};