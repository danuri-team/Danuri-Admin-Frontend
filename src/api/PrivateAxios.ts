import axios from 'axios';
import { store } from '../redux/store';

//토큰 필요 O
export const PrivateAxios = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json'
    }
})

PrivateAxios.interceptors.request.use(
    async (config) => {
        const state = store.getState();
        const accessToken = state.auth.access_token;

        if(accessToken){
            config.headers.Authorization = `Bearer ${accessToken}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error);
    }
)