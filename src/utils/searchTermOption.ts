import { toast } from "react-toastify";
import { getSearchCompanyItem } from "@/services/api/ItemAPI";
import { getSearchCompanySpace } from "@/services/api/SpaceAPI";
import { postUsageSearch } from "@/services/api/UsageAPI";
import { getSearchCompanyUser } from "@/services/api/UserAPI";
import { isFutureDate } from "./format/dateFormat";
import { SEARCH_TERMS } from "@/constants/modals";

// 검색 결과 타입
export type SearchTerm = {
  name: string;
  id: string;
  endDate: string | null;
};

// 검색 함수 맵
//물품,공간,유저,이용현황 검색어 찾기
const searchFn: Record<
  (typeof SEARCH_TERMS)[keyof typeof SEARCH_TERMS],
  () => Promise<{
    data: any;
    pass: boolean;
  }>
> = {
  [SEARCH_TERMS.ITEM]: () => getSearchCompanyItem({ page: 0, size: 1000 }),
  [SEARCH_TERMS.USAGE]: () =>
    postUsageSearch({ usageForm: { startDate: null, endDate: null, spaceId: null, userId: null }, page: 0, size: 1000 }),
  [SEARCH_TERMS.SPACE]: () => getSearchCompanySpace({ page: 0, size: 1000 }),
  [SEARCH_TERMS.USER]: () => getSearchCompanyUser({ page: 0, size: 1000 }),
};

export type SearchLabel = (typeof SEARCH_TERMS)[keyof typeof SEARCH_TERMS];

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
  if (label === SEARCH_TERMS.USER) {
    return res.data.user_list
      .map((item: Record<string, string | number>) => ({
        name: extractUserName(item.sign_up_form_schema),
        id: String(item.id),
        endDate: null,
      }))
      .filter((item: SearchTerm) => item.name.includes(searchValue));
  }

  // 공간사용 검색
  if (label === SEARCH_TERMS.USAGE) {
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
  const res = await getSearchCompanyItem({ page: 0, size: 1000 });

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
