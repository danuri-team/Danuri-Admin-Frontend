import { PublicAxios } from "./PublicAxios"

//관리자 인증 로그인
export const postLogin = async ({email, password}:{email: string, password:string}) => {
    try {
        //토큰 X
        const res = await PublicAxios.post('/auth/admin/sign-in', {
            email,
            password
        });
        return {data: res, pass: true};
    } 
    catch (error){
        return {data:error, pass: false}
    }
}

//관리자 인증 회원가입
export const postSignup = async ({company_id, email, password, phone}: {company_id:string, email:string, password:string, phone:string}) => {
    try {
        //토큰 X
        const res = await PublicAxios.post('/auth/admin/sign-up', {
            company_id,
            email,
            password,
            phone
        });
        return {data: res, pass: true}
    }
    catch (error) {
        return {data: error, pass: false}
    }
}

//토큰 갱신
export const PostToken = async ({refreshToken}:{refreshToken:string}) => {
    try{
        //토큰 X
        const res = await PublicAxios.post('/auth/admin/refresh', {
            refresh_token:refreshToken
        });

        return {data: res, pass: true}
    }
    catch (error) {
        return {data: error, pass: false}
    }
}