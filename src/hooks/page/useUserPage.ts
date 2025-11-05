import { useEffect, useMemo, useReducer, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  deleteUser,
  getSearchCompanyUser,
  postCreateUser,
  putUpdateUser,
} from "@/services/api/UserAPI";
import { getJoinForm } from "@/services/api/FormAPI";
import { formatDatetoISOString } from "@/utils/format/dateFormat";
import { MODAL_TITLES } from "@/constants/modals";
import { useModal } from "@/hooks/useModal";
import type { TableHeader, UsageData } from "@/types/table";
import type { ModalInput, modalState, ModalSubmitFnType } from "@/types/modal";

// Types
interface UserApiResponse {
  id: string;
  phone: string;
  sign_up_form_schema: string;
  created_at: string;
  updated_at: string;
  usage_count: number;
}

interface SelectState {
  joinDate: Date | null;
  age: string;
  sex: string;
}

type SelectAction =
  | { type: "CHANGE"; payload: { key: string; value: string | Date | null } }
  | { type: "RESET" };

// Constants
const FIXED_TABLE_HEADERS: TableHeader[] = [
  { name: "ID", id: "id" },
  { name: "전화번호", id: "phone" },
  { name: "가입일", id: "created_at" },
];

const INITIAL_SELECT_FORM: SelectState = {
  joinDate: null,
  age: "나이대",
  sex: "성별",
};

// Helper Functions
const parseSignUpFormSchema = (schemaString: string): Record<string, unknown> | null => {
  if (!schemaString) return null;

  try {
    const schema = JSON.parse(schemaString);
    delete schema.id;
    return schema;
  } catch (error) {
    console.error("[다누리] 폼 응답 값 파싱에 실패했어요:", error);
    return null;
  }
};

const transformUserData = (user: UserApiResponse): UsageData => {
  const schema = parseSignUpFormSchema(user.sign_up_form_schema);

  return {
    ...user,
    ...(schema || {}),
    ID: user.id,
    phone: user.phone,
    created_at: user.created_at,
  };
};

const matchesFilter = (item: UsageData, selectForm: SelectState): boolean => {
  const matchJoinDate =
    !selectForm.joinDate ||
    (item.created_at as string).substring(0, 10) ===
      formatDatetoISOString(selectForm.joinDate).substring(0, 10);
  return matchJoinDate;
};

const matchesSearchForm = (item: UsageData, form: modalState): boolean => {
  const searchName = !form.name || form.name === item.name;
  const searchPhone = !form.phone || form.phone === item.phone;
  const searchSex = !form.sex || form.sex === item.sex;
  const searchAge = !form.age || form.age === item.age;

  return searchName && searchPhone && searchSex && searchAge;
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
export const useUserPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const modal = useModal();

  // State
  const [userTableHeader, setUserTableHeader] = useState<TableHeader[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [tableData, setTableData] = useState<UsageData[] | null>(null);
  const [filterData, setFilterData] = useState<UsageData[] | null>(null);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState("");
  const [selectForm, selectDispatch] = useReducer(selectReducer, INITIAL_SELECT_FORM);
  const [isJoinForm, setIsJoinForm] = useState(false);

  // Extract search params
  const page = Number(searchParams.get("page")) || 0;
  const size = Number(searchParams.get("size")) || 10;

  // Modal Submit Functions
  const modalSubmitFn: Partial<
    Record<(typeof MODAL_TITLES)[keyof typeof MODAL_TITLES], ModalSubmitFnType>
  > = {
    [MODAL_TITLES.ADD]: (form: modalState) =>
      postCreateUser({
        company_id: form.company_id as string,
        phone: form.phone as string,
      }),
    [MODAL_TITLES.EDIT]: (form: modalState) =>
      putUpdateUser({
        userId: form.id as string,
        phone: form.phone as string,
      }),
  };

  // Effects
  useEffect(() => {
    const fetchJoinFormStatus = async () => {
      const res = await getJoinForm();
      if (res.pass && Array.isArray(res.data) && res.data.length > 0) {
        setIsJoinForm(res.data[0].schema !== "");
      }
    };
    fetchJoinFormStatus();
  }, []);

  useEffect(() => {
    if (modal.isOpen || modal.title === MODAL_TITLES.SEARCH) return;

    const fetchUserData = async () => {
      const res = await getSearchCompanyUser({ page, size });
      if (!res.pass) return;

      const users = res.data.user_list.content.map(transformUserData);
      setTableData(users);
      setTotalPages(res.data.user_list.total_pages);

      const headers = res.data.header_list.map(
        (header: string): TableHeader => ({
          name: header,
          id: header,
        })
      );
      setUserTableHeader([...FIXED_TABLE_HEADERS, ...headers]);
    };

    fetchUserData();
  }, [modal.isOpen, isDeleteMode, modal.title, page, size]);

  useEffect(() => {
    if (!tableData) return;

    const filtered = tableData.filter((item) => matchesFilter(item, selectForm));
    setFilterData(filtered);
  }, [selectForm, tableData]);

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
      [MODAL_TITLES.ADD]: [...inputs],
      [MODAL_TITLES.EDIT]: [
        { label: "사용자 ID", key: "id", type: "text", hide: true },
        { label: "전화번호", key: "phone", type: "text" },
      ],
      [MODAL_TITLES.SEARCH]: [...inputs],
    }),
    [inputs]
  );

  // Callbacks
  const handleChangeSelectedRow = useCallback(({ id }: { id: string | null }) => {
    setSelectedRowId(id || "");
  }, []);

  const handleSearchTableData = useCallback(
    (form: modalState) => {
      if (!tableData) return;

      const searchData = tableData.filter((item) => matchesSearchForm(item, form));
      setFilterData(searchData);
    },
    [tableData]
  );

  const handleDeleteButton = useCallback(async () => {
    if (!isDeleteMode) {
      setIsDeleteMode(true);
      return;
    }

    if (!selectedRowId) {
      toast.error("선택된 사용자가 없습니다.");
      setIsDeleteMode(false);
      return;
    }

    const res = await deleteUser({ userId: selectedRowId });
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
      if (modal.title === MODAL_TITLES.SEARCH) {
        return handleSearchTableData(form);
      }
      return modalSubmitFn[modal.title]?.(form);
    },
    [modal.title, handleSearchTableData]
  );

  const handleResetFilter = useCallback(() => {
    selectDispatch({ type: "RESET" });
  }, []);

  const handleJoinFormNavigate = useCallback(() => {
    navigate("/joinForm");
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
    filterData,
    isDeleteMode,
    selectedRowId,
    selectForm,
    isJoinForm,

    // Modal
    modal,

    // Handlers
    handleChangeSelectedRow,
    handleTableButton,
    handleTableRowClick,
    handleModalSubmit,
    handleResetFilter,
    handleJoinFormNavigate,
    handleFilterChange,
  };
};
