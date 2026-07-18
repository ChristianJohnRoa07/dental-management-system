import { configureStore } from '@reduxjs/toolkit';

export const makeStore = () => {
  return configureStore({
    reducer: {
      // Add your slices here
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];