import { PrivateAxios } from "./PrivateAxios"

//사용자 생성
export const postCreateUser = async ({company_id, name, sex, age, phone}:{company_id:string, name:string, sex:string, age: string, phone: string}) => {
    try{
        const res = await PrivateAxios.post('/admin/users', {
            company_id,
            name,
            sex,
            age,
            phone
        });
        return {data: res, pass: true}
    }
    catch(error){
        return {data:error, pass:false}
    }
}

//사용자 수정
export const putUpdateUser = async ({userId, name, email, phone, role}:{userId:string, name:string, email:string, phone:string, role:string}) => {
    try{
        const res = await PrivateAxios.put(`/admin/users/${userId}`,{
            name,
            email,
            phone,
            role
        })
        return {data: res, pass: true}
    }
    catch(error){
        return {data: error, pass: false}
    }
}

//사용자 삭제
export const deleteUser = async ({userId}:{userId:string}) => {
    try {
        const res = await PrivateAxios.delete(`/admin/users/${userId}`);
        return {data:res, pass:true}
    }
    catch(error){
        return {data:error, pass: false}
    }
}

//사용자 조회
export const getSearchUser = async ({userId}:{userId:string}) => {
    try{
        const res = await PrivateAxios.get(`/admin/users/${userId}`);
        return {data:res, pass:true}
    }
    catch(error){
        return {data:error, pass:false}
    }
}

//사내 사용자 조회
export const getSearchCompanyUser = async () => {
    try {
        const res = await PrivateAxios.get('/admin/users');
        return {data:res, pass:true}
    }
    catch(error){
        return {data:error, pass: false}
    }
}