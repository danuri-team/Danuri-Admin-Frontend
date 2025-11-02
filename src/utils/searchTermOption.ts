import { toast } from "react-toastify";
import { getSearchCompanyItem } from "../api/ItemAPI";
import { getSearchCompanySpace } from "../api/SpaceAPI";
import { postUsageSearch } from "../api/UsageAPI";
import { getSearchCompanyUser } from "../api/UserAPI";
import { isFutureDate } from "./format/dateFormat";

// 검색 결과 타입
export type SearchTerm = {
  name: string;
  id: string;
  endDate: string | null;
};

// 검색 함수 맵
const searchFn = {
  물품: () => getSearchCompanyItem(),
  공간사용: () =>
    postUsageSearch({ startDate: null, endDate: null, spaceId: null, userId: null }),
  공간: () => getSearchCompanySpace(),
  유저: () => getSearchCompanyUser(),
};

export type SearchLabel = keyof typeof searchFn;

// 유저 스키마에서 이름을 안전하게 추출
const extractUserName = (signUpFormSchema: string | number): string => {
  try {
    if (!signUpFormSchema || typeof signUpFormSchema !== "string") {
      return "이름 없음";
    }
    const schema = JSON.parse(signUpFormSchema);
    return schema?.이름 || "이름 없음";
  } catch {
    return "이름 없음";
  }
};

// 검색어 목록 가져오기
export const getSearchTerm = async (
  label: SearchLabel,
  searchValue: string
): Promise<SearchTerm[]> => {
  const res = await searchFn[label]();

  if (!res.pass) {
    toast.error("데이터를 불러오지 못했습니다.");
    return [];
  }

  // 유저 검색
  if (label === "유저") {
    return res.data.user_list
      .map((item: Record<string, string | number>) => ({
        name: extractUserName(item.sign_up_form_schema),
        id: String(item.id),
        endDate: null,
      }))
      .filter((item: SearchTerm) => item.name.includes(searchValue));
  }

  // 공간사용 검색
  if (label === "공간사용") {
    return res.data
      .map((item: Record<string, string | number>) => ({
        name: String(item.space_name || ""),
        id: String(item.id),
        endDate: String(item.end_at || ""),
      }))
      .filter(
        (item: SearchTerm) =>
          item.name.includes(searchValue) && item.endDate && isFutureDate(item.endDate)
      );
  }

  // 물품, 공간 검색
  return res.data
    .map((item: Record<string, string | number>) => ({
      name: String(item.name || ""),
      id: String(item.id),
      endDate: null,
    }))
    .filter((item: SearchTerm) => item.name.includes(searchValue));
};

// 물품의 이용 가능 수량 조회
export const selectTermAvailableCount = async (itemId: string): Promise<number> => {
  const res = await getSearchCompanyItem();

  if (!res.pass) {
    return 0;
  }

  const selectedItem = res.data.find(
    (item: Record<string, string | number>) => String(item.id) === itemId
  );

  if (selectedItem?.available_quantity !== undefined) {
    return Number(selectedItem.available_quantity);
  }

  return 0;
};
