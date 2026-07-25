import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState: {
        collapseSidebar: false,
        isMobileOpen: false,
        isSearchExpanded: false,
    },
    reducers: {
        setCollapseSidebar: (state, action: PayloadAction<boolean | undefined>) => {
            if (typeof action.payload === 'boolean') {
                state.collapseSidebar = action.payload;
            } else {
                // If no payload is sent, it still toggles
                state.collapseSidebar = !state.collapseSidebar;
            }
        },
        toggleMobileMenu: (state) => {
            state.isMobileOpen = !state.isMobileOpen;
        },
        setIsSearchExpanded: (state) => {
            state.isSearchExpanded = !state.isSearchExpanded;
        },
    },
    extraReducers: (builder) => {

    }
});

export const {

    setCollapseSidebar,
    setIsSearchExpanded,
    toggleMobileMenu,

} = dashboardSlice.actions;
export default dashboardSlice.reducer;