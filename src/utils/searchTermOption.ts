import { getSearchCompanyItem } from "../api/ItemAPI"
import { postUsageSearch } from "../api/UsageAPI";

//물품/공간 검색어 찾기
export const getSearchTerm = async (label:string, value:string) => {
    const res = label==='물품' ? await getSearchCompanyItem() : await postUsageSearch({startDate:'2025-03-01T00:00:00', endDate:'', spaceId:null, userId:null});
    if(res.pass){
        const term = res.data.map((item:Record<string, string|number>)=>({
            name: label==='물품' ? item.name : item.space_name,
            id:item.id
        }))
        .filter((item:{name:string, id:string})=> item.name.includes(value));
        
        return term;
    }
    else {
        console.log('데이터 불러오기 실패');
    }
}