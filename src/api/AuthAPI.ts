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
  password,
  rePassword,
}: {
  companyId:string;
  email: string;
  password: string;
  rePassword: string;
}) => {
  try {
    //토큰 X
    const res = await PublicAxios.post("/auth/admin/sign-up", {
      companyId,
      email,
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
