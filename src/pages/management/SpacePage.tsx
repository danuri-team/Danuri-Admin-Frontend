import { useEffect, useState } from "react";
import BannerButton from "../../components/BannerButton";
import CustomTable, { type UsageData } from "../../components/CustomTable";
import MainHeader from "../../components/MainHeader";
import Modal from "../../components/modal/Modal";
import type { ModalInputTypesType } from "../../components/modal/ModalInput";
import TableButton from "../../components/TableButton";
import { deleteSpace, getSearchCompanySpace, postCreateSpace, putUpdateSpace } from "../../api/SpaceAPI";
import type { ModalSubmitFn, modalState } from "./ItemPage";
import { formatDatetoTime, formatTimetoDate } from "../../utils/format/dateFormat";
import { toast } from "react-toastify";

const tableHeader = [
  { name: "공간명", id: "name" },
  { name: "시작시간", id: "start_at" },
  { name: "종료시간", id: "end_at" },
  { name: "사용횟수", id: "usage_count" },
  { name: "상태", id: "status" },
];

const inputOption: Record<string, { label: string; key: string; type: ModalInputTypesType,  initial?: string | number | Date, hide?: boolean }[]> = {
  추가: [
    { label: "공간명", key: "name", type: "text" },
    { label: "시작시간", key: "startTime", type: "time" },
    { label: "종료시간", key: "endTime", type: "time" },
  ],
  수정: [
    { label: "공간 ID", key: "spaceId", type: "text", hide: true },
    { label: "공간명", key: "name", type: "text" },
    { label: "시작시간", key: "startTime", type: "time" },
    { label: "종료시간", key: "endTime", type: "time" },
  ],
};

const modalSubmitFn: Record<string, ModalSubmitFn> = {
  추가: (form: modalState) =>
    postCreateSpace({
      name: form.name as string,
      startTime: formatDatetoTime(form.startTime as Date),
      endTime: formatDatetoTime(form.endTime as Date),
    }),
  수정: (form: modalState) =>
    putUpdateSpace({
      spaceId: form.spaceId as string,
      name: form.name as string,
      startTime: formatDatetoTime(form.startTime as Date),
      endTime: formatDatetoTime(form.endTime as Date),
    }),
};

const SpacePage = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalInputs, setModalInputs] = useState<
    { label: string; key: string; type: ModalInputTypesType }[] | null
  >(null);
  const [modalTitle, setModalTitle] = useState<string>("");
  const [tableData, setTableData] = useState<UsageData[] | null>(null);

  const [isDeleteMode, setIsDeleteMode] = useState<boolean>(false);
  const [selectedRowId, setSelectedRowId] = useState<string>('');

  useEffect(() => {
    if (isModalOpen === true) return;
    const getTableData = async () => {
      const res = await getSearchCompanySpace();
      if (res.pass) {
        setTableData(res.data);
      } else {
        toast.error('데이터를 불러오지 못했습니다.');
      }
    };
    getTableData();
  }, [isModalOpen, isDeleteMode]);

  const changeSelectedRow = ({id}:{id:string}) => {
    setSelectedRowId(id);
  }

  const onClickTableButton = ({ value }: { value: string }) => {
    if(value==='삭제'){
      onClickDeleteButton();
      return;
    }
    setIsModalOpen(true);
    setModalTitle(value);
    if (inputOption[value]) {
      setModalInputs(inputOption[value]);
    }
  };

  const onClickDeleteButton = async () => {
    if(!isDeleteMode){
      setIsDeleteMode(true);
    }
    else {
      if(!selectedRowId){
        toast.error('선택된 공간이 없습니다.');
        setIsDeleteMode(false);
        return;
      }
      const res = await deleteSpace({spaceId: selectedRowId});
      if(res.pass){
        toast.success('삭제되었습니다.');
        setIsDeleteMode(false);
      }
      else {
        toast.error('삭제에 실패했습니다.');
      }
    }
  }

  const onClickTableRow = (row:UsageData) => {
    setModalTitle('수정');
    const addInitialInputs = inputOption['수정'].map((item) => {
      return {
        ...item,
        initial: item.key==='spaceId' ? row.id : item.key==='startTime' ? formatTimetoDate(row.start_at as number[]) : item.key==='endTime' ? formatTimetoDate(row.end_at as number[]) : row[item.key],
      }
    })
    setModalInputs(addInitialInputs);
    setIsModalOpen(true);
  }

  const onCloseModal = () => {
    setIsModalOpen(false);
    setModalTitle("");
    setModalInputs(null);
  };

  return (
    <div className="w-full">
      <MainHeader />
      <BannerButton />
      <div className="flex-1 max-w-360 justify-self-center mr-[50px] ml-[50px] text-nowrap">
        <div className="mr-[20px] ml-[20px] mb-[30px] flex justify-between">
          <div className="flex items-center">
            <h1 className="text-xl font-bold">공간 관리</h1>
          </div>
          <div className="flex gap-[10px]">
            <TableButton value="추가" onClick={() => onClickTableButton({ value: "추가" })} />
            <TableButton value="삭제" onClick={() => onClickTableButton({ value: "삭제" })} isDeleteMode={isDeleteMode}/>
          </div>
        </div>
        <CustomTable header={tableHeader} data={tableData} rowUpdate={onClickTableRow}isDeleteMode={isDeleteMode} changeSelectedRow={changeSelectedRow} selectedRowId={selectedRowId}/>
      </div>
      {isModalOpen && (
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

export default SpacePage;
