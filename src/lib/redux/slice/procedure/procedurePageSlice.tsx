import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/lib/redux/store";
import { procedureApiService } from "@/lib/services/procedure/procedure.service";

export interface ProcedureRecord {
  id: string;
  name: string;
  category: string;
  price: number;
  isActive: boolean;
  status?: string;
  description?: string;
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
}

export interface ProcedureFormData {
  name: string;
  category?: string;
  price: number;
  description?: string;
  isActive?: boolean;
}

interface ProceduresState {
  procedures: ProcedureRecord[];
  searchQuery: string;
  statusFilter: string;
  editingProcedure: ProcedureRecord | null;
  viewingProcedure: ProcedureRecord | null;
  isCreateModalOpen: boolean;
  apiStatus: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ProceduresState = {
  procedures: [],
  searchQuery: "",
  statusFilter: "ALL",
  editingProcedure: null,
  viewingProcedure: null,
  isCreateModalOpen: false,
  apiStatus: "idle",
  error: null,
};

export const getProcedures = createAsyncThunk<
  any,
  void,
  { state: RootState; rejectWithValue: string }
>(
  "procedure/getProcedures",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.user.user?.token;

      if (!token) {
        return rejectWithValue("Authentication token missing. Please sign in again.");
      }

      const response = await procedureApiService.getProcedures(token);

      if (response.status !== "success" || !response.data) {
        return rejectWithValue(response.message || "Failed to fetch procedures");
      }

      const formattedData = response.data.map((item: ProcedureFormData) => ({
        ...item,
        category: item.category ?? "General",
        isActive: item.isActive ? "ACTIVE" : "INACTIVE",
      }));

      return formattedData;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || "An error occurred";
      return rejectWithValue(errorMessage);
    }
  }
);

export const proceduresSlice = createSlice({
  name: "procedures",
  initialState,
  reducers: {
    // Filter & Search
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setStatusFilter: (state, action: PayloadAction<string>) => {
      state.statusFilter = action.payload;
    },

    // Modals & Active Selections
    setIsCreateModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isCreateModalOpen = action.payload;
    },
    setEditingProcedure: (state, action: PayloadAction<ProcedureRecord | null>) => {
      state.editingProcedure = action.payload;
    },
    setViewingProcedure: (state, action: PayloadAction<ProcedureRecord | null>) => {
      state.viewingProcedure = action.payload;
    },

    // CRUD Actions
    createProcedure: (state, action: PayloadAction<ProcedureFormData>) => {
      const data = action.payload;
      const newProcedure: ProcedureRecord = {
        id: String(Date.now()),
        name: data.name,
        category: data.category ?? "General",
        price: Number(data.price),
        isActive: data.isActive ?? true,
        description: data.description,
      };

      state.procedures.unshift(newProcedure);
      state.isCreateModalOpen = false;
    },
    updateProcedure: (state, action: PayloadAction<ProcedureFormData>) => {
      if (!state.editingProcedure) return;

      const data = action.payload;
      const index = state.procedures.findIndex(
        (p) => p.id === state.editingProcedure?.id
      );

      if (index !== -1) {
        state.procedures[index] = {
          ...state.editingProcedure,
          name: data.name,
          category: data.category ?? "General",
          price: Number(data.price),
          isActive: data.isActive ?? state.editingProcedure.isActive,
          description: data.description,
        };
      }

      state.editingProcedure = null;
    },
    toggleProcedureStatus: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const procedure = state.procedures.find((p) => p.id === id);
      if (procedure) {
        procedure.isActive = !procedure.isActive;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProcedures.pending, (state) => {
        state.apiStatus = "loading";
        state.error = null;
      })
      .addCase(
        getProcedures.fulfilled,
        (state, action: PayloadAction<ProcedureRecord[]>) => {
          state.apiStatus = "succeeded";
          state.procedures = action.payload;
          state.error = null;
        }
      )
      .addCase(getProcedures.rejected, (state, action) => {
        state.apiStatus = "failed";
        state.procedures = [];
        state.error = (action.payload as string) || "Failed to fetch procedures";
      });
  },
});

export const {
  setSearchQuery,
  setStatusFilter,
  setIsCreateModalOpen,
  setEditingProcedure,
  setViewingProcedure,
  createProcedure,
  updateProcedure,
  toggleProcedureStatus,
} = proceduresSlice.actions;

export default proceduresSlice.reducer;