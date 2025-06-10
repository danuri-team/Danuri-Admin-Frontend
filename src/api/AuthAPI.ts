import { Server } from "./AxiosInstance"

export const postLogin = async ({email, password}:{email: string, password:string}) => {
    try {
        const res = await Server.post('/auth/admin/sign-in', {
            email,
            password
        });
        return {data: res, pass: true};
    } 
    catch (error){
        return {data:error, pass: false}
    }
}