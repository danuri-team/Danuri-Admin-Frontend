import { PrivateAxios } from "./PrivateAxios";

//내 정보 조회
export const getMyInfo = async () => {
  try {
    const res = await PrivateAxios.get(`/admin/management/me`);
    return { data: res.data, pass: true };
  } catch (error) {
    return { data: error, pass: false };
  }
};

//특정 관리자 정보 조회
export const getAdminInfo = async ({ adminId }: { adminId: string }) => {
  try {
    const res = await PrivateAxios.get(`/admin/management/${adminId}`);
    return { data: res.data, pass: true };
  } catch (error) {
    return { data: error, pass: false };
  }
};

//전체 관리자 정보 조회
export const getAllAdminInfo = async () => {
  try {
    const res = await PrivateAxios.get(`/admin/management`);
    return { data: res.data, pass: true };
  } catch (error) {
    return { data: error, pass: false };
  }
};

//관리자 정보 수정
export const putAdminInfo = async ({
  id,
  email,
  phone,
  role,
}: {
  id: string;
  email: string;
  phone: string;
  role: string;
}) => {
  try {
    const res = await PrivateAxios.put(`/admin/management`, {
      id,
      email,
      phone,
      role,
    });
    return { data: res.data, pass: true };
  } catch (error) {
    return { data: error, pass: false };
  }
};

//관리자 삭제
export const deleteAdmin = async ({ adminId }: { adminId: string }) => {
  try {
    const res = await PrivateAxios.delete(`/admin/management/${adminId}`);
    return { data: res.data, pass: true };
  } catch (error) {
    return { data: error, pass: false };
  }
};
