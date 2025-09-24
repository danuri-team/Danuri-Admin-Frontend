import { useState, useEffect } from "react";
import BannerButton from "../../components/BannerButton";
import CustomTable, { type UsageData } from "../../components/CustomTable";
import MainHeader from "../../components/MainHeader";
import TableButton from "../../components/TableButton";
import Modal from "../../components/modal/Modal";
import type { ModalInputTypesType } from "../../components/modal/ModalInput";
import { getSearchCompanyDevice, postAddDevice, putUpdateDevice, deleteDevice } from "../../api/DeviceAPI";
import { toast } from "react-toastify";

export type modalState = Record<string, Date | string | number | null>;

export type ModalSubmitFn = (form: modalState) => Promise<{ data: unknown; pass: boolean }> | void;

const tableHeader = [
  { name: "ID", id: "id" },
  { name: "추가일", id: "created_at" },
  { name: "행동", id: "connect" },
];

const inputOption: Record<string, { label: string; key: string; type: ModalInputTypesType, initial?: string | number | Date, hide?: boolean, disable?:boolean }[]> = {
  추가: [
    { label: "별칭", key: "name", type:'text' },
  ],
  수정: [
    { label: "ID", key: "id" , type:'text', disable:true},
    { label: "별칭", key: "alias", type:'text' },
  ],
  기기연결: [
    { label: "", key: "QRCode" , type:'image', disable:true},
  ],

};

//모달 Submit 함수
const modalSubmitFn: Record<string, ModalSubmitFn> = {
  추가: (form: modalState) =>
    postAddDevice({
      deviceName: form.deviceName as string,
    }),
  수정: (form: modalState) => 
    putUpdateDevice({
      deviceId: form.deviceId as string,
      spaceId: form.spaceId as string,
      isActivate: form.isActivate==='true' ? true : false
    }),
  기기연결: () => 
    {},
};

const MachinePage = () => {
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
      const res = await getSearchCompanyDevice();
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
        toast.error('선택된 기기가 없습니다.');
        setIsDeleteMode(false);
        return;
      }
      const res = await deleteDevice({deviceId: selectedRowId});
      if(res.pass){
        toast.success('삭제되었습니다.');
        setIsDeleteMode(false);
      }
      else {
        toast.error('삭제에 실패했습니다.');
      }
    }
  }

  const onClickTableRow = (row:UsageData, title:string) => {
    setModalTitle(title);
    const addInitialInputs = inputOption[title].map((item) => {
      if(title==='기기연결' && item.key ==='QRCode'){
        return {
          ...item,
          initial: row.id
        }
      }
      return {
        ...item,
        initial: item.key==='itemId' ? row.id : row[item.key]
      }
    })
    console.log(inputOption)
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
        <div className="flex-1 max-w-360 justify-self-center mr-[50px] ml-[50px] text-nowrap">
            <div className="mr-[20px] ml-[20px] mb-[30px] flex justify-between">
            <div className="flex items-center">
                <h1 className="text-xl font-bold">기기 관리</h1>
            </div>
            <div className="flex gap-[10px]">
                <TableButton value="추가" onClick={() => onClickTableButton({ value: "추가" })} />
                <TableButton value="삭제" onClick={() => onClickTableButton({ value: "삭제" })} isDeleteMode={isDeleteMode} />
            </div>
            </div>
            <CustomTable header={tableHeader} data={tableData} rowUpdate={(row:UsageData, title: string | undefined)=>onClickTableRow(row, title || '기기연결')} isDeleteMode={isDeleteMode} changeSelectedRow={changeSelectedRow} selectedRowId={selectedRowId}/>
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

export default MachinePage;