import { PrivateAxios } from "./PrivateAxios";

//기기 추가
export const postAddDevice = async ({
  deviceName
}: {
  deviceName:string
}) => {
  try {
    const res = await PrivateAxios.post("/admin/devices", {
      name: deviceName,
    });
    return { data: res.data, pass: true };
  } catch (error) {
    return { data: error, pass: false };
  }
};

//기기 수정
export const putUpdateDevice = async ({
  deviceId,
  spaceId,
  isActivate
}: {
  deviceId: string;
  spaceId: string;
  isActivate: boolean;
}) => {
  try {
    const res = await PrivateAxios.put(`/admin/devices/${deviceId}`, {
      space_id: spaceId,
      is_activate: isActivate
    });
    return { data: res.data, pass: true };
  } catch (error) {
    return { data: error, pass: false };
  }
};

//기기 제거
export const deleteDevice = async ({ deviceId }: { deviceId: string }) => {
  try {
    const res = await PrivateAxios.delete(`/admin/devices/${deviceId}`);
    return { data: res.data, pass: true };
  } catch (error) {
    return { data: error, pass: false };
  }
};

//특정 기기 조회
export const getSearchDevice = async ({ deviceId }: { deviceId: string }) => {
  try {
    const res = await PrivateAxios.get(`/admin/devices/${deviceId}`);
    return { data: res.data, pass: true };
  } catch (error) {
    return { data: error, pass: false };
  }
};

//사내 기기 조회
export const getSearchCompanyDevice = async () => {
  try {
    const res = await PrivateAxios.get("/admin/devices");
    return { data: res.data, pass: true };
  } catch (error) {
    return { data: error, pass: false };
  }
};


//기기 로그인 QR 발급
export const getDeviceQR = async ({deviceId}:{deviceId:string}) => {
  try{
    const res = await PrivateAxios.get(`/admin/devices/${deviceId}/sign-in`);
    return {data:res.data, pass:true}
  }
  catch (error){
    return {data:error, pass:false};
  }
}