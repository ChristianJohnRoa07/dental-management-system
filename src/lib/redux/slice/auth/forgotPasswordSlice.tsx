import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
    authApiService,
    ForgotPasswordPayload,
    ForgotPasswordResponse,
} from "@/lib/api/auth.service";

export interface ForgotPasswordFormState {
    email: string;
}

export interface ForgotPasswordState {
  forgotPasswordForm: ForgotPasswordFormState;
  isSubmitted: boolean;
  isSubmitting: boolean;
  errorMessage: string | null;
  successMessage: string | null;
}

const initialForgotPasswordFormState: ForgotPasswordFormState = {
  email: "",
};

const initialState: ForgotPasswordState = {
  forgotPasswordForm: initialForgotPasswordFormState,
  isSubmitted: false,
  isSubmitting: false,
  errorMessage: null,
  successMessage: null,
};

export const forgotPasswordDispatch = createAsyncThunk<
  ForgotPasswordResponse,
  ForgotPasswordPayload,
  { rejectValue: string }
>("auth/forgotPasswordData", async (payload, { rejectWithValue }) => {
  try {
    const response = await authApiService.forgotPassword(payload);
    return response;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || err.message || "Failed to send reset email."
    );
  }
});

const forgotPasswordSlice = createSlice({
  name: "forgotPassword",
  initialState,
  reducers: {
    setForgotPasswordEmail: (
      state,
      action: PayloadAction<{ value: string }>
    ) => {
      state.forgotPasswordForm.email = action.payload.value;
    },

    // setIsLoading: (state, action: PayloadAction<boolean>) => {
    //   state.isLoading = action.payload;
    // },

    clearForgotPasswordError: (state) => {
      state.errorMessage = null;
    },

    resetForgotPasswordForm: (state) => {
      state.forgotPasswordForm = initialForgotPasswordFormState;
      state.isSubmitted = false;
      state.errorMessage = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Forgot Password Handlers
      .addCase(forgotPasswordDispatch.pending, (state) => {
        state.isSubmitting = true;
        state.errorMessage = null;
        state.isSubmitted = false;
      })
      .addCase(
        forgotPasswordDispatch.fulfilled,
        (state, action: PayloadAction<ForgotPasswordResponse>) => {
          state.isSubmitting = false;
          state.isSubmitted = true;
          state.successMessage =
            action.payload.message ||
            "If an account exists, a password reset link has been sent.";
        }
      )
      .addCase(forgotPasswordDispatch.rejected, (state, action) => {
        state.errorMessage = action.payload || "Failed to send reset email.";
      });
  },
});

export const {
  setForgotPasswordEmail,
  clearForgotPasswordError,
  resetForgotPasswordForm,
} = forgotPasswordSlice.actions;

export default forgotPasswordSlice.reducer;

