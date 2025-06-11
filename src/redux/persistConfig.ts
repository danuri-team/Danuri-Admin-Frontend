import { persistReducer } from 'redux-persist'
import authReducer from './reducers/authSlice'
import sessionStorage from 'redux-persist/lib/storage/session';

const authPersistConfig = {
    key: 'auth',
    storage: sessionStorage
}

export const authPersistReducer = persistReducer(authPersistConfig, authReducer);