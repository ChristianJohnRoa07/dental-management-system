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
}

export interface UpdateProcedurePayload {
  id: string;
  name: string;
  description: string;
  price: number;
}

export interface ToggleProcedureStatusPayload{
  id: string;
}

export const procedureApiService = {
  getProcedures: async (): Promise<Response> => {
    return apiClient.get("/procedures");
  },
  
  createProcedure: async (
    payload: CreateProcedurePayload
  ): Promise<Response> => {
    return apiClient.post("/procedures", payload);
  },

  updateProcedure: async (
    payload: UpdateProcedurePayload
  ): Promise<Response> => {
    return apiClient.put("/procedures", payload);
  },

  toggleStatus: async (
    payload: ToggleProcedureStatusPayload
  ): Promise<Response> => {
    return apiClient.patch("/procedures", payload);
  },
};
