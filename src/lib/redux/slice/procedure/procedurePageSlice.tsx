import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ProcedureRecord {
  id: string;
  name: string;
  category: string;
  price: number;
  status: "Active" | "Inactive";
  description?: string;
}

export interface ProcedureFormData {
  name: string;
  category?: string;
  price: number;
  description?: string;
}

interface ProceduresState {
  procedures: ProcedureRecord[];
  searchQuery: string;
  statusFilter: string;
  editingProcedure: ProcedureRecord | null;
  viewingProcedure: ProcedureRecord | null;
  isCreateModalOpen: boolean;
}

const INITIAL_PROCEDURES: ProcedureRecord[] = [
  {
    id: "1",
    name: "Root Canal Therapy",
    category: "Endodontics",
    price: 650,
    status: "Active",
    description: "Treatment of the tooth's root canals and inflamed pulp.",
  },
  {
    id: "2",
    name: "Dental Crown Fitting",
    category: "Prosthodontics",
    price: 800,
    status: "Active",
    description: "Custom tooth-shaped cap placement to restore structure.",
  },
  {
    id: "3",
    name: "Routine Teeth Cleaning",
    category: "Preventive",
    price: 120,
    status: "Active",
    description: "Plaque/tartar removal and tooth polishing.",
  },
  {
    id: "4",
    name: "Surgical Tooth Extraction",
    category: "Oral Surgery",
    price: 350,
    status: "Inactive",
    description: "Removal of severely damaged or impacted teeth.",
  },
];

const initialState: ProceduresState = {
  procedures: INITIAL_PROCEDURES,
  searchQuery: "",
  statusFilter: "ALL",
  editingProcedure: null,
  viewingProcedure: null,
  isCreateModalOpen: false,
};

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
        status: "Active",
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
          description: data.description,
        };
      }

      state.editingProcedure = null;
    },
    toggleProcedureStatus: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const procedure = state.procedures.find((p) => p.id === id);
      if (procedure) {
        procedure.status = procedure.status === "Active" ? "Inactive" : "Active";
      }
    },
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