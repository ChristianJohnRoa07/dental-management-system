import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  authApiService,
  LoginPayload,
  LoginResponse,
} from "@/lib/services/user/auth.service";

export interface LoginFormState {
  username: string;
  password: string;
}

export interface LoginState {
  loginForm: LoginFormState;
  showPassword: boolean;
  isLoading: boolean;
  isRedirecting: boolean;
  isVerified: boolean | null;
  unverifiedEmail: string | null;
  loginError: string | null;
}

const initialLoginState: LoginFormState = {
  username: "",
  password: "",
};

const initialState: LoginState = {
  loginForm: initialLoginState,
  showPassword: false,
  isLoading: false,
  isRedirecting: false,
  isVerified: null,
  unverifiedEmail: null,
  loginError: null,
};

export const loginUserDispatch = createAsyncThunk<
  LoginResponse,
  LoginPayload,
  { rejectValue: string }
>("login/loginUser", async (credentials, { rejectWithValue }) => {
  try {
    const response = await authApiService.login(credentials);
    return response;
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to log in.");
  }
});

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    handleLogin: (
      state,
      action: PayloadAction<{
        name: keyof LoginFormState;
        value: string;
      }>,
    ) => {
      const { name, value } = action.payload;
      state.loginForm[name] = value;
    },

    toggleShowPassword: (state) => {
      state.showPassword = !state.showPassword;
    },

    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setIsRedirecting: (state, action: PayloadAction<boolean>) => {
      state.isRedirecting = action.payload;
    },

    resetLoginForm: (state) => {
      state.loginForm = initialLoginState;
      state.showPassword = false;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder

      // Login
      .addCase(loginUserDispatch.pending, (state) => {
        state.isLoading = true;
        state.loginError = null;
      })
      .addCase(
        loginUserDispatch.fulfilled,
        (state, action: PayloadAction<LoginResponse>) => {
          state.isLoading = false;
          state.isVerified = action.payload.isVerified;
          if (!action.payload.isVerified) {
            state.unverifiedEmail = action.payload.email;
          }
        },
      )
      .addCase(loginUserDispatch.rejected, (state, action) => {
        state.isLoading = false;
        state.loginError = action.payload || "Login failed";
      });
  },
});

export const { handleLogin, toggleShowPassword, setIsLoading, setIsRedirecting, resetLoginForm } =
  loginSlice.actions;

export default loginSlice.reducer;
