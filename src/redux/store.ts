import { configureStore } from "@reduxjs/toolkit";
import { persistStore } from "redux-persist";
import { authPersistReducer } from "./persistConfig";

export const store = configureStore({
    reducer: {
        auth: authPersistReducer
    }
})

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>

