import { PublicAxios } from "./PublicAxios";

//관리자 인증 로그인
export const postLogin = async ({ email, password }: { email: string; password: string }) => {
  try {
    //토큰 X
    const res = await PublicAxios.post("/auth/admin/sign-in", {
      email,
      password,
    });
    return { data: res.data, pass: true };
  } catch (error) {
    return { data: error, pass: false };
  }
};

//관리자 인증 회원가입
export const postSignup = async ({
  companyId,
  email,
  phone,
  password,
  rePassword,
}: {
  companyId:string;
  email: string;
  phone:string;
  password: string;
  rePassword: string;
}) => {
  try {
    //토큰 X
    const res = await PublicAxios.post("/auth/admin/sign-up", {
      companyId,
      email,
      phone,
      password,
      rePassword,
    });
    return { data: res.data, pass: true };
  } catch (error) {
    return { data: error, pass: false };
  }
};

//토큰 갱신
export const PostToken = async ({ refreshToken }: { refreshToken: string }) => {
  try {
    //토큰 X
    const res = await PublicAxios.post("/auth/common/refresh", {
      refresh_token: refreshToken,
    });

    return { data: res.data, pass: true };
  } catch (error) {
    return { data: error, pass: false };
  }
};


//비밀번호 변경
export const updateAdminPassword = async ({
  new_password,
  confirm_password
}: {
  new_password:string,
  confirm_password:string
}) => {
try {
  const res = await PublicAxios.put(`/admin/management/password`, {
      new_password,
      confirm_password,
  });
  return { data: res.data, pass: true };
} catch (error) {
  return { data: error, pass: false };
}
};

//비밀번호 변경 인증번호 발송
export const postSendPasswordCode = async ({
  phone
}:{
  phone:string
}) => {
  try {
    const res = await PublicAxios.post(`/auth/admin/find-password`, {
      phone
    })
    return {data:res.data, pass:true}
  } catch (error){
    return {data:error, pass:false}
  }
}

//10분 리셋 토큰 발급
export const postPasswordResetToken = async ({
  phone,
  code
}:{
  phone: string,
  code: string
}) => {
  try{
    const res = await PublicAxios.post(`/auth/admin/reset-token`, {
      phone,
      auth_code:code
    })
    return {data:res.data, pass:true}
  }
  catch(error){
    return {data:error, pass:false}
  }
}