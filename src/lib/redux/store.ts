import { configureStore } from '@reduxjs/toolkit';

import loginReducer from "@/lib/redux/slice/auth/loginSlice";
import forgotPasswordReducer from "@/lib/redux/slice/auth/forgotPasswordSlice";
import dashboardReducer from "@/lib/redux/slice/dashboard/dashboardSlice";


export const makeStore = () => {
  return configureStore({
    reducer: {
      // Add your slices here
      login: loginReducer,
      forgotPassword: forgotPasswordReducer,
      dashboard: dashboardReducer,

    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];