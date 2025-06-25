import CustomTable, { type UsageData } from "../components/CustomTable";
import TableButton from "../components/TableButton";
import MainHeader from "../components/MainHeader";
import BannerButton from "../components/BannerButton";
import CustomSelect from "../components/CustomSelect";
import { useEffect, useReducer, useState } from "react";
import Modal from "../components/Modal";
import type { ModalInputTypesType } from "../components/ModalInput";
import { deleteItem, getSearchCompanyItem, postCreateItem, putUpdateItem } from "../api/ItemAPI";

type filterSelectType = {
  id: keyof SelectState;
  type: "select" | "date";
  options: string[];
};

type SelectState = {
  order: string;
};

type SelectAction =
  | { type: "CHANGE"; payload: { key: string; value: string | Date | null } }
  | { type: "RESET" };

export type modalState = Record<string, Date | string | number | null>;

export type ModalSubmitFn = (form: modalState,) => Promise<{ data: unknown; pass: boolean }>;

const initialSelectForm: SelectState = {
  order: "재고순",
};

const tableHeader = [
  { name: "물품", id: "name" },
  { name: "총 수량", id: "total_quantity" },
  { name: "이용 가능 개수", id: "available_quantity" },
  { name: "상태", id: "status" },
];

//type = 'select' || 'date'
const filterSelects: filterSelectType[] = [
  { id: "order", type: "select", options: ["재고순", "이름순", "이용 가능 여부 순"] },
];

const inputOption: Record<string, { label: string; key: string; type: ModalInputTypesType, initial?: string | number | Date, hide?: boolean }[]> = {
  추가: [
    { label: "물품", key: "name", type: "text" },
    { label: "총 수량", key: "totalQuantity", type: "number" },
    { label: "상태", key: "status", type: "text" },
  ],
  수정: [
    { label: "물품 ID", key: "itemId", type: "text", hide: true },
    { label: "물품", key: "name", type: "text" },
    { label: "총 수량", key: "total_quantity", type: "number" },
    { label: "이용 가능 개수", key: "available_quantity", type: "number" },
    { label: "상태", key: "status", type: "text" },
  ],
};

//모달 Submit 함수
const modalSubmitFn: Record<string, ModalSubmitFn> = {
  추가: (form: modalState) =>
    postCreateItem({
      name: form.name as string,
      totalQuantity: form.totalQuantity as string,
      availableQuantity: '',
      status: form.status as string,
    }),
  수정: (form: modalState) => 
    putUpdateItem({
      itemId: form.itemId as string, 
      name: form.name as string, 
      totalQuantity: form.total_quantity as string,
      availableQuantity: form.available_quantity as string,
      status: form.status as string,
    }),
};

const selectReducer = (state: SelectState, action: SelectAction) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        [action.payload.key]: action.payload.value,
      };
    case "RESET":
      return initialSelectForm;
  }
};

const ItemManagementPage = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalInputs, setModalInputs] = useState<
    { label: string; key: string; type: ModalInputTypesType }[] | null
  >(null);
  const [modalTitle, setModalTitle] = useState<string>("");
  const [tableData, setTableData] = useState<UsageData[] | null>(null);

  const [isDeleteMode, setIsDeleteMode] = useState<boolean>(false);
  const [selectedRowId, setSelectedRowId] = useState<string>('');

  const [selectForm, selectDispatch] = useReducer(selectReducer, initialSelectForm);

  useEffect(() => {
    if (isModalOpen === true) return;
    const getTableData = async () => {
      const res = await getSearchCompanyItem();
      if (res.pass) {
        setTableData(res.data);
      } else {
        console.log("데이터 불러오기 실패");
      }
    };
    getTableData();
  }, [isModalOpen, isDeleteMode]);

  useEffect(()=>{
    if(!tableData)return
    const sortTableData = [...tableData].sort((a,b) => {
      if(selectForm.order==='재고순'){
        return (a.available_quantity as number) - (b.available_quantity as number);
      }
      else if(selectForm.order==='이름순'){
        return (a.name as string).localeCompare(b.name as string);
      }
      else {
        if(a.status==='AVAILABLE'&&b.status!=='AVAILABLE')return -1;
        else if(a.status!=='AVAILABLE'&&b.status==='AVAILABLE')return 1;
        else return 0;
      }
    })
    setTableData(sortTableData)
  },[selectForm])

  const changeSelectedRow = ({id}:{id:string}) => {
    setSelectedRowId(id);
  }

  const onClickTableButton = ({ value }: { value: string }) => {
    if(value==='삭제'){
      onClickDeleteButton();
      return;
    }
    setModalTitle(value);
    if (inputOption[value]) {
      setModalInputs(inputOption[value]);
    }
    setIsModalOpen(true);
  };

  const onClickDeleteButton = async () => {
    if(!isDeleteMode){
      setIsDeleteMode(true);
    }
    else {
      if(!selectedRowId)console.log('선택없음');
      const res = await deleteItem({itemId: selectedRowId});
      if(res.pass){
        setIsDeleteMode(false);
      }
    }
  }

  const onClickTableRow = (row:UsageData) => {
    setModalTitle('수정');
    const addInitialInputs = inputOption['수정'].map((item) => {
      return {
        ...item,
        initial: item.key==='itemId' ? row.id : row[item.key]
      }
    })
    setModalInputs(addInitialInputs);
    setIsModalOpen(true);
  }

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
              <CustomSelect
                key={item.id}
                type={item.type}
                options={item.options}
                value={selectForm[item.id]}
                onChange={(value) =>
                  selectDispatch({
                    type: "CHANGE",
                    payload: { key: item.id, value: value as string | Date | null },
                  })
                }
              />
            ))}
          </div>
          <div className="flex gap-[10px]">
            <TableButton value="추가" onClick={() => onClickTableButton({ value: "추가" })} />
            <TableButton value="삭제" onClick={() => onClickTableButton({ value: "삭제" })} />
          </div>
        </div>
        <CustomTable header={tableHeader} data={tableData} rowUpdate={onClickTableRow} isDeleteMode={isDeleteMode} changeSelectedRow={changeSelectedRow} selectedRowId={selectedRowId}/>
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
