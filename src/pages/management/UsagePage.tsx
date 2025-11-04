import CustomTable, { type UsageData } from "@/components/CustomTable";
import MainHeader from "@/components/MainHeader";
import BannerButton from "@/components/BannerButton";
import CustomSelect from "@/components/CustomSelect";
import TableButton from "@/components/TableButton";
import { useEffect, useMemo, useReducer, useState } from "react";
import Modal from "@/components/modal/Modal";
import {
  postCreateUsage,
  postUsageExcel,
  postUsageSearch,
  putForcedToLeave,
} from "@/services/api/UsageAPI";
import { formatDatetoISOString } from "@/utils/format/dateFormat";
import { useNavigate, useSearchParams } from "react-router-dom";
import { isAfter, isBefore } from "date-fns";
import { toast } from "react-toastify";
import { MODAL_TITLES } from "@/constants/modals";
import type { ModalInputTypesType, modalState, ModalSubmitFnType } from "@/types/modal";

// 필터 선택 타입
type FilterSelectType = {
  id: keyof SelectState;
  type: "select" | "date" | "rangeDate";
  options: string[];
};

// 필터 상태 (정렬 및 날짜 범위)
type SelectState = {
  order: string;
  useDate: { startDate: Date | null; endDate: Date | null };
  age: string;
  sex: string;
};

// 사용 기록 검색 상태
type UsageState = {
  startDate: string | null;
  endDate: string | null;
  spaceId: string | null;
  userId: string | null;
};

// 필터 액션
type SelectAction =
  | { type: "CHANGE"; payload: { key: string; value: string } }
  | { type: "CHANGE_RANGE"; payload: { key: string; value: SelectState["useDate"] } }
  | { type: "RESET" };

// 사용 기록 액션
type UsageAction = { type: "CHANGE"; payload: { key: string; value: string } } | { type: "RESET" };

type UsageListResponse = {
  content: UsageData[];
  total_pages: number;
};

const INITIAL_SELECT_FORM: SelectState = {
  order: "이용일순",
  useDate: {
    startDate: null,
    endDate: null,
  },
  age: "나이대",
  sex: "성별",
};

const INITIAL_USAGE_FORM: UsageState = {
  startDate: "2025-03-01T00:00:00",
  endDate: "",
  spaceId: null,
  userId: null,
};

const FIXED_TABLE_HEADERS = [
  { name: "사용 ID", id: "id" },
  { name: "공간", id: "space_name" },
  { name: "시작일", id: "start_at" },
  { name: "종료일", id: "end_at" },
  { name: "유저", id: "user_id" },
  { name: "상태", id: "status" },
];

// 필터 선택 옵션
const FILTER_SELECTS: FilterSelectType[] = [
  { id: "order", type: "select", options: ["이용일순", "상태순"] },
  { id: "useDate", type: "rangeDate", options: ["이용일"] },
];

