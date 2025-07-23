import { useState, useReducer, useMemo } from "react";
import { deleteItem } from "../api/ItemAPI";
import BannerButton from "../components/BannerButton";
import CustomTable, { type UsageData } from "../components/CustomTable";
import MainHeader from "../components/MainHeader";
import TableButton from "../components/TableButton";
import Modal from "../components/modal/Modal";
import type { ModalInputTypesType } from "../components/modal/ModalInput";

export type modalState = Record<string, Date | string | number | null>;

export type ModalSubmitFn = (form: modalState) => Promise<{ data: unknown; pass: boolean }>;

const tableHeader = [
  { name: "ID", id: "id" },
  { name: "추가일", id: "add_date" },
];

const inputOption: Record<string, { name: string; key: string; type: ModalInputTypesType, initial?: string | number | Date, hide?: boolean }[]> = {
  추가: [
    { name: "ID", key: "id", type: 'text' },
    { name: "추가일", key: "add_date", type:'date' },
  ],
  수정: [
    { name: "ID", key: "id" , type:'text', hide: true},
    { name: "추가일", key: "add_date", type:'date' },
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

const MachineManagementPage = () => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalInputs, setModalInputs] = useState<
    { label: string; key: string; type: ModalInputTypesType }[] | null
  >(null);
  const [modalTitle, setModalTitle] = useState<string>("");
  const [tableData, setTableData] = useState<UsageData[] | null>(null);

  const [isDeleteMode, setIsDeleteMode] = useState<boolean>(false);
  const [selectedRowId, setSelectedRowId] = useState<string>('');

  const [selectForm, selectDispatch] = useReducer(selectReducer, initialSelectForm);

  const sortTableData = useMemo(()=>{
    if(!tableData)return null
    return [...tableData].sort((a,b) => {
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
  })},[tableData, selectForm.order])

//   useEffect(() => {
//     if (isModalOpen === true) return;
//     const getTableData = async () => {
//       const res = await ();
//       if (res.pass) {
//         setTableData(res.data);
//       } else {
//         console.log("데이터 불러오기 실패");
//       }
//     };
//     getTableData();
//   }, [isModalOpen, isDeleteMode]);

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
    return(
        <div className="w-full">
        <MainHeader />
        <BannerButton />
        <div className="flex-1 mr-[50px] ml-[50px] text-nowrap">
            <div className="mr-[20px] ml-[20px] mb-[30px] flex justify-between">
            <div className="flex items-center">
                <h1 className="text-xl font-bold">기기 관리</h1>
            </div>
            <div className="flex gap-[10px]">
                <TableButton value="추가" onClick={() => onClickTableButton({ value: "추가" })} />
                <TableButton value="삭제" onClick={() => onClickTableButton({ value: "삭제" })} isDeleteMode={isDeleteMode} />
            </div>
            </div>
            <CustomTable header={tableHeader} data={sortTableData} rowUpdate={onClickTableRow} isDeleteMode={isDeleteMode} changeSelectedRow={changeSelectedRow} selectedRowId={selectedRowId}/>
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
    )
}

export default MachineManagementPage;