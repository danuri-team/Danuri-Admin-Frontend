import { useEffect, useMemo, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { MODAL_TITLES } from "@/constants/modals";
import { useModal } from "@/hooks/useModal";
import type { TableHeader, UsageData } from "@/types/table";
import type { ModalInput, modalState, ModalSubmitFnType } from "@/types/modal";
import { formatDatetoTime, formatTimetoDate } from "@/utils/format/dateFormat";
import {
  deleteDevice,
  getSearchCompanyDevice,
  postAddDevice,
  putUpdateDevice,
} from "@/services/api/DeviceAPI";
import type { Device } from "@/types/domains/device";

// Constants
const FIXED_TABLE_HEADERS: TableHeader[] = [
  { name: "별칭", id: "name" },
  { name: "ID", id: "id" },
  { name: "추가일", id: "created_at" },
  { name: "행동", id: "connect" },
];

// Hook
export const useMachinePage = () => {
  const [searchParams] = useSearchParams();
  const modal = useModal();

  // State
  const machineTableHeader = useMemo(() => FIXED_TABLE_HEADERS, []);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [tableData, setTableData] = useState<Device[] | null>(null);
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
      postAddDevice({
        name: form.name as string,
      }),
    [MODAL_TITLES.SAVE]: (form: modalState) =>
      putUpdateDevice({
        deviceId: form.id as string,
        name: form.name as string,
      }),
    [MODAL_TITLES.CONNECT]: async () => {
      return { data: null, pass: true };
    },
    [MODAL_TITLES.EDIT]: (form: modalState) =>
      putUpdateDevice({
        deviceId: form.id as string,
        name: form.name as string,
      }),
  };

  useEffect(() => {
    if (modal.isOpen) return;

    const fetchUserData = async () => {
      const res = await getSearchCompanyDevice({ page, size });
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
      [MODAL_TITLES.ADD]: [{ label: "별칭", key: "name", type: "text" }],
      [MODAL_TITLES.EDIT]: [
        { label: "ID", key: "id", type: "text", disable: true },
        { label: "별칭", key: "name", type: "text" },
      ],
      [MODAL_TITLES.CONNECT]: [{ label: "", key: "QRCode", type: "image", disable: true }],
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
      toast.error("선택된 기기가 없습니다.");
      setIsDeleteMode(false);
      return;
    }

    const res = await deleteDevice({ deviceId: selectedRowId });
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
    (row: UsageData, title?: (typeof MODAL_TITLES)[keyof typeof MODAL_TITLES]) => {
      const modalTitle = title ? title : MODAL_TITLES.SAVE;
      const addInitialInputs = inputOption[modalTitle]?.map((item) => {
        const value =
          title === MODAL_TITLES.CONNECT && item.key === "QRCode"
            ? row.id
            : item.key === "itemId"
              ? row.id
              : row[item.key];
        return {
          ...item,
          initial: typeof value === "object" && !(value instanceof Date) ? undefined : value,
        };
      });
      if (addInitialInputs) {
        modal.openModal(modalTitle, addInitialInputs);
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
    machineTableHeader,
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
