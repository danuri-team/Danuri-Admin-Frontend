import CustomTable from "../components/CustomTable";
import MainHeader from "../components/MainHeader";
import BannerButton from "../components/BannerButton";
import CustomSelect from "../components/CustomSelect";
import TableButton from "../components/TableButton";

const tableHeader = [
    {name:'공간', id:'space_name'},
    {name:'시작시간', id:'start_at'}, 
    {name:'종료시간', id: 'end_at'}, 
    {name:'유저', id:'user_name'},
    {name:'상태', id:'status'},
];

//type = 'select' || 'date'
const filterSelects = [
    {id: 1, type: 'select' , options: ['재고순', '이름순', '이용 가능 여부 순']},
    {id: 2, type: 'date' , options: ['이용일']},
    {id: 3, type: 'select' , options: ['나이대']},
    {id: 4, type: 'select' , options: ['성별', '남', '여']},
]

const mockData = [
    {
        "id": "0dc0b18e-2d5c-40d0-ad5c-fd722e72f864",
        "user_id": "8e6ab479-cd0b-41fc-9e80-ace482b96751",
        "user_name": "w",
        "user_phone": "010-1234-5678",
        "space_id": "0e97af91-77ca-44a2-98c9-66a47ecf000a",
        "space_name": "0e97af91-77ca-44a2-98c9-66a47ecf000a",
        "company_id": "7419d2c7-8bee-48c5-8a73-d8861e40582c",
        "company_name": "페더",
        "start_at": "2025-06-07T15:14:23",
        "end_at": "2025-06-07T16:58:52",
        "rental_count": 0
    },
    {
        "id": "4e73dabc-80fa-459e-82e4-b713e97b3afc",
        "user_id": "8e6ab479-cd0b-41fc-9e80-ace482b96751",
        "user_name": "w",
        "user_phone": "010-1234-5678",
        "space_id": "0e97af91-77ca-44a2-98c9-66a47ecf000a",
        "space_name": "0e97af91-77ca-44a2-98c9-66a47ecf000a",
        "company_id": "7419d2c7-8bee-48c5-8a73-d8861e40582c",
        "company_name": "페더",
        "start_at": "2025-06-07T15:13:59",
        "end_at": "2025-06-07T15:10:59",
        "rental_count": 0
    },
    {
        "id": "72afb510-c42c-435d-878b-f45df645792f",
        "user_id": "8e6ab479-cd0b-41fc-9e80-ace482b96751",
        "user_name": "w",
        "user_phone": "010-1234-5678",
        "space_id": "0e97af91-77ca-44a2-98c9-66a47ecf000a",
        "space_name": "0e97af91-77ca-44a2-98c9-66a47ecf000a",
        "company_id": "7419d2c7-8bee-48c5-8a73-d8861e40582c",
        "company_name": "페더",
        "start_at": "2025-06-09T19:49:33",
        "end_at": "2025-06-09T20:19:33",
        "rental_count": 0
    },
    {
        "id": "820c1e07-cb51-4b98-a477-e5569267a2f4",
        "user_id": "8e6ab479-cd0b-41fc-9e80-ace482b96751",
        "user_name": "w",
        "user_phone": "010-1234-5678",
        "space_id": "0e97af91-77ca-44a2-98c9-66a47ecf000a",
        "space_name": "0e97af91-77ca-44a2-98c9-66a47ecf000a",
        "company_id": "7419d2c7-8bee-48c5-8a73-d8861e40582c",
        "company_name": "페더",
        "start_at": "2025-05-19T21:08:42",
        "end_at": "2025-06-07T15:02:25",
        "rental_count": 1
    },
    {
        "id": "89b274c7-a3bc-4a14-a05c-a7abe3788e6d",
        "user_id": "8e6ab479-cd0b-41fc-9e80-ace482b96751",
        "user_name": "w",
        "user_phone": "010-1234-5678",
        "space_id": "0e97af91-77ca-44a2-98c9-66a47ecf000a",
        "space_name": "0e97af91-77ca-44a2-98c9-66a47ecf000a",
        "company_id": "7419d2c7-8bee-48c5-8a73-d8861e40582c",
        "company_name": "페더",
        "start_at": "2025-06-07T15:15:45",
        "end_at": "2025-06-07T15:20:44",
        "rental_count": 2
    },
    {
        "id": "925a28c5-f856-43bf-b8ff-9067a2417c56",
        "user_id": "8e6ab479-cd0b-41fc-9e80-ace482b96751",
        "user_name": "w",
        "user_phone": "010-1234-5678",
        "space_id": "0e97af91-77ca-44a2-98c9-66a47ecf000a",
        "space_name": "0e97af91-77ca-44a2-98c9-66a47ecf000a",
        "company_id": "7419d2c7-8bee-48c5-8a73-d8861e40582c",
        "company_name": "페더",
        "start_at": "2025-06-10T21:17:23",
        "end_at": "2025-06-10T21:47:23",
        "rental_count": 0
    },
    {
        "id": "bca0ea1d-47b7-4615-ad36-c9d8404c2516",
        "user_id": "8e6ab479-cd0b-41fc-9e80-ace482b96751",
        "user_name": "w",
        "user_phone": "010-1234-5678",
        "space_id": "0e97af91-77ca-44a2-98c9-66a47ecf000a",
        "space_name": "0e97af91-77ca-44a2-98c9-66a47ecf000a",
        "company_id": "7419d2c7-8bee-48c5-8a73-d8861e40582c",
        "company_name": "페더",
        "start_at": "2025-06-07T16:57:10",
        "end_at": "2025-06-07T16:58:57",
        "rental_count": 0
    },
    {
        "id": "c36da568-d385-413d-adf8-f90915ed6142",
        "user_id": "618b697f-061b-4876-b9af-4fb69664cd4c",
        "user_name": "박종환리얼",
        "user_phone": "010-4017-2010",
        "space_id": "0e97af91-77ca-44a2-98c9-66a47ecf000a",
        "space_name": "0e97af91-77ca-44a2-98c9-66a47ecf000a",
        "company_id": "7419d2c7-8bee-48c5-8a73-d8861e40582c",
        "company_name": "페더",
        "start_at": "2025-06-12T15:04:36",
        "end_at": "2025-06-12T15:07:30",
        "rental_count": 0
    },
    {
        "id": "e979ff23-c4a1-4fd6-ae42-4a015f7f920f",
        "user_id": "8e6ab479-cd0b-41fc-9e80-ace482b96751",
        "user_name": "w",
        "user_phone": "010-1234-5678",
        "space_id": "0e97af91-77ca-44a2-98c9-66a47ecf000a",
        "space_name": "0e97af91-77ca-44a2-98c9-66a47ecf000a",
        "company_id": "7419d2c7-8bee-48c5-8a73-d8861e40582c",
        "company_name": "페더",
        "start_at": "2025-06-07T15:03:20",
        "end_at": "2025-06-07T15:10:20",
        "rental_count": 0
    }
];

const UsagePage = () => {
    return(
        <div className="w-full">
            <MainHeader />
            <BannerButton />
            <div className="flex-1 mr-[50px] ml-[50px] text-nowrap">
                <div className="mr-[20px] ml-[20px] mb-[30px] flex justify-between">
                    <div className="flex items-center">
                        <h1 className="text-xl font-bold">이용 현황</h1>
                        {
                            filterSelects.map((item) => (
                                <CustomSelect key={item.id} options={item.options}/>
                            ))
                        }
                    </div>
                    <div className="flex gap-[10px]">
                        <TableButton value="다운로드" />
                        <TableButton value="대여관리" />
                        <TableButton value="추가" />
                    </div>
                </div>
                <CustomTable header={tableHeader} data={mockData}/>
            </div>
        </div>
    )
}

export default UsagePage;