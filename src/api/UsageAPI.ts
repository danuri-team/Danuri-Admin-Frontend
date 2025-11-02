import { PrivateAxios } from "./PrivateAxios";
import dayjs from "dayjs";

export type UsageSearchType = {
  startDate: string | null;
  endDate: string | null;
  spaceId: string | null;
  userId: string | null;
};

type ApiResponse<T = unknown> = {
  data: T;
  pass: boolean;
};

// 빈 문자열을 null로 변환하는 헬퍼 함수
const normalizeValue = (value: string | null): string | null => {
  return value === "" ? null : value;
};

// 사용 기록 추가
export const postCreateUsage = async (usageForm: UsageSearchType): Promise<ApiResponse> => {
  try {
    const res = await PrivateAxios.post("/admin/usage", {
      user_id: normalizeValue(usageForm.userId),
      space_id: normalizeValue(usageForm.spaceId),
      start_at: usageForm.startDate,
      end_at: usageForm.endDate,
    });
    return { data: res.data, pass: true };
  } catch (error) {
    return { data: error, pass: false };
  }
};

// 사용 기록 검색
export const postUsageSearch = async (usageForm: UsageSearchType): Promise<ApiResponse> => {
  try {
    const res = await PrivateAxios.post("/admin/usage/search", {
      user_id: normalizeValue(usageForm.userId),
      space_id: normalizeValue(usageForm.spaceId),
      start_date: usageForm.startDate || null,
      end_date: usageForm.endDate || null,
    });
    return { data: res.data, pass: true };
  } catch (error) {
    return { data: error, pass: false };
  }
};

// 사용 기록 상세 조회
export const getUsageDetail = async ({ usageId }: { usageId: string }): Promise<ApiResponse> => {
  try {
    const res = await PrivateAxios.get(`/admin/usage/${usageId}`);
    return { data: res.data, pass: true };
  } catch (error) {
    return { data: error, pass: false };
  }
};

// 사용 기록 엑셀 내보내기
export const postUsageExcel = async ({
  startDate,
  endDate,
  spaceId,
  userId,
}: UsageSearchType): Promise<ApiResponse<null>> => {
  try {
    const res = await PrivateAxios.post(
      "/admin/usage/export",
      {
        start_date: startDate || null,
        end_date: endDate || null,
        space_id: normalizeValue(spaceId),
        user_id: normalizeValue(userId),
      },
      {
        responseType: "blob",
      }
    );

    // 파일 다운로드 처리
    const blob = res.data;
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `이용내역_${dayjs(startDate ?? new Date()).format("YYYY_MM_DD")}.xlsx`;
    link.click();

    // 메모리 정리
    window.URL.revokeObjectURL(url);

    return { data: null, pass: true };
  } catch (error) {
    return { data: null, pass: false };
  }
};

// 강제 퇴실 (종료 시간 업데이트)
export const putForcedToLeave = async ({
  usageId,
  end_at,
}: {
  usageId: string;
  end_at: string;
}): Promise<ApiResponse> => {
  try {
    const res = await PrivateAxios.put(`/admin/usage/${usageId}`, {
      end_at,
    });
    return { data: res.data, pass: true };
  } catch (error) {
    return { data: error, pass: false };
  }
};
