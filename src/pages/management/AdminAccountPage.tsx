import { useState, useEffect, useMemo, useCallback } from "react";
import BannerButton from "@/components/BannerButton";
import CustomTable, { type UsageData } from "@/components/CustomTable";
import MainHeader from "@/components/MainHeader";
import TableButton from "@/components/TableButton";
import Modal from "@/components/modal/Modal";
import type { ModalInputTypesType } from "@/components/modal/ModalInput";
import { MODAL_TITLES } from "@/constants/modals";
import { toast } from "react-toastify";
import { getAllAdminInfo, deleteAdmin, putAdminInfo } from "@/services/api/AdminAPI";

//수정 필요: 관리자 계정 관리 API로 변경해야함

export type modalState = Record<string, Date | string | number | null>;

export type ModalSubmitFn = (form: modalState) => Promise<{ data: unknown; pass: boolean }>;

const tableHeader = [
  { name: "ID", id: "id" },
  { name: "추가일", id: "created_at" },
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
        disable?: boolean;
      }[]
    >
  >
>(
  () => ({
    [MODAL_TITLES.SAVE]: [
      { label: "ID", key: "id", type: "text", disable: true, hide: true },
      { label: "관리 권한 허가 여부", key: "status", type: "option" },
    ],
  }),
  []
);

//모달 Submit 함수
const modalSubmitFn: Partial<
  Record<(typeof MODAL_TITLES)[keyof typeof MODAL_TITLES], ModalSubmitFn>
> = {
  [MODAL_TITLES.SAVE]: () =>
    putAdminInfo({
      id: "",
      email: "",
      phone: "",
      role: "",
    }),
};

const AdminAccountPage = () => {
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

  useEffect(() => {
    if (isModalOpen === true) return;
    const getTableData = async () => {
      const res = await getAllAdminInfo();
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
        toast.error("선택된 계정이 없습니다.");
        setIsDeleteMode(false);
        return;
      }

      //api 수정 필요
      const res = await deleteAdmin({ adminId: selectedRowId });
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
      setModalTitle(MODAL_TITLES.SAVE);
      const addInitialInputs = inputOption[MODAL_TITLES.SAVE]?.map((item) => {
        return {
          ...item,
          initial: item.key === "id" ? row.id : row[item.key],
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
            <h1 className="text-xl font-bold">관리자 계정 관리</h1>
          </div>
          <div className="flex gap-[10px]">
            <TableButton
              value="삭제"
              onClick={() => onClickTableButton({ value: "삭제" })}
              isDeleteMode={isDeleteMode}
            />
          </div>
        </div>
        <CustomTable
          header={tableHeader}
          data={tableData}
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

export default AdminAccountPage;
