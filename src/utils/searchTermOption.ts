import { getSearchCompanyItem } from "../api/ItemAPI";
import { getSearchCompanySpace } from "../api/SpaceAPI";
import { postUsageSearch } from "../api/UsageAPI";
import { getSearchCompanyUser } from "../api/UserAPI";
import { isFutureDate } from "./dateFormat";

//물품/공간/유저/이용현황 검색어 찾기
const searchFn = {
  물품: () => getSearchCompanyItem(),
  공간사용: () =>
    postUsageSearch({ startDate: "2025-03-01T00:00:00", endDate: "", spaceId: null, userId: null }),
  공간: () => getSearchCompanySpace(),
  유저: () => getSearchCompanyUser(),
  // 회사: () => 
};

export type SearchLabel = keyof typeof searchFn;

export const getSearchTerm = async (label: SearchLabel, value: string) => {
  const res = await searchFn[label]();
  if (res.pass) {
    const term = res.data
      .map((item: Record<string, string | number>) => ({
        name: label !== "공간사용" ? item.name : item.space_name,
        id: item.id,
        endDate: label !== "공간사용" ? null : item.end_at,
      }))
      .filter(
        (item: { name: string; id: string; endDate: string }) =>
          item.name.includes(value) && (label !== "공간사용" || isFutureDate(item.endDate))
      );

    return term;
  } else {
    console.log("데이터 불러오기 실패");
  }
};

export const selectTermAvailableCount = async (itemId:string) => {
  const res = await getSearchCompanyItem();
  if(res.pass){
    const selectItem = res.data.find((item: Record<string, string|number>) => item.id === itemId)
    if(selectItem && selectItem.available_quantity !== undefined) {
      return Number(selectItem.available_quantity);
    }
    return 0;
  }
  else {
    return 0
  }
}
