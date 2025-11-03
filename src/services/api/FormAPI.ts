import type { FormItemType } from "@/pages/management/JoinFormPage";
import { PrivateAxios } from "../PrivateAxios";

//가입폼 생성
export const postJoinForm = async (form: FormItemType[]) => {
  try {
    const res = await PrivateAxios.post("/admin/forms", {
      title: "가입폼",
      schema: JSON.stringify(form),
      is_sign_up_form: true,
    });
    return { data: res.data, pass: true };
  } catch (error) {
    return { data: error, pass: false };
  }
};

//가입폼 수정
export const putJoinForm = async ({
  deviceId,
  spaceId,
  isActivate,
}: {
  deviceId: string;
  spaceId: string;
  isActivate: boolean;
}) => {
  try {
    const res = await PrivateAxios.put(`/admin/forms/${deviceId}`, {
      space_id: spaceId,
      is_activate: isActivate,
    });
    return { data: res.data, pass: true };
  } catch (error) {
    return { data: error, pass: false };
  }
};

//가입폼 전체 조회
export const getJoinForm = async () => {
  try {
    const res = await PrivateAxios.get("/admin/forms");
    return { data: res.data, pass: true };
  } catch (error) {
    return { data: error, pass: false };
  }
};
