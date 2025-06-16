import { useEffect, useState } from "react";
import BannerButton from "../components/BannerButton";
import CustomTable, { type UsageData } from "../components/CustomTable";
import MainHeader from "../components/MainHeader";
import Modal from "../components/Modal";
import type { ModalInputTypesType } from "../components/ModalInput";
import TableButton from "../components/TableButton";
import { getSearchCompanySpace } from "../api/SpaceAPI";

const tableHeader = [
  { name: "공간명", id: "name" },
  { name: "시작시간", id: "start_at" },
  { name: "종료시간", id: "end_at" },
  { name: "사용횟수", id: "usage_count" },
  { name: "상태", id: "status" },
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
  const [tableData, setTableData] = useState<UsageData[]|null>(null);

  useEffect(()=>{
    const getTableData = async () => {
      const res = await getSearchCompanySpace();
      if(res.pass){
        setTableData(res.data)
      }
      else {
        console.log('데이터 불러오기 실패')
      }
    }
    getTableData();
  },[tableData])

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
        <CustomTable header={tableHeader} data={tableData} />
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
