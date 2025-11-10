import { PublicAxios } from "../PublicAxios";

export const postLogin = async ({ email, password }: { email: string; password: string }) => {
  try {
    const res = await PublicAxios.post("/auth/admin/sign-in", {
      email,
      password,
    });
    return { data: res.data, pass: true };
  } catch (error) {
    return { data: error, pass: false };
  }
};

export const postSignup = async ({
  companyId,
  email,
  phone,
  password,
  rePassword,
}: {
  companyId: string;
  email: string;
  phone: string;
  password: string;
  rePassword: string;
}) => {
  try {
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

export const updateAdminPassword = async ({
  new_password,
  confirm_password,
}: {
  new_password: string;
  confirm_password: string;
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

export const postSendPasswordCode = async ({ phone }: { phone: string }) => {
  try {
    const res = await PublicAxios.post(`/auth/admin/find-password`, {
      phone,
    });
    return { data: res.data, pass: true };
  } catch (error) {
    return { data: error, pass: false };
  }
};

export const postPasswordResetToken = async ({ phone, code }: { phone: string; code: string }) => {
  try {
    const res = await PublicAxios.post(`/auth/admin/reset-token`, {
      phone,
      auth_code: code,
    });
    return { data: res.data, pass: true };
  } catch (error) {
    return { data: error, pass: false };
  }
};