// 필터 상태 리듀서
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
const UsagePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInputs, setModalInputs] = useState<
    { label: string; key: string; type: ModalInputTypesType }[] | null
  >(null);
  const [modalTitle, setModalTitle] = useState<
    (typeof MODAL_TITLES)[keyof typeof MODAL_TITLES] | null
  >(null);
  const [tableData, setTableData] = useState<UsageData[] | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState("");

  const [selectForm, selectDispatch] = useReducer(selectReducer, INITIAL_SELECT_FORM);
  const [usageForm, usageDispatch] = useReducer(usageReducer, INITIAL_USAGE_FORM);

  // 테이블 데이터 정렬
  const sortTableData = useMemo(() => {
    if (!tableData) return null;

    return [...tableData].sort((a, b) => {
      // 이용일순 정렬
      if (selectForm.order === "이용일순") {
        return isBefore(new Date(a.start_at as string), new Date(b.start_at as string)) ? -1 : 1;
      }

      // 상태순 정렬 (사용 중인 것이 먼저)
      const isAActive =
        isBefore(new Date(a.start_at as string), new Date()) &&
        isAfter(new Date(a.end_at as string), new Date());
      const isBActive =
        isBefore(new Date(b.start_at as string), new Date()) &&
        isAfter(new Date(b.end_at as string), new Date());

      if (isAActive && !isBActive) return -1;
      if (!isAActive && isBActive) return 1;
      return 0;
    });
  }, [tableData, selectForm.order]);

  // 날짜 범위 변경 시 검색 조건 업데이트
  useEffect(() => {
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
  }, [selectForm.useDate]);

  // 테이블 데이터 로드
  useEffect(() => {
    // 모달이 열려있으면 데이터 로드 스킵
    if (isModalOpen) return;

    const fetchTableData = async () => {
      const res = await postUsageSearch({
        usageForm,
        page: Number(searchParams.get("page")) || 0,
        size: Number(searchParams.get("size")) || 10,
      });

      if (res.pass) {
        const { content, total_pages } = res.data as UsageListResponse;
        setTableData(content);
        setTotalPages(total_pages);
      } else {
        toast.error("데이터를 불러오지 못했습니다.");
      }
    };

    fetchTableData();
  }, [usageForm, isModalOpen, isDeleteMode, searchParams.get("page"), searchParams.get("size")]);

  const inputOption = useMemo<
    Partial<
      Record<
        (typeof MODAL_TITLES)[keyof typeof MODAL_TITLES],
        { label: string; key: string; type: ModalInputTypesType }[]
      >
    >
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
    []
  );

  // 선택된 행 변경
  const changeSelectedRow = ({ id }: { id: string | null }) => {
    setSelectedRowId(id || "");
  };

  const onClickTableButton = ({
    value,
  }: {
    value: (typeof MODAL_TITLES)[keyof typeof MODAL_TITLES];
  }) => {
    if (value === MODAL_TITLES.FORCED) {
      handleForceLeave();
      return;
    }

    // 모달 열기
    setModalTitle(value);
    setModalInputs(inputOption[value] || null);
    setIsModalOpen(true);
  };

  // 모달 닫기
  const onCloseModal = () => {
    setIsModalOpen(false);
    setModalTitle(null);
    setModalInputs(null);
  };

  // 강제퇴실 처리
  const handleForceLeave = async () => {
    // 삭제 모드 토글
    if (!isDeleteMode) {
      setIsDeleteMode(true);
      return;
    }

    // 선택된 행 확인
    if (!selectedRowId) {
      toast.error("선택된 이용이 없습니다.");
      setIsDeleteMode(false);
      return;
    }

    // 강제퇴실 API 호출
    const currentTime = formatDatetoISOString(new Date());
    const res = await putForcedToLeave({ usageId: selectedRowId, end_at: currentTime });

    if (res.pass) {
      toast.success("강제퇴실되었습니다.");
    } else {
      toast.error("강제퇴실에 실패했습니다.");
    }

    setIsDeleteMode(false);
  };

  return (
    <div className="w-full">
      <MainHeader />
      <BannerButton />
      <div className="flex-1 max-w-360 justify-self-center mr-[50px] ml-[50px] text-nowrap">
        <div className="mr-[20px] ml-[20px]  mb-[30px] flex justify-between">
          <div className="flex items-center">
            <h1 className="text-xl font-bold">이용 현황</h1>
            {FILTER_SELECTS.map((item) => {
              if (item.type === "rangeDate")
                return (
                  <CustomSelect
                    key={item.id}
                    type={item.type}
                    options={item.options}
                    value={selectForm[item.id]}
                    onChange={(value) =>
                      selectDispatch({
                        type: "CHANGE_RANGE",
                        payload: {
                          key: item.id,
                          value: value as { startDate: Date | null; endDate: Date | null },
                        },
                      })
                    }
                  />
                );
              else
                return (
                  <CustomSelect
                    key={item.id}
                    type={item.type}
                    options={item.options}
                    value={selectForm[item.id]}
                    onChange={(value) =>
                      selectDispatch({
                        type: "CHANGE",
                        payload: { key: item.id, value: value as string },
                      })
                    }
                  />
                );
            })}
          </div>
          <div className="flex gap-[10px]">
            <TableButton
              value="다운로드"
              onClick={() => onClickTableButton({ value: MODAL_TITLES.DOWNLOAD })}
            />
            <TableButton value="대여관리" onClick={() => navigate("/rental")} />
            <TableButton
              value="추가"
              onClick={() => onClickTableButton({ value: MODAL_TITLES.ADD })}
            />
            <TableButton
              value="강제퇴실"
              onClick={() => onClickTableButton({ value: MODAL_TITLES.FORCED })}
              isDeleteMode={isDeleteMode}
            />
          </div>
        </div>
        <CustomTable
          header={FIXED_TABLE_HEADERS}
          data={sortTableData}
          changeSelectedRow={changeSelectedRow}
          isDeleteMode={isDeleteMode}
          selectedRowId={selectedRowId}
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

export default UsagePage;
