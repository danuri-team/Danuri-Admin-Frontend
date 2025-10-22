import { PrivateAxios } from "../PrivateAxios";

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
      start_at: usageForm.startDate,
      end_at: usageForm.endDate,
    });
    return { data: res.data, pass: true };
  } catch (error) {
    return { data: error, pass: false };
  }
};

//사용 기록 검색
export const postUsageSearch = async (usageForm: UsageSearchType) => {
  try {
    const res = await PrivateAxios.post("/admin/usage/search", {
      user_id: usageForm.userId === "" ? null : usageForm.userId,
      space_id: usageForm.spaceId === "" ? null : usageForm.spaceId,
      start_date: usageForm.startDate,
      end_date: usageForm.endDate,
    });
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
    const res = await PrivateAxios.post(
      "/admin/usage/export",
      {
        start_date: startDate,
        end_date: endDate,
        space_id: spaceId === "" ? null : spaceId,
        user_id: userId === "" ? null : userId,
      },
      {
        responseType: "blob",
      }
    );

    const blob = res.data;

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = decodeURIComponent("export.xlsx");
    link.click();
    window.URL.revokeObjectURL(url);
    return { data: null, pass: true };
  } catch (error) {
    return { data: null, pass: false };
  }
};

//강제 퇴실
export const putForcedToLeave = async ({
  usageId,
  end_at,
}: {
  usageId: string;
  end_at: string;
}) => {
  try {
    const res = await PrivateAxios.put(`/admin/usage/${usageId}`, {
      end_at,
    });
    return { data: res.data, pass: true };
  } catch (error) {
    return { data: error, pass: false };
  }
};
