type UsageSearchType = {
    startDate:string, 
    endDate:string, 
    spaceId: string | null, 
    userId: string | null
}

export const postUsageSearch = async ({startDate, endDate, spaceId, userId}: UsageSearchType) => {
    
}