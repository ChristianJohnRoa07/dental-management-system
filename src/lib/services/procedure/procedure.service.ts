import { apiClient } from "../axiosClient";

export interface ProcedureData {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  isActive: boolean;
  createdAt: Date;
  createdBy: string;
}

export interface Response {
  status: "success" | "error";
  data?: ProcedureData[];
  message?: string;
}

export const procedureApiService = {
  getProcedures: async (token?: string): Promise<Response> => {
    return apiClient.get("/procedures", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },
};
