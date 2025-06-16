import { useState } from "react";
import BannerButton from "../components/BannerButton";
import CustomTable from "../components/CustomTable";
import MainHeader from "../components/MainHeader";
import Modal from "../components/Modal";
import type { ModalInputTypesType } from "../components/ModalInput";
import TableButton from "../components/TableButton";

const tableHeader = [
  { name: "공간명", id: "name" },
  { name: "시작시간", id: "start_at" },
  { name: "종료시간", id: "end_at" },
  { name: "사용횟수", id: "usage_count" },
  { name: "상태", id: "status" },
];

const mockData = [
  {
    id: "0e97af91-77ca-44a2-98c9-66a47ecf000a",
    company_id: "7419d2c7-8bee-48c5-8a73-d8861e40582c",
    company_name: "페더",
    name: "노래방",
    start_at: [1, 0],
    end_at: [23, 8, 13],
    usage_count: 9,
  },
  {
    id: "1296b67c-bf5d-4cc3-b9a2-5538232b2fcd",
    company_id: "7419d2c7-8bee-48c5-8a73-d8861e40582c",
    company_name: "페더",
    name: "회의실 A",
    start_at: [0, 0, 1],
    end_at: [23, 59, 59],
    usage_count: 0,
  },
];

const inputOption: Record<string, { label: string; type: ModalInputTypesType }[]> = {
  추가: [
    { label: "공간명", type: "text" },
    { label: "시작시간", type: "time" },
    { label: "종료시간", type: "time" },
  ],
};

const SpaceManagementPage = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalInputs, setModalInputs] = useState<
    { label: string; type: ModalInputTypesType }[] | null
  >(null);
  const [modalTitle, setModalTitle] = useState<string>("");

  const onClickTableButton = ({ value }: { value: string }) => {
    setIsModalOpen(true);
    setModalTitle(value);
    if (inputOption[value]) {
      setModalInputs(inputOption[value]);
    }
  };

  const onCloseModal = () => {
    setIsModalOpen(false);
    setModalTitle("");
    setModalInputs(null);
  };

  return (
    <div className="w-full">
      <MainHeader />
      <BannerButton />
      <div className="flex-1 mr-[50px] ml-[50px] text-nowrap">
        <div className="mr-[20px] ml-[20px] mb-[30px] flex justify-between">
          <div className="flex items-center">
            <h1 className="text-xl font-bold">공간 관리</h1>
          </div>
          <div className="flex gap-[10px]">
            <TableButton value="추가" onClick={() => onClickTableButton({ value: "추가" })} />
            <TableButton value="삭제" />
          </div>
        </div>
        <CustomTable header={tableHeader} data={mockData} />
      </div>
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          title={modalTitle}
          inputs={modalInputs}
          onClose={onCloseModal}
        />
      )}
    </div>
  );
};

export default SpaceManagementPage;
