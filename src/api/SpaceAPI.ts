import { PrivateAxios } from "./PrivateAxios";

//공간 생성
export const postCreateSpace = async ({
  name,
  startTime,
  endTime,
}: {
  name: string;
  startTime: string;
  endTime: string;
}) => {
  console.log(startTime, endTime);
  try {
    const res = await PrivateAxios.post("/admin/spaces", {
      name,
      start_at: startTime,
      end_at: endTime,
    });
    return { data: res, pass: true };
  } catch (error) {
    return { data: error, pass: false };
  }
};

//공간 수정
export const putUpdateSpace = async ({
  spaceId,
  name,
  startTime,
  endTime,
}: {
  spaceId: string;
  name: string;
  startTime: string;
  endTime: string;
}) => {
  console.log(startTime, endTime)
  try {
    const res = await PrivateAxios.put(`/admin/spaces/${spaceId}`, {
      name,
      start_at: startTime,
      end_at: endTime,
    });
    return { data: res.data, pass: true };
  } catch (error) {
    return { data: error, pass: false };
  }
};

//공간 삭제
export const deleteSpace = async ({ spaceId }: { spaceId: string }) => {
  try {
    const res = await PrivateAxios.delete(`/admin/spaces/${spaceId}`);
    return { data: res.data, pass: true };
  } catch (error) {
    return { data: error, pass: false };
  }
};

//공간 조회
export const getSearchSpace = async ({ spaceId }: { spaceId: string }) => {
  try {
    const res = await PrivateAxios.get(`/admin/spaces/${spaceId}`);
    return { data: res.data, pass: true };
  } catch (error) {
    return { data: error, pass: false };
  }
};

//사내 공간 조회
export const getSearchCompanySpace = async () => {
  try {
    const res = await PrivateAxios.get("/admin/spaces");
    return { data: res.data, pass: true };
  } catch (error) {
    return { data: error, pass: false };
  }
};
