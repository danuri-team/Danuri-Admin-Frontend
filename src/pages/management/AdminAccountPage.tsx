import { useState, useEffect } from "react";
import BannerButton from "../../components/BannerButton";
import CustomTable, { type UsageData } from "../../components/CustomTable";
import MainHeader from "../../components/MainHeader";
import TableButton from "../../components/TableButton";
import Modal from "../../components/modal/Modal";
import type { ModalInputTypesType } from "../../components/modal/ModalInput";
import {  putUpdateDevice } from "../../api/DeviceAPI";
import { toast } from "react-toastify";
import { getAllAdminInfo, deleteAdmin } from "../../api/AdminAPI";

//수정 필요: 관리자 계정 관리 API로 변경해야함

export type modalState = Record<string, Date | string | number | null>;

export type ModalSubmitFn = (form: modalState) => Promise<{ data: unknown; pass: boolean }>;

const tableHeader = [
  { name: "ID", id: "id" },
  { name: "추가일", id: "created_at" },
];

const inputOption: Record<string, { label: string; key: string; type: ModalInputTypesType, initial?: string | number | Date, hide?: boolean, disable?:boolean }[]> = {
  저장: [
    { label: "ID", key: "id" , type:'text', disable:true, hide:true},
    { label: "관리 권한 허가 여부", key: "status", type:'option' },
  ],
};

//모달 Submit 함수
const modalSubmitFn: Record<string, ModalSubmitFn> = {
  저장: (form: modalState) => 
    putUpdateDevice({
      deviceId: form.deviceId as string,
      spaceId: form.spaceId as string,
      isActivate: form.isActivate==='true' ? true : false
    }),
};

const AdminAccountPage = () => {
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
      const res = await getAllAdminInfo();
      if (res.pass) {
        setTableData(res.data);
        console.log(res.data)
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
    setModalTitle(value);
    if (inputOption[value]) {
      setModalInputs(inputOption[value]);
    }
    setIsModalOpen(true);
  };

  const onClickDeleteButton = async () => {
    if(!isDeleteMode){
        setIsDeleteMode(true);
      }
      else {
        if(!selectedRowId){
          toast.error('선택된 계정이 없습니다.');
          setIsDeleteMode(false);
          return;
        }

        //api 수정 필요
        const res = await deleteAdmin({adminId: selectedRowId});
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
    setModalTitle('저장');
    const addInitialInputs = inputOption['저장'].map((item) => {
      return {
        ...item,
        initial: item.key==='id' ? row.id : row[item.key]
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
    return(
      <div className="w-full">
        <MainHeader />
        <BannerButton />
        <div className="flex-1 mr-[50px] ml-[50px] text-nowrap">
            <div className="mr-[20px] ml-[20px] mb-[30px] flex justify-between">
            <div className="flex items-center">
                <h1 className="text-xl font-bold">관리자 계정 관리</h1>
            </div>
            <div className="flex gap-[10px]">
                <TableButton value="삭제" onClick={() => onClickTableButton({ value: "삭제" })} isDeleteMode={isDeleteMode} />
            </div>
            </div>
            <CustomTable header={tableHeader} data={tableData} rowUpdate={onClickTableRow} isDeleteMode={isDeleteMode} changeSelectedRow={changeSelectedRow} selectedRowId={selectedRowId}/>
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
    )
}

export default AdminAccountPage;