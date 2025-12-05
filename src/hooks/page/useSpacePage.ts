import { useEffect, useMemo, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { MODAL_TITLES } from "@/constants/modals";
import { useModal } from "@/hooks/useModal";
import type { TableHeader, UsageData } from "@/types/table";
import type { ModalInput, modalState, ModalSubmitFnType } from "@/types/modal";
import {
  deleteSpace,
  getSearchCompanySpace,
  postCreateSpace,
  putUpdateSpace,
} from "@/services/api/SpaceAPI";
import { formatDatetoTime, formatTimetoDate } from "@/utils/format/dateFormat";
import type { Space } from "@/types/domains/space";

// Constants
const FIXED_TABLE_HEADERS: TableHeader[] = [
  { name: "공간명", id: "name" },
  { name: "시작시간", id: "start_at" },
  { name: "종료시간", id: "end_at" },
  { name: "사용횟수", id: "usage_count" },
  { name: "상태", id: "status" },
];

// Hook
export const useSpacePage = () => {
  const [searchParams] = useSearchParams();
  const modal = useModal();

  // State
  const spaceTableHeader = useMemo(() => FIXED_TABLE_HEADERS, []);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [tableData, setTableData] = useState<Space[] | null>(null);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState("");

  // Extract search params
  const page = Number(searchParams.get("page")) || 0;
  const size = Number(searchParams.get("size")) || 10;

  // Modal Submit Functions
  const modalSubmitFn: Partial<
    Record<(typeof MODAL_TITLES)[keyof typeof MODAL_TITLES], ModalSubmitFnType>
  > = {
    [MODAL_TITLES.ADD]: (form: modalState) =>
      postCreateSpace({
        name: form.name as string,
        startTime: formatDatetoTime(form.startTime as Date),
        endTime: formatDatetoTime(form.endTime as Date),
        allowMultiSpaceBooking: !!form.allowOverlap as boolean,
        allowOverlap: !!form.allowOverlap as boolean,
      }),
    [MODAL_TITLES.EDIT]: (form: modalState) =>
      putUpdateSpace({
        spaceId: form.spaceId as string,
        name: form.name as string,
        startTime: formatDatetoTime(form.startTime as Date),
        endTime: formatDatetoTime(form.endTime as Date),
        allowMultiSpaceBooking: !!form.allowOverlap as boolean,
        allowOverlap: !!form.allowOverlap as boolean,
      }),
  };

  useEffect(() => {
    if (modal.isOpen) return;

    const fetchUserData = async () => {
      const res = await getSearchCompanySpace({ page, size });
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
        { label: "공간명", key: "name", type: "text" },
        { label: "시작시간", key: "startTime", type: "time" },
        { label: "종료시간", key: "endTime", type: "time" },
        { label: "동시 다중 공간 예약", key: "allowMultiSpaceBooking", type: "checkbox" },
        { label: "중복 예약", key: "allowOverlap", type: "checkbox" },
      ],
      [MODAL_TITLES.EDIT]: [
        { label: "공간 ID", key: "spaceId", type: "text", hide: true },
        { label: "공간명", key: "name", type: "text" },
        { label: "시작시간", key: "startTime", type: "time" },
        { label: "종료시간", key: "endTime", type: "time" },
        { label: "동시 다중 공간 예약", key: "allowMultiSpaceBooking", type: "checkbox" },
        { label: "중복 예약", key: "allowOverlap", type: "checkbox" },
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
      toast.error("선택된 공간이 없습니다.");
      setIsDeleteMode(false);
      return;
    }

    const res = await deleteSpace({ spaceId: selectedRowId });
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
        const value =
          item.key === "spaceId"
            ? row.id
            : item.key === "startTime"
              ? formatTimetoDate(row.start_at as number[])
              : item.key === "endTime"
                ? formatTimetoDate(row.end_at as number[])
                : row[item.key];
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

  return {
    // State
    spaceTableHeader,
    totalPages,
    tableData,
    isDeleteMode,
    selectedRowId,
    // Modal
    modal,

    // Handlers
    handleChangeSelectedRow,
    handleTableButton,
    handleTableRowClick,
    handleModalSubmit,
  };
};
