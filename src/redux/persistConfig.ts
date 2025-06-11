import { persistReducer } from 'redux-persist'
import authReducer from './reducers/authSlice'

const authPersistConfig = {
    key: 'auth',
    storage: sessionStorage
}

export const authPersistReducer = persistReducer(authPersistConfig, authReducer);