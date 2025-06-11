import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface Token {
    token: string,
    expired_at: number
}

interface AuthState {
    access_token: Token | null,
    refresh_token: Token | null
}

const initialState:AuthState = {
    access_token: null,
    refresh_token: null
}

const authSlice = createSlice({
    name: 'auth',
    initialState:initialState, 
    reducers: {
        setToken: (state, action : PayloadAction<{access_token: Token; refresh_token: Token}>) => {
            state.access_token = action.payload.access_token;
            state.refresh_token = action.payload.refresh_token
        },
        clearToken: (state) => {
            state.access_token = null;
            state.refresh_token = null;
        }
    }
})

export const {setToken, clearToken} = authSlice.actions;

export default authSlice.reducer;