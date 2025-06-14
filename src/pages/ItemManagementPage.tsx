import CustomTable from "../components/CustomTable";
import TableButton from "../components/TableButton";
import MainHeader from "../components/MainHeader";
import BannerButton from "../components/BannerButton";
import CustomSelect from "../components/CustomSelect";
import { useState } from "react";
import Modal from "../components/Modal";

type filterSelectType = {
    id: number, 
    type: 'select' | 'date', 
    options: string[]
}

const tableHeader = [
    {name:'물품', id:'name'},
    {name:'총 수량', id:'total_quantity'}, 
    {name:'이용 가능 개수', id: 'available_quantity'}, 
    {name:'상태', id:'status'}
];

//type = 'select' || 'date'
const filterSelects:filterSelectType[] = [
    {id: 1, type: 'select' , options: ['재고순', '이름순', '이용 가능 여부 순']},
]

const mockData = [
    {
        "id": "bd04022d-56ab-4483-9a1b-552dd9373d6a",
        "company_id": "7419d2c7-8bee-48c5-8a73-d8861e40582c",
        "company_name": "페더",
        "name": "마이크",
        "total_quantity": 1,
        "available_quantity": 0,
        "status": "NOT_AVAILABLE"
    },
    {
        "id": "f4fb919b-3733-4591-8742-6606e5c0879a",
        "company_id": "7419d2c7-8bee-48c5-8a73-d8861e40582c",
        "company_name": "페더",
        "name": "충전기",
        "total_quantity": 10,
        "available_quantity": 9,
        "status": "AVAILABLE"
    },
    {
        "id": "bd04022d-56ab-4483-9a1b-552dd9373d6a",
        "company_id": "7419d2c7-8bee-48c5-8a73-d8861e40582c",
        "company_name": "페더",
        "name": "마이크",
        "total_quantity": 1,
        "available_quantity": 0,
        "status": "NOT_AVAILABLE"
    },
    {
        "id": "bd04022d-56ab-4483-9a1b-552dd9373d6a",
        "company_id": "7419d2c7-8bee-48c5-8a73-d8861e40582c",
        "company_name": "페더",
        "name": "마이크",
        "total_quantity": 1,
        "available_quantity": 0,
        "status": "NOT_AVAILABLE"
    },
    {
        "id": "bd04022d-56ab-4483-9a1b-552dd9373d6a",
        "company_id": "7419d2c7-8bee-48c5-8a73-d8861e40582c",
        "company_name": "페더",
        "name": "마이크",
        "total_quantity": 1,
        "available_quantity": 0,
        "status": "NOT_AVAILABLE"
    },
    {
        "id": "bd04022d-56ab-4483-9a1b-552dd9373d6a",
        "company_id": "7419d2c7-8bee-48c5-8a73-d8861e40582c",
        "company_name": "페더",
        "name": "마이크",
        "total_quantity": 1,
        "available_quantity": 0,
        "status": "NOT_AVAILABLE"
    },
    {
        "id": "bd04022d-56ab-4483-9a1b-552dd9373d6a",
        "company_id": "7419d2c7-8bee-48c5-8a73-d8861e40582c",
        "company_name": "페더",
        "name": "마이크",
        "total_quantity": 1,
        "available_quantity": 0,
        "status": "NOT_AVAILABLE"
    },
    {
        "id": "bd04022d-56ab-4483-9a1b-552dd9373d6a",
        "company_id": "7419d2c7-8bee-48c5-8a73-d8861e40582c",
        "company_name": "페더",
        "name": "마이크",
        "total_quantity": 1,
        "available_quantity": 0,
        "status": "NOT_AVAILABLE"
    },
    {
        "id": "bd04022d-56ab-4483-9a1b-552dd9373d6a",
        "company_id": "7419d2c7-8bee-48c5-8a73-d8861e40582c",
        "company_name": "페더",
        "name": "마이크",
        "total_quantity": 1,
        "available_quantity": 0,
        "status": "NOT_AVAILABLE"
    },
    {
        "id": "bd04022d-56ab-4483-9a1b-552dd9373d6a",
        "company_id": "7419d2c7-8bee-48c5-8a73-d8861e40582c",
        "company_name": "페더",
        "name": "마이크",
        "total_quantity": 1,
        "available_quantity": 0,
        "status": "NOT_AVAILABLE"
    },
    {
        "id": "bd04022d-56ab-4483-9a1b-552dd9373d6a",
        "company_id": "7419d2c7-8bee-48c5-8a73-d8861e40582c",
        "company_name": "페더",
        "name": "마이크",
        "total_quantity": 1,
        "available_quantity": 0,
        "status": "NOT_AVAILABLE"
    },
];

const modalInputs = {
    '추가': [{label: '물품', type: 'input'},{label: '총 수량', type: 'input'}],
}



const ItemManagementPage = () => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [modalInputs, setModalInputs]


    const onClickTableButton = () => {

    }

    return(
        <div className="w-full">
            <MainHeader />
            <BannerButton />
            <div className="flex-1 mr-[50px] ml-[50px] text-nowrap">
                <div className="mr-[20px] ml-[20px] mb-[30px] flex justify-between">
                    <div className="flex items-center">
                        <h1 className="text-xl font-bold">물품 관리</h1>
                        {
                            filterSelects.map((item) => (
                                <CustomSelect key={item.id} type={item.type} options={item.options}/>
                            ))
                        }
                    </div>
                    <div className="flex gap-[10px]">
                        <TableButton value="추가" onClick={onClickTableButton} />
                        <TableButton value="검색" onClick={onClickTableButton} />
                    </div>
                </div>
                <CustomTable header={tableHeader} data={mockData}/>
            </div>
            {
                isModalOpen && (
                    <Modal isOpen={isModalOpen} title={} />
                )
            }
        </div>
    )
}

export default ItemManagementPage;