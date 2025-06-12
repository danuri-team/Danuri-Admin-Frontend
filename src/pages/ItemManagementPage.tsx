import CustomTable from "../components/CustomTable";
import TableButton from "../components/TableButton";
import PagenationButton from "../components/PagenationButton";
import MainHeader from "../components/MainHeader";
import BannerButton from "../components/BannerButton";
import CustomSelect from "../components/CustomSelect";

const tableHeader = [
    {name:'물품', id:'name'},
    {name:'총 수량', id:'total_quantity'}, 
    {name:'이용 가능 개수', id: 'available_quantity'}, 
    {name:'상태', id:'status'}
];

//type = 'select' || 'date'
const filterSelects = [
    {id: 1, type: 'select' , options: ['재고순', '이름순', '이용 가능 여부 순']},
]

const mockData = [
    {process: 'X', item: '충전기', startTime:'2025-12-31 00:00:00', endTime: '2026-01-01 00:00:00', user: '01011112222'},
    {process: 'O', item: '충전기', startTime:'2025-12-31 00:00:00', endTime: '2026-01-01 00:00:00', user: '01011112222'},
    {process: 'X', item: '충전기', startTime:'2025-12-31 00:00:00', endTime: '2026-01-01 00:00:00', user: '01011112222'},
    {process: 'X', item: '충전기', startTime:'2025-12-31 00:00:00', endTime: '2026-01-01 00:00:00', user: '01011112222'},
    {process: 'O', item: '충전기', startTime:'2025-12-31 00:00:00', endTime: '2026-01-01 00:00:00', user: '01011112222'},
]

const ItemManagementPage = () => {
    return(
        <div className="w-screen">
            <MainHeader />
            <BannerButton />
            <div className="flex-1 mr-[50px] ml-[50px] text-nowrap">
                <div className="mr-[20px] ml-[20px] mb-[30px] flex justify-between">
                    <div className="flex items-center">
                        <h1 className="text-xl font-bold">물품 관리</h1>
                        {
                            filterSelects.map((item) => (
                                <CustomSelect key={item.id} options={item.options}/>
                            ))
                        }
                    </div>
                    <div className="flex gap-[10px]">
                        <TableButton value="추가" />
                        <TableButton value="검색" />
                    </div>
                </div>
                
            </div>
        </div>
    )
}

export default ItemManagementPage;