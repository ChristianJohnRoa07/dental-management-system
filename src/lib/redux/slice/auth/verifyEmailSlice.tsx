import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authApiService, VerifyEmailResponse } from "@/lib/services/user/auth.service";

interface VerifyEmailState {
  status: "idle" | "loading" | "success" | "error";
  errorMessage: string | null;
}

const initialState: VerifyEmailState = {
  status: "idle",
  errorMessage: null,
};

export const verifyEmail = createAsyncThunk<
  VerifyEmailResponse, 
  string,              
  { rejectValue: string }
>("verifyEmail/execute", async (token, { rejectWithValue }) => {
  if (!token) {
    return rejectWithValue("No verification token was provided.");
  }

  try {
    const response = await authApiService.verifyEmail({ token });
    return response;
  } catch (err: any) {
    
    const errorMessage =
      err.response?.data?.message ||
      err.message ||
      "An unexpected network error occurred. Please try again.";

    return rejectWithValue(errorMessage);
  }
});

const verifyEmailSlice = createSlice({
  name: "verifyEmail",
  initialState,
  reducers: {
    resetVerifyEmailState: (state) => {
      state.status = "idle";
      state.errorMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifyEmail.pending, (state) => {
        state.status = "loading";
        state.errorMessage = null;
      })
      .addCase(verifyEmail.fulfilled, (state) => {
        state.status = "success";
        state.errorMessage = null;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.status = "error";
        state.errorMessage = action.payload || "An unexpected error occurred.";
      });
  },
});

export const { resetVerifyEmailState } = verifyEmailSlice.actions;
export default verifyEmailSlice.reducer;