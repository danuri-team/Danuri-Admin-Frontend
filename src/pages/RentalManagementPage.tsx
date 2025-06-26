import { useEffect, useReducer, useState } from "react";
import BannerButton from "../components/BannerButton";
import CustomSelect from "../components/CustomSelect";
import CustomTable, { type UsageData } from "../components/CustomTable";
import MainHeader from "../components/MainHeader";
import Modal from "../components/Modal";
import type { ModalInputTypesType } from "../components/ModalInput";
import TableButton from "../components/TableButton";
import { getSearchCompanyRental, postCreateRental, putUpdateRental } from "../api/RentalAPI";
import type { ModalSubmitFn, modalState } from "./ItemManagementPage";

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

const initialSelectForm: SelectState = {
  order: "처리 여부",
};

const tableHeader = [
  { name: "물품", id: "item_name" },
  { name: "유저", id: "user_name" },
  { name: "사용 ID", id: "user_id" },
  { name: "대여 개수", id: "quantity" },
  { name: "반납 개수", id: "returned_quantity" },
  { name: "상태 ", id: "status" },
];

//type = 'select' || 'date'
const filterSelects: filterSelectType[] = [
  { id: "order", type: "select", options: ["처리 여부", "미확인", '반납됨', '이용중'] },
];

const inputOption: Record<string, { label: string; key: string; type: ModalInputTypesType, initial?: string | number | Date, hide?: boolean }[]> = {
  추가: [
    { label: "물품", key: "itemId", type: "search" },
    { label: "공간사용", key: "usageId", type: "search" },
    { label: "대여 개수", key: "quantity", type: "number" },
  ],
  수정: [
    { label: "대여 ID", key: "rentalId", type: "text", hide: true},
    { label: "대여 개수", key: "quantity", type: "number" },
    { label: "반납 개수", key: "returned_quantity", type: "number" },
    { label: "상태", key: "status", type: "option" },
  ],
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

const modalSubmitFn: Record<string, ModalSubmitFn> = {
  추가: (form: modalState) =>
    postCreateRental({
      itemId: form.itemId as string,
      quantity: form.quantity as number,
      usageId: form.usageId as string,
    }),
  수정: (form: modalState) =>
    putUpdateRental({
      rentalId: form.rental_id as string,
      quantity: form.quantity as number,
      returnedQuantity: form.returned_quantity as number,
      status: form.status as string,
    }),
};

const RentalManagementPage = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalInputs, setModalInputs] = useState<
    { label: string; key: string; type: ModalInputTypesType }[] | null
  >(null);
  const [modalTitle, setModalTitle] = useState<string>("");
  const [tableData, setTableData] = useState<UsageData[] | null>(null);
  const [filterData, setFilterData] = useState<UsageData[] | null>(null);

  const [selectForm, selectDispatch] = useReducer(selectReducer, initialSelectForm);

  useEffect(() => {
    if (isModalOpen === true) return;
    const getTableData = async () => {
      const res = await getSearchCompanyRental();
      if (res.pass) {
        setTableData(res.data);
      } else {
        console.log("데이터 불러오기 실패");
      }
    };
    getTableData();
  }, [isModalOpen]);

  useEffect(()=>{
    if(!tableData)return
    const filterTableData = tableData.filter((item) => {
      return selectForm.order==='처리 여부' 
        || (selectForm.order==='미확인' && item.status==='NOT_CONFIRMED')
        || (selectForm.order==='반납됨' && item.status==='RETURNED')
        || (selectForm.order==='이용중' && item.status==='IN_USE')
    })
    setFilterData(filterTableData)
  },[selectForm, tableData])

  const onClickTableButton = ({ value }: { value: string }) => {
    setIsModalOpen(true);
    setModalTitle(value);
    if (inputOption[value]) {
      setModalInputs(inputOption[value]);
    }
  };

  const onClickTableRow = (row:UsageData) => {
    setModalTitle('수정');
    const addInitialInputs = inputOption['수정'].map((item) => {
      return {
        ...item,
        initial: item.key==='rentalId' ? row.rental_id : row[item.key]
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
            <h1 className="text-xl font-bold">대여 관리</h1>
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
          </div>
        </div>
        <CustomTable header={tableHeader} data={filterData} rowUpdate={onClickTableRow} />
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

export default RentalManagementPage;
