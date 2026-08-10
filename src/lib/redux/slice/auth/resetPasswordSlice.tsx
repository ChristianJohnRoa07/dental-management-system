import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  authApiService,
  ResetPasswordPayload,
  ResetPasswordResponse,
} from "@/lib/services/auth.service";

export interface ResetPasswordFormState {
  newPassword: string;
  confirmPassword: string;
  token: string;
}

export interface ResetPasswordState {
  resetPasswordForm: ResetPasswordFormState;
  isSubmitted: boolean;
  isSubmitting: boolean;
  errorMessage: string | null;
  successMessage: string | null;
}

const initialResetPasswordFormState: ResetPasswordFormState = {
  newPassword: "",
  token: "",
};

const initialState: ResetPasswordState = {
  resetPasswordForm: initialResetPasswordFormState,
  isSubmitted: false,
  isSubmitting: false,
  errorMessage: null,
  successMessage: null,
};

export const resetPasswordDispatch = createAsyncThunk<
  ResetPasswordResponse,
  ResetPasswordPayload,
  { rejectValue: string }
>("auth/resetPasswordData", async (payload, { rejectWithValue }) => {
  try {
    const response = await authApiService.resetPassword(payload);
    return response;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message ||
        err.message ||
        "Failed to reset password.",
    );
  }
});

const resetPasswordSlice = createSlice({
  name: "resetPassword",
  initialState,
  reducers: {
    setResetPasswordToken: (state, action: PayloadAction<string>) => {
      state.resetPasswordForm.token = action.payload;
    },

    clearResetPasswordError: (state) => {
      state.errorMessage = null;
    },

    resetResetPasswordState: (state) => {
      state.resetPasswordForm = initialResetPasswordFormState;
      state.isSubmitted = false;
      state.isSubmitting = false;
      state.errorMessage = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(resetPasswordDispatch.pending, (state) => {
        state.isSubmitting = true;
        state.errorMessage = null;
        state.isSubmitted = false;
      })
      .addCase(
        resetPasswordDispatch.fulfilled,
        (state, action: PayloadAction<ResetPasswordResponse>) => {
          state.isSubmitting = false;
          state.isSubmitted = true;
          state.successMessage =
            action.payload.message || "Password updated successfully.";
        },
      )
      .addCase(resetPasswordDispatch.rejected, (state, action) => {
        state.isSubmitting = false;
        state.errorMessage = action.payload || "Failed to reset password.";
      });
  },
});

export const {
  setResetPasswordToken,
  clearResetPasswordError,
  resetResetPasswordState,
} = resetPasswordSlice.actions;

export default resetPasswordSlice.reducer;
