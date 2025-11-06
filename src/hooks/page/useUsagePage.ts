import { useEffect, useMemo, useReducer, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { formatDatetoISOString } from "@/utils/format/dateFormat";
import { MODAL_TITLES } from "@/constants/modals";
import { useModal } from "@/hooks/useModal";
import type { TableHeader, UsageData } from "@/types/table";
import type { ModalInput, modalState, ModalSubmitFnType } from "@/types/modal";
import {
  postCreateUsage,
  postUsageExcel,
  postUsageSearch,
  putForcedToLeave,
} from "@/services/api/UsageAPI";
import type { Usage } from "@/types/domains/usage";
import { parseSignUpFormSchema } from "@/utils/parse/useSchemaParsing";

// 사용 기록 검색 상태
type UsageState = {
  startDate: string | null;
  endDate: string | null;
  spaceId: string | null;
  userId: string | null;
};

interface SelectState {
  order: string;
  useDate: { startDate: Date | null; endDate: Date | null };
}

type UsageAction = { type: "CHANGE"; payload: { key: string; value: string } } | { type: "RESET" };

type SelectAction =
  | { type: "CHANGE"; payload: { key: string; value: string | Date | null } }
  | { type: "CHANGE_RANGE"; payload: { key: string; value: SelectState["useDate"] } }
  | { type: "RESET" };

// Constants
const FIXED_TABLE_HEADERS: TableHeader[] = [
  { name: "사용 ID", id: "id" },
  { name: "공간", id: "space_name" },
  { name: "시작일", id: "start_at" },
  { name: "종료일", id: "end_at" },
  { name: "유저", id: "user_id" },
  { name: "이름", id: "name" },
  { name: "상태", id: "status" },
];

const INITIAL_SELECT_FORM: SelectState = {
  order: "이용일순",
  useDate: {
    startDate: null,
    endDate: null,
  },
};

const INITIAL_USAGE_FORM: UsageState = {
  startDate: "2025-03-01T00:00:00",
  endDate: "",
  spaceId: null,
  userId: null,
};

const transformUsageData = (usage: Usage): UsageData => {
  const schema = parseSignUpFormSchema(usage.form_result);
  const name: string =
    schema?.["이름"] && typeof schema?.["이름"] === "string" ? schema?.["이름"] : "";

  return {
    ...usage,
    name,
  };
};

// Reducer
const selectReducer = (state: SelectState, action: SelectAction): SelectState => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        [action.payload.key]: action.payload.value,
      };
    case "CHANGE_RANGE":
      return {
        ...state,
        useDate: action.payload.value,
      };
    case "RESET":
      return INITIAL_SELECT_FORM;
  }
};

// 사용 기록 검색 상태 리듀서
const usageReducer = (state: UsageState, action: UsageAction): UsageState => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        [action.payload.key]: action.payload.value,
      };
    case "RESET":
      return INITIAL_USAGE_FORM;
  }
};

// Hook
export const useUsagePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const modal = useModal();

  // State
  const userTableHeader = useMemo(() => FIXED_TABLE_HEADERS, []);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [tableData, setTableData] = useState<UsageData[] | null>(null);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState("");
  const [selectForm, selectDispatch] = useReducer(selectReducer, INITIAL_SELECT_FORM);
  const [usageForm, usageDispatch] = useReducer(usageReducer, INITIAL_USAGE_FORM);

  // Extract search params
  const page = Number(searchParams.get("page")) || 0;
  const size = Number(searchParams.get("size")) || 10;

  // Modal Submit Functions
  const modalSubmitFn: Partial<
    Record<(typeof MODAL_TITLES)[keyof typeof MODAL_TITLES], ModalSubmitFnType>
  > = {
    [MODAL_TITLES.ADD]: (form: modalState) =>
      postCreateUsage({
        userId: form.userId as string,
        spaceId: form.spaceId as string,
        startDate: form.startDate ? formatDatetoISOString(form.startDate as Date) : null,
        endDate: form.endDate ? formatDatetoISOString(form.endDate as Date) : null,
      }),
    [MODAL_TITLES.DOWNLOAD]: (form: modalState) =>
      postUsageExcel({
        userId: form.userId as string,
        spaceId: form.spaceId as string,
        startDate: form.startDate ? formatDatetoISOString(form.startDate as Date) : null,
        endDate: form.endDate ? formatDatetoISOString(form.endDate as Date) : null,
      }),
  };

  useEffect(() => {
    if (modal.isOpen || modal.title === MODAL_TITLES.SEARCH) return;

    const fetchUserData = async () => {
      const res = await postUsageSearch({ usageForm, page, size });
      if (!res.pass) return;
      const usage = res.data.content.map(transformUsageData);
      console.log(usage);
      setTableData(usage);
      setTotalPages(res.data.total_pages);
    };

    fetchUserData();
  }, [modal.isOpen, isDeleteMode, modal.title, page, size, usageForm]);

  useEffect(() => {
    if (!tableData) return;
    matchesFilter(selectForm);
  }, [selectForm]);

  const matchesFilter = useCallback(
    (selectForm: SelectState) => {
      const { startDate, endDate } = selectForm.useDate;
      if (startDate) {
        usageDispatch({
          type: "CHANGE",
          payload: { key: "startDate", value: formatDatetoISOString(startDate) },
        });
      }
      if (endDate) {
        usageDispatch({
          type: "CHANGE",
          payload: { key: "endDate", value: formatDatetoISOString(endDate) },
        });
      }
    },
    [selectForm.useDate]
  );
  // Memoized Values
  const inputs = useMemo<ModalInput[]>(
    () =>
      userTableHeader.map((header) => ({
        label: header.name,
        key: header.id,
        type: "text" as const,
      })),
    [userTableHeader]
  );

  const inputOption = useMemo<
    Partial<Record<(typeof MODAL_TITLES)[keyof typeof MODAL_TITLES], ModalInput[]>>
  >(
    () => ({
      [MODAL_TITLES.ADD]: [
        { label: "공간", key: "spaceId", type: "search" },
        { label: "시작일", key: "startDate", type: "date" },
        { label: "종료일", key: "endDate", type: "date" },
        { label: "유저", key: "userId", type: "search" },
      ],
      [MODAL_TITLES.DOWNLOAD]: [
        { label: "공간", key: "spaceId", type: "search" },
        { label: "시작일", key: "startDate", type: "date" },
        { label: "종료일", key: "endDate", type: "date" },
        { label: "유저", key: "userId", type: "search" },
      ],
    }),
    [inputs]
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
      toast.error("선택된 이용이 없습니다.");
      setIsDeleteMode(false);
      return;
    }

    const currentTime = formatDatetoISOString(new Date());
    const res = await putForcedToLeave({ usageId: selectedRowId, end_at: currentTime });
    if (res.pass) {
      toast.success("강제퇴실되었습니다.");
      setIsDeleteMode(false);
    } else {
      toast.error("강제퇴실에 실패했습니다.");
    }
  }, [isDeleteMode, selectedRowId]);

  const handleTableButton = useCallback(
    ({ value }: { value: (typeof MODAL_TITLES)[keyof typeof MODAL_TITLES] }) => {
      if (value === MODAL_TITLES.FORCED) {
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

  const handleRentalNavigate = useCallback(() => {
    navigate("/rental");
  }, [navigate]);

  const handleFilterChange = useCallback((key: string, value: string | Date | null) => {
    selectDispatch({
      type: "CHANGE",
      payload: { key, value },
    });
  }, []);

  return {
    // State
    userTableHeader,
    totalPages,
    tableData,
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
    handleRentalNavigate,
    handleFilterChange,
  };
};
