import { PrivateAxios } from "./PrivateAxios"

type UsageSearchType = {
    startDate:string, 
    endDate:string, 
    spaceId: string | null, 
    userId: string | null
}

//사용 기록 검색
export const postUsageSearch = async ({startDate, endDate, spaceId, userId}: UsageSearchType) => {
    try{
        const res = await PrivateAxios.post('/admin/usage/search', {
            startDate,
            endDate,
            spaceId,
            userId
        });
        return {data: res, pass: true}
    }
    catch(error){
        return {data: error, pass: false}
    }
}

//사용 기록 상세 조회
export const getUsageDetail = async ({usageId}:{usageId:string}) => {
    try{
        const res = await PrivateAxios.get(`/admin/usage/${usageId}`);
        return {data: res, pass: true};
    }
    catch(error){
        return {data: error, pass: false}
    }
}

//사용 기록 엑셀 내보내기
export const postUsageExcel = async ({startDate, endDate, spaceId, userId}:UsageSearchType) => {
    try{
        const res = await PrivateAxios.post('/admin/usage/export', {
            startDate,
            endDate,
            spaceId,
            userId
        });
        return {data:res, pass: true}
    }
    catch(error){
        return {data: error, pass: false};
    }
}
