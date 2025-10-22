import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { postLogin } from "@/services/api/AuthAPI";
import { PrivateAxios } from "@/services/PrivateAxios";

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  error: null,
};

export const login = createAsyncThunk<
  void,
  { email: string; password: string },
  { rejectValue: string }
>("/auth/login", async (payload, { rejectWithValue }) => {
  try {
    const res = await postLogin(payload);
    if (res.pass) {
      return;
    } else return rejectWithValue(res.data as string);
  } catch (error) {
    return rejectWithValue("서버오류");
  }
});

export const checkAuth = createAsyncThunk<void, void, { rejectValue: string }>(
  "/auth/check",
  async (_, { rejectWithValue }) => {
    try {
      await PrivateAxios.get("/admin/management/me");
      return;
    } catch {
      return rejectWithValue("인증 실패");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isAuthenticated = false;
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state) => {
        state.isAuthenticated = true;
        state.isLoading = false;
        state.isInitialized = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state) => {
        state.isAuthenticated = true;
        state.isLoading = false;
        state.isInitialized = true;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isAuthenticated = false;
        state.isLoading = false;
        state.isInitialized = true;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
