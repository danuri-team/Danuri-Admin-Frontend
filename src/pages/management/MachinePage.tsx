import { useState, useEffect, useMemo } from "react";
import BannerButton from "@/components/BannerButton";
import CustomTable, { type UsageData } from "@/components/CustomTable";
import MainHeader from "@/components/MainHeader";
import TableButton from "@/components/TableButton";
import Modal from "@/components/modal/Modal";
import {
  getSearchCompanyDevice,
  postAddDevice,
  putUpdateDevice,
  deleteDevice,
} from "@/services/api/DeviceAPI";
import { toast } from "react-toastify";
import { MODAL_TITLES } from "@/constants/modals";
import type { TableHeader } from "@/types/table";
import type { ModalInputTypesType, modalState, ModalSubmitFnType } from "@/types/modal";

const tableHeader: TableHeader[] = [
  { name: "별칭", id: "name" },
  { name: "ID", id: "id" },
  { name: "추가일", id: "created_at" },
  { name: "행동", id: "connect" },
];

//모달 Submit 함수
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
};

const MachinePage = () => {
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
      const res = await getSearchCompanyDevice();
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
      [MODAL_TITLES.ADD]: [{ label: "별칭", key: "name", type: "text" }],
      [MODAL_TITLES.EDIT]: [
        { label: "ID", key: "id", type: "text", disable: true },
        { label: "별칭", key: "name", type: "text" },
      ],
      [MODAL_TITLES.CONNECT]: [{ label: "", key: "QRCode", type: "image", disable: true }],
    }),
    []
  );

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
    }
  };

  const onClickTableRow = (
    row: UsageData,
    title: (typeof MODAL_TITLES)[keyof typeof MODAL_TITLES]
  ) => {
    setModalTitle(title);
    if (modalTitle) {
      const addInitialInputs = inputOption[modalTitle]?.map((item) => {
        if (title === "기기연결" && item.key === "QRCode") {
          return {
            ...item,
            initial: row.id,
          };
        }
        return {
          ...item,
          initial: item.key === "itemId" ? row.id : row[item.key],
        };
      });
      addInitialInputs && setModalInputs(addInitialInputs);
    }
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
            <h1 className="text-xl font-bold">기기 관리</h1>
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
          header={tableHeader}
          data={tableData}
          rowUpdate={(
            row: UsageData,
            title: (typeof MODAL_TITLES)[keyof typeof MODAL_TITLES] | undefined
          ) => onClickTableRow(row, title || "기기연결")}
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

export default MachinePage;
