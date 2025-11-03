import CustomTable, { type UsageData } from "@/components/CustomTable";
import TableButton from "@/components/TableButton";
import MainHeader from "@/components/MainHeader";
import BannerButton from "@/components/BannerButton";
import CustomSelect from "@/components/CustomSelect";
import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import Modal from "@/components/modal/Modal";
import {
  deleteItem,
  getSearchCompanyItem,
  postCreateItem,
  putUpdateItem,
} from "@/services/api/ItemAPI";
import { toast } from "react-toastify";
import { MODAL_TITLES } from "@/constants/modals";
import type { TableHeader } from "@/types/table";
import type { ModalInputTypesType, modalState, ModalSubmitFnType } from "@/types/modal";

interface FilterSelectConfig {
  id: keyof SelectState;
  type: "select" | "date";
  options: string[];
}

type SelectState = {
  order: string;
};

type SelectAction =
  | { type: "CHANGE"; payload: { key: string; value: string | Date | null } }
  | { type: "RESET" };

const INITIAL_SELECT_FORM: SelectState = {
  order: "재고순",
};

const FIXED_TABLE_HEADERS: TableHeader[] = [
  { name: "물품", id: "name" },
  { name: "총 수량", id: "total_quantity" },
  { name: "이용 가능 개수", id: "available_quantity" },
  { name: "상태", id: "status" },
];

//type = 'select' || 'date'
const FILTER_SELECTS: FilterSelectConfig[] = [
  { id: "order", type: "select", options: ["재고순", "이름순", "이용 가능 여부 순"] },
];

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
      { label: "물품", key: "name", type: "text" },
      { label: "총 수량", key: "total_quantity", type: "number" },
      { label: "이용 가능 개수", key: "available_quantity", type: "number" },
      { label: "상태", key: "status", type: "option" },
    ],
    [MODAL_TITLES.EDIT]: [
      { label: "물품 ID", key: "itemId", type: "text", hide: true },
      { label: "물품", key: "name", type: "text" },
      { label: "총 수량", key: "total_quantity", type: "number" },
      { label: "이용 가능 개수", key: "available_quantity", type: "number" },
      { label: "상태", key: "status", type: "option" },
    ],
  }),
  []
);

//모달 Submit 함수
const modalSubmitFn: Partial<
  Record<(typeof MODAL_TITLES)[keyof typeof MODAL_TITLES], ModalSubmitFnType>
> = {
  [MODAL_TITLES.ADD]: (form: modalState) =>
    postCreateItem({
      name: form.name as string,
      totalQuantity: form.total_quantity as string,
      availableQuantity: form.available_quantity as string,
      status: form.status as string,
    }),
  [MODAL_TITLES.EDIT]: (form: modalState) =>
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
      return INITIAL_SELECT_FORM;
  }
};

const ItemPage = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalInputs, setModalInputs] = useState<
    { label: string; key: string; type: ModalInputTypesType }[] | null
  >(null);
  const [modalTitle, setModalTitle] = useState<
    (typeof MODAL_TITLES)[keyof typeof MODAL_TITLES] | null
  >(null);
  const [tableData, setTableData] = useState<UsageData[] | null>(null);

  const [isDeleteMode, setIsDeleteMode] = useState<boolean>(false);
  const [selectedRowId, setSelectedRowId] = useState<string>("");

  const [selectForm, selectDispatch] = useReducer(selectReducer, INITIAL_SELECT_FORM);

  const sortTableData = useMemo(() => {
    if (!tableData) return null;
    return [...tableData].sort((a, b) => {
      if (selectForm.order === "재고순") {
        return (a.available_quantity as number) - (b.available_quantity as number);
      } else if (selectForm.order === "이름순") {
        return (a.name as string).localeCompare(b.name as string);
      } else {
        if (a.status === "AVAILABLE" && b.status !== "AVAILABLE") return -1;
        else if (a.status !== "AVAILABLE" && b.status === "AVAILABLE") return 1;
        else return 0;
      }
    });
  }, [tableData, selectForm.order]);

  useEffect(() => {
    if (isModalOpen === true) return;
    const getTableData = async () => {
      const res = await getSearchCompanyItem();
      if (res.pass) {
        setTableData(res.data);
      } else {
        toast.error("데이터를 불러오지 못했습니다.");
      }
    };
    getTableData();
  }, [isModalOpen, isDeleteMode]);

  const changeSelectedRow = ({ id }: { id: string | null }) => {
    if (id) {
      setSelectedRowId(id);
    } else setSelectedRowId("");
  };

  const onClickTableButton = ({
    value,
  }: {
    value: (typeof MODAL_TITLES)[keyof typeof MODAL_TITLES];
  }) => {
    if (value === MODAL_TITLES.DELETE) {
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
    if (!isDeleteMode) {
      setIsDeleteMode(true);
    } else {
      if (!selectedRowId) {
        toast.error("선택된 물품이 없습니다.");
        setIsDeleteMode(false);
        return;
      }
      const res = await deleteItem({ itemId: selectedRowId });
      if (res.pass) {
        toast.success("삭제되었습니다.");
        setIsDeleteMode(false);
      } else {
        toast.error("삭제에 실패했습니다.");
      }
    }
  };

  const onClickTableRow = useCallback(
    (row: UsageData) => {
      setModalTitle(MODAL_TITLES.EDIT);
      const addInitialInputs = inputOption[MODAL_TITLES.EDIT]?.map((item) => {
        return {
          ...item,
          initial: item.key === "itemId" ? row.id : row[item.key],
        };
      });
      addInitialInputs && setModalInputs(addInitialInputs);
      setIsModalOpen(true);
    },
    [inputOption]
  );

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
            <h1 className="text-xl font-bold">물품 관리</h1>
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
            <TableButton
              value="삭제"
              onClick={() => onClickTableButton({ value: MODAL_TITLES.DELETE })}
              isDeleteMode={isDeleteMode}
            />
          </div>
        </div>
        <CustomTable
          header={FIXED_TABLE_HEADERS}
          data={sortTableData}
          rowUpdate={onClickTableRow}
          isDeleteMode={isDeleteMode}
          changeSelectedRow={changeSelectedRow}
          selectedRowId={selectedRowId}
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

export default ItemPage;
