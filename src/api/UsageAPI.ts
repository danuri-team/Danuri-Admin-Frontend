import { PrivateAxios } from "./PrivateAxios";

type UsageSearchType = {
  startDate: string;
  endDate: string;
  spaceId: string | null;
  userId: string | null;
};



//사용 기록 추가
export const postCreateUsage = async (usageForm: UsageSearchType) => {
  try {
    const res = await PrivateAxios.post("/admin/usage", {
      user_id: usageForm.userId,
      space_id: usageForm.spaceId,
      start_date: usageForm.startDate,
      end_date: usageForm.endDate
    });
    console.log(res.data);
    return { data: res.data, pass: true };
  } catch (error) {
    return { data: error, pass: false };
  }
};

//사용 기록 검색
export const postUsageSearch = async (usageForm: UsageSearchType) => {
  console.log('검색 api');
  try {
    const res = await PrivateAxios.post("/admin/usage/search", {
      user_id: usageForm.userId,
      space_id: usageForm.spaceId,
      start_date: usageForm.startDate,
      end_date: usageForm.endDate
    });
    console.log(res.data);
    return { data: res.data, pass: true };
  } catch (error) {
    return { data: error, pass: false };
  }
};

//사용 기록 상세 조회
export const getUsageDetail = async ({ usageId }: { usageId: string }) => {
  try {
    const res = await PrivateAxios.get(`/admin/usage/${usageId}`);
    return { data: res.data, pass: true };
  } catch (error) {
    return { data: error, pass: false };
  }
};

//사용 기록 엑셀 내보내기
export const postUsageExcel = async ({ startDate, endDate, spaceId, userId }: UsageSearchType) => {
  try {
    const res = await PrivateAxios.post("/admin/usage/export", {
      startDate,
      endDate,
      spaceId,
      userId,
    });
    return { data: res.data, pass: true };
  } catch (error) {
    return { data: error, pass: false };
  }
};
