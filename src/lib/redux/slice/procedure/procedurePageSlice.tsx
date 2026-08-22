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
  fetchStatus: "idle" | "loading" | "succeeded" | "failed";
  createStatus: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  successMessage: string | null;
}

const initialState: ProceduresState = {
  procedures: [],
  searchQuery: "",
  statusFilter: "ALL",
  editingProcedure: null,
  viewingProcedure: null,
  isCreateModalOpen: false,
  fetchStatus: "idle",
  createStatus: "idle",
  error: null,
  successMessage: null,
};

export const getProcedures = createAsyncThunk<
  ProcedureRecord[],
  void,
  { state: RootState; rejectWithValue: string }
>("procedure/getProcedures", async (_, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const token = state.user.user?.token;

    if (!token) {
      return rejectWithValue(
        "Authentication token missing. Please sign in again.",
      );
    }

    const response = await procedureApiService.getProcedures(token);

    if (response.status !== "success" || !response.data) {
      return rejectWithValue(response.message || "Failed to fetch procedures");
    }

    const formattedData = response.data.map((item: any) => ({
      ...item,
      category: item.category ?? "General",
      isActive: Boolean(item.isActive),
    }));

    return formattedData;
  } catch (err: any) {
    const errorMessage =
      err.response?.data?.message || err.message || "An error occurred";
    return rejectWithValue(errorMessage);
  }
});

export const createProcedure = createAsyncThunk<
  string, // Returns success message string
  ProcedureFormData,
  { state: RootState; rejectWithValue: string }
>(
  "procedure/createProcedure",
  async (formData, { getState, dispatch, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.user.user?.token;
      const userId = state.user.user?.id;

      if (!token) {
        return rejectWithValue(
          "Authentication token missing. Please sign in again.",
        );
      }

      if (!userId) {
        return rejectWithValue("User ID is missing. Please sign in again.");
      }

      const payload = {
        name: formData.name,
        description: formData.description || "",
        category: formData.category,
        price: Number(formData.price),
        userId: userId,
      };

      const response = await procedureApiService.createProcedure(
        payload,
        token,
      );

      if (response.status !== "success") {
        return rejectWithValue(
          response.message,
        );
      }

      await dispatch(getProcedures());

      return "Procedure created successfully";
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || "An error occurred";
      return rejectWithValue(errorMessage);
    }
  },
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
    setEditingProcedure: (
      state,
      action: PayloadAction<ProcedureRecord | null>,
    ) => {
      state.editingProcedure = action.payload;
    },
    setViewingProcedure: (
      state,
      action: PayloadAction<ProcedureRecord | null>,
    ) => {
      state.viewingProcedure = action.payload;
    },

    // Sync Local Reducers
    updateProcedure: (state, action: PayloadAction<ProcedureFormData>) => {
      if (!state.editingProcedure) return;

      const data = action.payload;
      const index = state.procedures.findIndex(
        (p) => p.id === state.editingProcedure?.id,
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
      // Fetch Procedures
      .addCase(getProcedures.pending, (state) => {
        state.fetchStatus = "loading";
        state.error = null;
      })
      .addCase(
        getProcedures.fulfilled,
        (state, action: PayloadAction<ProcedureRecord[]>) => {
          state.fetchStatus = "succeeded";
          state.procedures = action.payload;
          state.error = null;
        },
      )
      .addCase(getProcedures.rejected, (state, action) => {
        state.fetchStatus = "failed";
        state.procedures = [];
        state.error =
          (action.payload as string) || "Failed to fetch procedures";
      })

      // Create Procedure
      .addCase(createProcedure.pending, (state) => {
        state.createStatus = "loading";
        state.error = null;
        state.successMessage = null;
      })
      .addCase(
        createProcedure.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.createStatus = "succeeded";
          state.successMessage = action.payload; // Store success message
          state.isCreateModalOpen = false;
          state.error = null;
        },
      )
      .addCase(createProcedure.rejected, (state, action) => {
        state.createStatus = "failed";
        state.error =
          (action.payload as string) || "Failed to create procedure";
        state.successMessage = null;
      });
  },
});

export const {
  setSearchQuery,
  setStatusFilter,
  setIsCreateModalOpen,
  setEditingProcedure,
  setViewingProcedure,
  updateProcedure,
  toggleProcedureStatus,
} = proceduresSlice.actions;

export default proceduresSlice.reducer;
