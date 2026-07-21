import { configureStore } from '@reduxjs/toolkit';

import dashboardReducer from "@/lib/redux/slice/dashboard/dashboardSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      // Add your slices here
      dashboard: dashboardReducer,

    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];