import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { postLogin, PostToken } from "../../api/AuthAPI";

interface Token {
  token: string;
  expired_at: number;
}

interface AuthResponse {
  access_token: Token;
  refresh_token: Token;
}

interface AuthState {
  access_token: Token | null;
  refresh_token: Token | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  access_token: null,
  refresh_token: null,
  isLoading: false,
  error: null,
};

// 로그인 thunk (email, password -> 토큰 저장)
export const login = createAsyncThunk<
  AuthResponse,
  { email: string; password: string },
  { rejectValue: string }
>("/auth/login", async (payload, { rejectWithValue }) => {
  try {
    const res = await postLogin(payload);
    if (res.pass) {
      const { access_token, refresh_token }: AuthResponse = res.data;
      return { access_token, refresh_token };
    } else return rejectWithValue(res.data as string);
  } catch (error) {
    console.log(error);
    return rejectWithValue("서버오류");
  }
});

//리프레시 토큰으로 토큰 갱신 thunk
export const refreshAccessToken = createAsyncThunk<
  AuthResponse,
  { refreshToken: string },
  { rejectValue: string }
>("auth/refreshToken", async (payload, { rejectWithValue }) => {
  try {
    const res = await PostToken(payload);
    if (res.pass) return res.data as AuthResponse;
    else return rejectWithValue(res.data as string);
  } catch (error) {
    console.log(error);
    return rejectWithValue("서버오류");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    clearToken: (state) => {
      state.access_token = null;
      state.refresh_token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      //로그인
      .addCase(login.pending, (state) => {
        state.access_token = null;
        state.refresh_token = null;
        state.isLoading = true;
        state.error = null;
        console.log("pending");
      })
      .addCase(login.fulfilled, (state, action) => {
        state.access_token = action.payload.access_token;
        state.refresh_token = action.payload.refresh_token;
        state.isLoading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        console.log("error");
      })

      //토큰 갱신
      .addCase(refreshAccessToken.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.access_token = action.payload.access_token;
        state.refresh_token = action.payload.refresh_token;
        state.isLoading = false;
        console.log("토큰 갱신");
      })
      .addCase(refreshAccessToken.rejected, (state, action) => {
        state.access_token = null;
        state.refresh_token = null;
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearToken } = authSlice.actions;

export default authSlice.reducer;
