import { PrivateAxios } from "./PrivateAxios";

//가입폼 생성
export const postJoinForm = async ({
  deviceId,
  spaceId
}: {
  deviceId:string,
  spaceId:string
}) => {
  try {
    const res = await PrivateAxios.post("/admin/forms", {
      device_id: deviceId,
      space_id: spaceId,
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
  isActivate
}: {
  deviceId: string;
  spaceId: string;
  isActivate: boolean;
}) => {
  try {
    const res = await PrivateAxios.put(`/admin/forms/${deviceId}`, {
      space_id: spaceId,
      is_activate: isActivate
    });
    return { data: res.data, pass: true };
  } catch (error) {
    return { data: error, pass: false };
  }
};

