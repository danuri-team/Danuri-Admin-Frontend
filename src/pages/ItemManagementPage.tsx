import CustomTable, { type UsageData } from "../components/CustomTable";
import TableButton from "../components/TableButton";
import MainHeader from "../components/MainHeader";
import BannerButton from "../components/BannerButton";
import CustomSelect from "../components/CustomSelect";
import { useEffect, useReducer, useState } from "react";
import Modal from "../components/Modal";
import type { ModalInputTypesType } from "../components/ModalInput";
import { getSearchCompanyItem, postCreateItem } from "../api/ItemAPI";

type filterSelectType = {
  id: keyof SelectState;
  type: "select" | "date";
  options: string[];
};

type SelectState = {
  order: string
} 

type SelectAction = 
  | {type:'CHANGE', payload: {key: string, value:string | Date | null}}
  | {type: 'RESET'}
  
export type modalState = Record<string, Date | string | number | null>;

export type ModalSubmitFn = (form: modalState) => Promise<{data: unknown; pass: boolean;}>


const initialSelectForm: SelectState = {
  order: '재고순'
}


const tableHeader = [
  { name: "물품", id: "name" },
  { name: "총 수량", id: "total_quantity" },
  { name: "이용 가능 개수", id: "available_quantity" },
  { name: "상태", id: "status" },
];

//type = 'select' || 'date'
const filterSelects: filterSelectType[] = [
  { id: 'order', type: "select", options: ["재고순", "이름순", "이용 가능 여부 순"] },
];

const inputOption: Record<string, { label: string; key:string, type: ModalInputTypesType }[]> = {
  추가: [
    { label: "물품", key:'name', type: "text" },
    { label: "총 수량",key:'totalQuantity', type: "number" },
    { label: "상태",key:'status', type: "text" },
  ],
};

const modalSubmitFn: Record<string, ModalSubmitFn> = {
  추가: (form:modalState) => postCreateItem({name: form.name as string ,totalQuantity: form.totalQuantity as string, status: form.status as string})
}

const selectReducer = (state:SelectState, action:SelectAction) => {
  switch(action.type){
    case 'CHANGE':
      return {
        ...state,
        [action.payload.key]:[action.payload.value]
      }
    case 'RESET':
      return initialSelectForm;
  }
}

const ItemManagementPage = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalInputs, setModalInputs] = useState<
    { label: string; key:string, type: ModalInputTypesType }[] | null
  >(null);
  const [modalTitle, setModalTitle] = useState<string>("");
  const [tableData, setTableData] = useState<UsageData[]|null>(null);

  const [selectForm, selectDispatch] = useReducer(selectReducer, initialSelectForm);

  useEffect(()=>{
    const getTableData = async () => {
      const res = await getSearchCompanyItem();
      if(res.pass){
        setTableData(res.data)
      }
      else {
        console.log('데이터 불러오기 실패')
      }
    }

    getTableData();

  },[tableData])

  const onClickTableButton = ({ value }: { value: string }) => {
    setIsModalOpen(true);
    setModalTitle(value);
    if (inputOption[value]) {
      setModalInputs(inputOption[value]);
    }
  };

  const onCloseModal = () => {
    setIsModalOpen(false);
    setModalTitle("");
    setModalInputs(null);
  };

  return (
    <div className="w-full">
      <MainHeader />
      <BannerButton />
      <div className="flex-1 mr-[50px] ml-[50px] text-nowrap">
        <div className="mr-[20px] ml-[20px] mb-[30px] flex justify-between">
          <div className="flex items-center">
            <h1 className="text-xl font-bold">물품 관리</h1>
            {filterSelects.map((item) => (
              <CustomSelect key={item.id} type={item.type} options={item.options} value={selectForm[item.id]} onChange={(value)=>selectDispatch({type:'CHANGE', payload: {key:item.id, value: value as string | Date | null}})}/>
            ))}
          </div>
          <div className="flex gap-[10px]">
            <TableButton value="추가" onClick={() => onClickTableButton({ value: "추가" })} />
            <TableButton value="검색" onClick={() => onClickTableButton({ value: "검색" })} />
          </div>
        </div>
        <CustomTable header={tableHeader} data={tableData} />
      </div>
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          title={modalTitle}
          inputs={modalInputs}
          onClose={onCloseModal}
          onSubmit={modalSubmitFn[modalTitle]}
        />
      )}
    </div>
  );
};

export default ItemManagementPage;
