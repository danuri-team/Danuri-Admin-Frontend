import { useEffect, useMemo, useReducer, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { deleteUser, postCreateUser, putUpdateUser } from "@/services/api/UserAPI";
import { MODAL_TITLES } from "@/constants/modals";
import { useModal } from "@/hooks/useModal";
import type { TableHeader, UsageData } from "@/types/table";
import type { ModalInput, modalState, ModalSubmitFnType } from "@/types/modal";
import {
  deleteItem,
  getSearchCompanyItem,
  postCreateItem,
  putUpdateItem,
} from "@/services/api/ItemAPI";
import type { Item } from "@/types/domains/item";

interface SelectState {
  order: string;
}

type SelectAction =
  | { type: "CHANGE"; payload: { key: string; value: string | Date | null } }
  | { type: "RESET" };

// Constants
const FIXED_TABLE_HEADERS: TableHeader[] = [
  { name: "물품", id: "name" },
  { name: "총 수량", id: "total_quantity" },
  { name: "이용 가능 개수", id: "available_quantity" },
  { name: "상태", id: "status" },
];

const INITIAL_SELECT_FORM: SelectState = {
  order: "재고순",
};

// Reducer
const selectReducer = (state: SelectState, action: SelectAction): SelectState => {
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

// Hook
export const useItemPage = () => {
  const [searchParams] = useSearchParams();
  const modal = useModal();

  // State
  const itemTableHeader = useMemo(() => FIXED_TABLE_HEADERS, []);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [tableData, setTableData] = useState<Item[] | null>(null);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState("");
  const [selectForm, selectDispatch] = useReducer(selectReducer, INITIAL_SELECT_FORM);

  // Extract search params
  const page = Number(searchParams.get("page")) || 0;
  const size = Number(searchParams.get("size")) || 10;

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

  // Modal Submit Functions
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

  useEffect(() => {
    if (modal.isOpen) return;

    const fetchUserData = async () => {
      const res = await getSearchCompanyItem({ page, size });
      if (!res.pass) {
        toast.error("데이터를 불러오지 못했습니다.");
        return;
      }

      setTableData(res.data.content);
      setTotalPages(res.data.total_pages);
    };

    fetchUserData();
  }, [modal.isOpen, isDeleteMode, modal.title, page, size]);

  const inputOption = useMemo<
    Partial<Record<(typeof MODAL_TITLES)[keyof typeof MODAL_TITLES], ModalInput[]>>
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

  // Callbacks
  const handleChangeSelectedRow = useCallback(({ id }: { id: string | null }) => {
    setSelectedRowId(id || "");
  }, []);

  const handleDeleteButton = useCallback(async () => {
    if (!isDeleteMode) {
      setIsDeleteMode(true);
      return;
    }

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
  }, [isDeleteMode, selectedRowId]);

  const handleTableButton = useCallback(
    ({ value }: { value: (typeof MODAL_TITLES)[keyof typeof MODAL_TITLES] }) => {
      if (value === MODAL_TITLES.DELETE) {
        handleDeleteButton();
        return;
      }

      if (inputOption[value]) {
        modal.openModal(value, inputOption[value]);
      }
    },
    [inputOption, handleDeleteButton, modal]
  );

  const handleTableRowClick = useCallback(
    (row: UsageData) => {
      const addInitialInputs = inputOption[MODAL_TITLES.EDIT]?.map((item) => {
        const value = item.key === "itemId" ? row.id : row[item.key];
        return {
          ...item,
          initial: typeof value === "object" && !(value instanceof Date) ? undefined : value,
        };
      });
      if (addInitialInputs) {
        modal.openModal(MODAL_TITLES.EDIT, addInitialInputs);
      }
    },
    [inputOption, modal]
  );

  const handleModalSubmit = useCallback(
    (form: modalState) => {
      if (!modal.title) return;
      return modalSubmitFn[modal.title]?.(form);
    },
    [modal.title]
  );

  const handleResetFilter = useCallback(() => {
    selectDispatch({ type: "RESET" });
  }, []);

  const handleFilterChange = useCallback((key: string, value: string | Date | null) => {
    selectDispatch({
      type: "CHANGE",
      payload: { key, value },
    });
  }, []);

  return {
    // State
    itemTableHeader,
    totalPages,
    sortTableData,
    isDeleteMode,
    selectedRowId,
    selectForm,
    // Modal
    modal,

    // Handlers
    handleChangeSelectedRow,
    handleTableButton,
    handleTableRowClick,
    handleModalSubmit,
    handleResetFilter,
    handleFilterChange,
  };
};
