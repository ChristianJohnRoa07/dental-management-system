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

export interface CreateProcedurePayload {
  name: string;
  description: string;
  price: number;
  userId: string;
}

export const procedureApiService = {
  getProcedures: async (token?: string): Promise<Response> => {
    return apiClient.get("/procedures", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },
  
  createProcedure: async (
    payload: CreateProcedurePayload,
    token?: string
  ): Promise<Response> => {

    console.log("API Payload: ",payload);

    return apiClient.post("/procedures", payload, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },
};
