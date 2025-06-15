import CustomTable from "../components/CustomTable";
import MainHeader from "../components/MainHeader";
import CustomSelect from "../components/CustomSelect";
import BannerButton from "../components/BannerButton";
import TableButton from "../components/TableButton";
import type { ModalInputTypesType } from "../components/ModalInput";
import { useState } from "react";
import Modal from "../components/Modal";

type filterSelectType = {
    id: number, 
    type: 'select' | 'date', 
    options: string[]
}

const tableHeader = [
    {name:'이름', id:'name'}, 
    {name:'전화번호', id: 'phone'}, 
    {name:'성별', id:'sex'},
    {name:'나이', id:'age'}, 
    {name:'가입일', id:'created_at'}
];

//type = 'select' || 'date'
const filterSelects:filterSelectType[] = [
    {id: 1, type: 'date' , options: ['가입일']},
    {id: 2, type: 'select' , options: ['나이대']},
    {id: 3, type: 'select' , options: ['성별', '남', '여']},
]

const mockData = [
    {
        "id": "07ebd352-9ae9-44b1-8b1f-7faf6ddf4a28",
        "company_id": "7419d2c7-8bee-48c5-8a73-d8861e40582c",
        "company_name": "페더",
        "name": "수정",
        "sex": "FEMALE",
        "age": "MIDDLE",
        "phone": "010-1234-1234",
        "created_at": "2025-06-11T18:19:33",
        "updated_at": "2025-06-12T11:51:07",
        "usage_count": 0
    },
    {
        "id": "1e249904-7ed2-431e-982b-41621f719eb7",
        "company_id": "7419d2c7-8bee-48c5-8a73-d8861e40582c",
        "company_name": "페더",
        "name": "사용자 이름",
        "sex": "MALE",
        "age": "MIDDLE",
        "phone": "010-1234-5222",
        "created_at": "2025-06-10T16:47:48",
        "updated_at": "2025-06-10T16:47:48",
        "usage_count": 0
    },
    {
        "id": "618b697f-061b-4876-b9af-4fb69664cd4c",
        "company_id": "7419d2c7-8bee-48c5-8a73-d8861e40582c",
        "company_name": "페더",
        "name": "박종환리얼",
        "sex": "MALE",
        "age": "HIGH",
        "phone": "010-4017-2010",
        "created_at": "2025-06-12T13:39:13",
        "updated_at": "2025-06-12T13:39:13",
        "usage_count": 1
    },
    {
        "id": "8e6ab479-cd0b-41fc-9e80-ace482b96751",
        "company_id": "7419d2c7-8bee-48c5-8a73-d8861e40582c",
        "company_name": "페더",
        "name": "w",
        "sex": "MALE",
        "age": "MIDDLE",
        "phone": "010-1234-5678",
        "created_at": "2025-05-19T21:06:20",
        "updated_at": "2025-05-19T21:06:19",
        "usage_count": 8
    },
    {
        "id": "fda22c19-06f5-49fc-9219-89343a5afff9",
        "company_id": "7419d2c7-8bee-48c5-8a73-d8861e40582c",
        "company_name": "페더",
        "name": "이지혁리얼",
        "sex": "MALE",
        "age": "HIGH",
        "phone": "010-4952-8487",
        "created_at": "2025-06-10T11:47:51",
        "updated_at": "2025-06-10T11:47:51",
        "usage_count": 0
    }
]

const inputOption: Record<string, {label:string, type: ModalInputTypesType}[]> = {
    '추가': [{label: '이름', type: 'text'},{label: '전화번호', type: 'text'},{label: '성별', type: 'text'},{label: '나이', type: 'text'}],
}

const UserManagementPage = () => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [modalInputs, setModalInputs] = useState<{label:string, type: ModalInputTypesType}[] | null>(null)
    const [modalTitle, setModalTitle] = useState<string>('');


    const onClickTableButton = ({value}:{value:string}) => {
        setIsModalOpen(true);
        setModalTitle(value);
        if(inputOption[value]){
            setModalInputs(inputOption[value]);
        }
    }

    const onCloseModal = () => {
        setIsModalOpen(false);
        setModalTitle('');
        setModalInputs(null);
    }

    return(
        <div className="w-full">
            <MainHeader />
            <BannerButton />
            <div className="flex-1 mr-[50px] ml-[50px] text-nowrap">
                <div className="mr-[20px] ml-[20px] mb-[30px] flex justify-between">
                    <div className="flex items-center">
                        <h1 className="text-xl font-bold">사용자 관리</h1>
                        {
                            filterSelects.map((item) => (
                                <CustomSelect type={item.type} key={item.id} options={item.options}/>
                            ))
                        }
                    </div>
                    <div className="flex gap-[10px]">
                        <TableButton value="다운로드" />
                        <TableButton value="추가" onClick={()=>onClickTableButton({value: '추가'})} />
                        <TableButton value="검색" />
                        <TableButton value="삭제" />
                    </div>
                </div>
                <CustomTable header={tableHeader} data={mockData}/>
            </div>
            {
                isModalOpen && (
                    <Modal isOpen={isModalOpen} title={modalTitle} inputs={modalInputs} onClose={onCloseModal} />
                )
            }
        </div>
    )
}

export default UserManagementPage;