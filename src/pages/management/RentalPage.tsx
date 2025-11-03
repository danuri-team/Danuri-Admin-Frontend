import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import BannerButton from "@/components/BannerButton";
import CustomSelect from "@/components/CustomSelect";
import CustomTable, { type UsageData } from "@/components/CustomTable";
import MainHeader from "@/components/MainHeader";
import Modal from "@/components/modal/Modal";
import TableButton from "@/components/TableButton";
import {
  getSearchCompanyRental,
  postCreateRental,
  putUpdateRental,
} from "@/services/api/RentalAPI";
import { toast } from "react-toastify";
import { MODAL_TITLES } from "@/constants/modals";
import type { ModalInputTypesType, modalState, ModalSubmitFnType } from "@/types/modal";
import { useSearchParams } from "react-router-dom";

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

const INITIAL_SELECT_FORM: SelectState = {
  order: "처리 여부",
};

const FIXED_TABLE_HEADERS = [
  { name: "물품", id: "item_name" },
  { name: "유저", id: "user_id" },
  { name: "이용 ID", id: "rental_id" },
  { name: "대여 개수", id: "quantity" },
  { name: "반납 개수", id: "returned_quantity" },
  { name: "상태 ", id: "status" },
];

//type = 'select' || 'date'
const FILTER_SELECTS: filterSelectType[] = [
  { id: "order", type: "select", options: ["처리 여부", "미확인", "반납됨", "이용중"] },
];

const selectReducer = (state: SelectState, action: SelectAction) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        [action.payload.key]: action.payload.value,
      };
    case "RESET":
      return INITIAL_SELECT_FORM;
  }
};

const modalSubmitFn: Partial<
  Record<(typeof MODAL_TITLES)[keyof typeof MODAL_TITLES], ModalSubmitFnType>
> = {
  [MODAL_TITLES.ADD]: (form: modalState) =>
    postCreateRental({
      itemId: form.itemId as string,
      quantity: form.quantity as number,
      usageId: form.usageId as string,
    }),
  [MODAL_TITLES.EDIT]: (form: modalState) =>
    putUpdateRental({
      rentalId: form.rentalId as string,
      quantity: form.quantity as number,
      returnedQuantity: form.returned_quantity as number,
      status: form.status as string,
    }),
};

const RentalPage = () => {
  const [searchParams] = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalInputs, setModalInputs] = useState<
    { label: string; key: string; type: ModalInputTypesType }[] | null
  >(null);
  const [modalTitle, setModalTitle] = useState<
    (typeof MODAL_TITLES)[keyof typeof MODAL_TITLES] | null
  >(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [tableData, setTableData] = useState<UsageData[] | null>(null);
  const [filterData, setFilterData] = useState<UsageData[] | null>(null);

  const [selectForm, selectDispatch] = useReducer(selectReducer, INITIAL_SELECT_FORM);

  useEffect(() => {
    if (isModalOpen === true) return;
    const getTableData = async () => {
      const res = await getSearchCompanyRental({
        page: Number(searchParams.get("page")) || 0,
        size: Number(searchParams.get("size")) || 10,
      });
      if (res.pass) {
        setTableData((res.data as any).content);
        setTotalPages((res.data as any).total_pages);
      } else {
        toast.error("데이터를 불러오지 못했습니다.");
      }
    };
    getTableData();
  }, [isModalOpen, searchParams.get("page"), searchParams.get("size")]);

  useEffect(() => {
    if (!tableData) return;
    const filterTableData = tableData.filter((item) => {
      return (
        selectForm.order === "처리 여부" ||
        (selectForm.order === "미확인" && item.status === "NOT_CONFIRMED") ||
        (selectForm.order === "반납됨" && item.status === "RETURNED") ||
        (selectForm.order === "이용중" && item.status === "IN_USE")
      );
    });
    setFilterData(filterTableData);
  }, [selectForm, tableData]);

  const inputOption = useMemo<
    Partial<
      Record<
        (typeof MODAL_TITLES)[keyof typeof MODAL_TITLES],
        {
          label: string;
          key: string;
          type: ModalInputTypesType;
          initial?: string | number | Date;
          hide?: boolean;
        }[]
      >
    >
  >(
    () => ({
      [MODAL_TITLES.ADD]: [
        { label: "물품", key: "itemId", type: "search" },
        { label: "공간사용", key: "usageId", type: "search" },
        { label: "대여 개수", key: "quantity", type: "number" },
      ],
      [MODAL_TITLES.EDIT]: [
        { label: "대여 ID", key: "rentalId", type: "text", hide: true },
        { label: "대여 개수", key: "quantity", type: "number" },
        { label: "반납 개수", key: "returned_quantity", type: "number" },
        { label: "상태", key: "status", type: "option" },
      ],
    }),
    []
  );

  const onClickTableButton = useCallback(
    ({ value }: { value: (typeof MODAL_TITLES)[keyof typeof MODAL_TITLES] }) => {
      setIsModalOpen(true);
      setModalTitle(value);
      if (inputOption[value]) {
        setModalInputs(inputOption[value]);
      }
    },
    [inputOption]
  );

  const onClickTableRow = (row: UsageData) => {
    setModalTitle(MODAL_TITLES.EDIT);
    const addInitialInputs = inputOption[MODAL_TITLES.EDIT]?.map((item) => {
      return {
        ...item,
        initial: item.key === "rentalId" ? row.rental_id : row[item.key],
      };
    });
    addInitialInputs && setModalInputs(addInitialInputs);
    setIsModalOpen(true);
  };

  const onCloseModal = () => {
    setIsModalOpen(false);
    setModalTitle(null);
    setModalInputs(null);
  };

  return (
    <div className="w-full">
      <MainHeader />
      <BannerButton />
      <div className="flex-1 max-w-360 justify-self-center mr-[50px] ml-[50px] text-nowrap">
        <div className="mr-[20px] ml-[20px] mb-[30px] flex justify-between">
          <div className="flex items-center">
            <h1 className="text-xl font-bold">대여 관리</h1>
            {FILTER_SELECTS.map((item) => (
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
            <TableButton
              value="추가"
              onClick={() => onClickTableButton({ value: MODAL_TITLES.ADD })}
            />
          </div>
        </div>
        <CustomTable
          header={FIXED_TABLE_HEADERS}
          data={filterData}
          rowUpdate={onClickTableRow}
          totalPages={totalPages}
        />
      </div>
      {isModalOpen && modalTitle && modalSubmitFn[modalTitle] && (
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

export default RentalPage;
