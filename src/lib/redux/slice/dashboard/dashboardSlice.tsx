import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface DashboardState {
  collapseSidebar: boolean;
  isMobileOpen: boolean;
  isSearchExpanded: boolean;
  searchQuery: string;
}

const initialState: DashboardState = {
  collapseSidebar: false,
  isMobileOpen: false,
  isSearchExpanded: false,
  searchQuery: "",
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setCollapseSidebar: (
      state,
      action: PayloadAction<boolean | undefined>
    ) => {
      if (typeof action.payload === "boolean") {
        state.collapseSidebar = action.payload;
      } else {
        state.collapseSidebar = !state.collapseSidebar;
      }
    },

    toggleMobileMenu: (
      state,
      action: PayloadAction<boolean | undefined>
    ) => {
      if (typeof action.payload === "boolean") {
        state.isMobileOpen = action.payload;
      } else {
        state.isMobileOpen = !state.isMobileOpen;
      }
    },

    closeMobileMenu: (state) => {
      state.isMobileOpen = false;
    },

    setIsSearchExpanded: (
      state,
      action: PayloadAction<boolean | undefined>
    ) => {
      if (typeof action.payload === "boolean") {
        state.isSearchExpanded = action.payload;
      } else {
        state.isSearchExpanded = !state.isSearchExpanded;
      }
    },

    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
  },
});

export const {
  setCollapseSidebar,
  toggleMobileMenu,
  closeMobileMenu,
  setIsSearchExpanded,
  setSearchQuery
} = dashboardSlice.actions;

export default dashboardSlice.reducer;