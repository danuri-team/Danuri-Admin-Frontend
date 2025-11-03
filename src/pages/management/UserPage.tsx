import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

import CustomTable, { type UsageData } from "@/components/CustomTable";
import MainHeader from "@/components/MainHeader";
import CustomSelect from "@/components/CustomSelect";
import BannerButton from "@/components/BannerButton";
import TableButton from "@/components/TableButton";
import Modal from "@/components/modal/Modal";
import {
  deleteUser,
  getSearchCompanyUser,
  postCreateUser,
  putUpdateUser,
} from "@/services/api/UserAPI";
import { formatDatetoISOString } from "@/utils/format/dateFormat";
import { getJoinForm } from "@/services/api/FormAPI";
import { MODAL_TITLES } from "@/constants/modals";
import type { TableHeader } from "@/types/table";
import type { ModalInput, ModalInputTypesType, modalState, ModalSubmitFnType } from "@/types/modal";

// ============================================================================
// Types
// ============================================================================

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

interface FilterSelectConfig {
  id: keyof SelectState;
  type: "select" | "date";
  options: string[];
}

// ============================================================================
// Constants
// ============================================================================

// 테이블 고정 헤더
const FIXED_TABLE_HEADERS: TableHeader[] = [
  { name: "ID", id: "id" },
  { name: "전화번호", id: "phone" },
  { name: "가입일", id: "created_at" },
];

// 필터링 기본 값
const INITIAL_SELECT_FORM: SelectState = {
  joinDate: null,
  age: "나이대",
  sex: "성별",
};

// 필터링 컴포넌트
const FILTER_SELECTS: FilterSelectConfig[] = [
  { id: "joinDate", type: "date", options: ["가입일"] },
];

// ============================================================================
// Helper Functions
// ============================================================================

// 사용자 가입 폼 정보 파싱 함수
// string -> json
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

// 사용자 가입 폼 정보와 사용자 정보 결합 함수
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

// 선택에 맞게 데이터 필터링하는 함수
const matchesFilter = (item: UsageData, selectForm: SelectState): boolean => {
  const matchJoinDate =
    !selectForm.joinDate ||
    (item.created_at as string).substring(0, 10) ===
      formatDatetoISOString(selectForm.joinDate).substring(0, 10);
  return matchJoinDate;
};

// 검색에 맞게 데이터 필터링하는 함수
const matchesSearchForm = (item: UsageData, form: modalState): boolean => {
  const searchName = !form.name || form.name === item.name;
  const searchPhone = !form.phone || form.phone === item.phone;
  const searchSex = !form.sex || form.sex === item.sex;
  const searchAge = !form.age || form.age === item.age;

  return searchName && searchPhone && searchSex && searchAge;
};

// ============================================================================
// Reducer
// ============================================================================

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

// ============================================================================
// Modal Submit Functions
// ============================================================================

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

// ============================================================================
// Component
// ============================================================================

const UserPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [userTableHeader, setUserTableHeader] = useState<TableHeader[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInputs, setModalInputs] = useState<ModalInput[] | null>(null);
  const [modalTitle, setModalTitle] = useState<
    (typeof MODAL_TITLES)[keyof typeof MODAL_TITLES] | null
  >(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [tableData, setTableData] = useState<UsageData[] | null>(null);
  const [filterData, setFilterData] = useState<UsageData[] | null>(null);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState("");
  const [selectForm, selectDispatch] = useReducer(selectReducer, INITIAL_SELECT_FORM);
  const [isJoinForm, setIsJoinForm] = useState(false);

  // ============================================================================
  // Effects
  // ============================================================================

  useEffect(() => {
    const fetchJoinFormStatus = async () => {
      const res = await getJoinForm();
      if (res.pass) {
        setIsJoinForm(res.data.schema !== "");
      }
    };
    fetchJoinFormStatus();
  }, []);

  useEffect(() => {
    if (isModalOpen || modalTitle === MODAL_TITLES.SEARCH) return;

    setModalTitle(null);

    const fetchUserData = async () => {
      const res = await getSearchCompanyUser({
        page: Number(searchParams.get("page")) || 0,
        size: Number(searchParams.get("size")) || 10,
      });
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
  }, [isModalOpen, isDeleteMode, modalTitle, searchParams.get("page"), searchParams.get("size")]);

  useEffect(() => {
    if (!tableData) return;

    const filtered = tableData.filter((item) => matchesFilter(item, selectForm));
    setFilterData(filtered);
  }, [selectForm, tableData]);

  // ============================================================================
  // Memoized Values
  // ============================================================================

  const inputs = useMemo<ModalInput[]>(
    () =>
      userTableHeader.map((header) => ({
        label: header.name,
        key: header.id,
        type: "text" as ModalInputTypesType,
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

  // ============================================================================
  // Callbacks
  // ============================================================================

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setModalInputs(null);
  }, []);

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

      setIsModalOpen(true);
      setModalTitle(value);
      if (inputOption[value]) {
        setModalInputs(inputOption[value]);
      }
    },
    [inputOption, handleDeleteButton]
  );

  const handleTableRowClick = useCallback(
    (row: UsageData) => {
      setModalTitle(MODAL_TITLES.EDIT);
      const addInitialInputs = inputOption[MODAL_TITLES.EDIT]?.map((item) => {
        const value = item.key === "itemId" ? row.id : row[item.key];
        return {
          ...item,
          initial: typeof value === "object" && !(value instanceof Date) ? undefined : value,
        };
      });
      addInitialInputs && setModalInputs(addInitialInputs);
      setIsModalOpen(true);
    },
    [inputOption]
  );

  const handleModalSubmit = useCallback(
    (form: modalState) => {
      if (!modalTitle) return;
      if (modalTitle === MODAL_TITLES.SEARCH) {
        return handleSearchTableData(form);
      }
      return modalSubmitFn[modalTitle]?.(form);
    },
    [modalTitle, handleSearchTableData]
  );

  const handleResetFilter = useCallback(() => {
    selectDispatch({ type: "RESET" });
  }, []);

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <div className="w-full">
      <MainHeader />
      <BannerButton />
      <div className="w-full flex-1 max-w-360 justify-self-center pr-[50px] pl-[50px] text-nowrap">
        <div className="mr-[20px] ml-[20px] mb-[30px] flex flex-1 justify-between">
          <div className="flex items-center">
            <h1 className="text-xl font-bold">사용자 관리</h1>
            {FILTER_SELECTS.map((item) => (
              <CustomSelect
                type={item.type}
                key={item.id}
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
            {selectForm.joinDate && (
              <button
                onClick={handleResetFilter}
                className="ml-[10px] text-sm text-gray-500 hover:text-gray-700 underline"
              >
                초기화
              </button>
            )}
          </div>
          <div className="flex gap-[10px]">
            <TableButton
              value={MODAL_TITLES.ADD}
              onClick={() => handleTableButton({ value: MODAL_TITLES.ADD })}
            />
            <TableButton
              value={MODAL_TITLES.SEARCH}
              onClick={() => handleTableButton({ value: MODAL_TITLES.SEARCH })}
            />
            <TableButton
              value={MODAL_TITLES.DELETE}
              onClick={() => handleTableButton({ value: MODAL_TITLES.DELETE })}
              isDeleteMode={isDeleteMode}
            />
            {!isJoinForm && (
              <TableButton value="가입 폼 관리" onClick={() => navigate("/joinForm")} />
            )}
          </div>
        </div>
        {userTableHeader.length > 0 && filterData ? (
          <CustomTable
            header={userTableHeader}
            data={filterData}
            rowUpdate={handleTableRowClick}
            isDeleteMode={isDeleteMode}
            changeSelectedRow={handleChangeSelectedRow}
            selectedRowId={selectedRowId}
            totalPages={totalPages}
          />
        ) : (
          <div className="w-full flex h-40 text-center">
            <p className="text-gray-300 flex-1 text-center my-auto">
              가입 폼 등록 후 이용 가능합니다.
            </p>
          </div>
        )}
      </div>
      {isModalOpen && modalInputs && modalTitle && (
        <Modal
          isOpen={isModalOpen}
          title={modalTitle}
          inputs={modalInputs}
          onClose={handleCloseModal}
          onSubmit={handleModalSubmit}
        />
      )}
    </div>
  );
};

export default UserPage;
