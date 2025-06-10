import CustomTable from "../components/CustomTable";
import ExcelButton from "../components/ExcelButton";
import PagenationButton from "../components/PagenationButton";
import SideNav from "../components/SideNav";

const tableHeader = ['공간', '시작시간', '종료시간', '유저'];

const mockData = [
    {place: '노래방', startTime:'2025-12-31 00:00:00', endTime: '2026-01-01 00:00:00', user: '01011112222'},
    {place: '노래방', startTime:'2025-12-31 00:00:00', endTime: '2026-01-01 00:00:00', user: '01011112222'},
    {place: '노래방', startTime:'2025-12-31 00:00:00', endTime: '2026-01-01 00:00:00', user: '01011112222'},
    {place: '노래방', startTime:'2025-12-31 00:00:00', endTime: '2026-01-01 00:00:00', user: '01011112222'},
    {place: '노래방', startTime:'2025-12-31 00:00:00', endTime: '2026-01-01 00:00:00', user: '01011112222'},
]

const UsagePage = () => {
    return(
        <div className="flex w-screen">
            <SideNav />
            <div className="flex-1 m-[40px] mt-[60px] mb-[60px] flex flex-col">
                <div className="mb-[30px] flex items-center justify-between">
                    <h1 className="text-2xl font-bold">이용 현황</h1>
                    <ExcelButton />
                </div>
                <CustomTable header={tableHeader} data={mockData} />
                <div className="mt-auto self-end">
                    <PagenationButton />    
                </div>
            </div>
        </div>
    )
}

export default UsagePage;