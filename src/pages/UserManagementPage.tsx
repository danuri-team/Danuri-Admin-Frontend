import CustomTable from "../components/CustomTable";
import ExcelButton from "../components/TableButton";
import PagenationButton from "../components/PagenationButton";
import MainHeader from "../components/MainHeader";

const tableHeader = [
    {name:'이름', id:'name'}, 
    {name:'성별', id:'gender'},
    {name:'나이', id:'age'}, 
    {name:'전화번호', id: 'phone'}, 
    {name:'가입일', id:'joinDate'}
];

const mockData = [
    {name: '박종환', gender: '남성', age:'고등학생', phone: '010-0000-0000', joinDate: '2026-01-01 00:00:00'},
    {name: '박종환', gender: '남성', age:'고등학생', phone: '010-0000-0000', joinDate: '2026-01-01 00:00:00'},
    {name: '박종환', gender: '남성', age:'고등학생', phone: '010-0000-0000', joinDate: '2026-01-01 00:00:00'},
    {name: '박종환', gender: '남성', age:'고등학생', phone: '010-0000-0000', joinDate: '2026-01-01 00:00:00'},
    {name: '박종환', gender: '남성', age:'고등학생', phone: '010-0000-0000', joinDate: '2026-01-01 00:00:00'},
]

const UserManagementPage = () => {
    return(
        <div className="flex w-screen">
            <MainHeader />
            <div className="flex-1 m-[40px] mt-[60px] mb-[60px] flex flex-col">
                <div className="mb-[30px] flex items-center justify-between">
                    <h1 className="text-2xl font-bold">사용자 관리</h1>
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

export default UserManagementPage;