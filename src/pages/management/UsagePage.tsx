import CustomTable, { type UsageData } from "../../components/CustomTable";
import MainHeader from "../../components/MainHeader";
import BannerButton from "../../components/BannerButton";
import CustomSelect from "../../components/CustomSelect";
import TableButton from "../../components/TableButton";
import type { ModalInputTypesType } from "../../components/modal/ModalInput";
import { useEffect, useMemo, useReducer, useState } from "react";
import Modal from "../../components/modal/Modal";
import { postCreateUsage, postUsageExcel, postUsageSearch, putForcedToLeave } from "../../api/UsageAPI";
import { formatDatetoISOString } from "../../utils/format/dateFormat";
import type { ModalSubmitFn, modalState } from "./ItemPage";
import { useNavigate } from "react-router-dom";
import { isAfter, isBefore } from "date-fns";
import { toast } from "react-toastify";

type filterSelectType = {
  id: keyof SelectState;
  type: "select" | "date" | "rangeDate";
  options: string[];
};

type SelectState = {
  order: string;
  useDate: { startDate: Date | null; endDate: Date | null };
  age: string;
  sex: string;
};

type UsageState = {
  startDate: string;
  endDate: string;
  spaceId: string | null;
  userId: string | null;
};

type SelectAction =
  | { type: "CHANGE"; payload: { key: string; value: string } }
  | { type: "CHANGE_RANGE"; payload: { key: string; value: SelectState["useDate"] } }
  | { type: "RESET" };

type UsageAction = { type: "CHANGE"; payload: { key: string; value: string } } | { type: "RESET" };

const initialSelectForm: SelectState = {
  order: "이용일순",
  useDate: {
    startDate: null,
    endDate: null,
  },
  age: "나이대",
  sex: "성별",
};

const initialUsageForm: UsageState = {
  startDate: "2025-03-01T00:00:00",
  endDate: "",
  spaceId: null,
  userId: null,
};

const tableHeader = [
  { name: "사용 ID", id: "id" },
  { name: "공간", id: "space_name" },
  { name: "시작일", id: "start_at" },
  { name: "종료일", id: "end_at" },
  { name: "유저", id: "user_id" },
  { name: "상태", id: "status" },
];

//type = 'select' || 'date'
const filterSelects: filterSelectType[] = [
  { id: "order", type: "select", options: ["이용일순", "상태순"] },
  { id: "useDate", type: "rangeDate", options: ["이용일"] },
];

const inputOption: Record<string, { label: string; key: string; type: ModalInputTypesType }[]> = {
  추가: [
    { label: "공간", key: "spaceId", type: "search" },
    { label: "시작일", key: "startDate", type: "date" },
    { label: "종료일", key: "endDate", type: "date" },
    { label: "유저", key: "userId", type: "search" },
  ],
  다운로드: [
    { label: "공간", key: "spaceId", type: "search" },
    { label: "시작일", key: "startDate", type: "date" },
    { label: "종료일", key: "endDate", type: "date" },
    { label: "유저", key: "userId", type: "search" },
  ],
};

const selectReducer = (state: SelectState, action: SelectAction) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        [action.payload.key]: action.payload.value,
      };
    case "CHANGE_RANGE":
      return {
        ...state,
        useDate: {
          startDate: action.payload.value.startDate,
          endDate: action.payload.value.endDate,
        },
      };
    case "RESET":
      return initialSelectForm;
  }
};

const usageReducer = (state: UsageState, action: UsageAction) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        [action.payload.key]: action.payload.value,
      };
    case "RESET":
      return initialUsageForm;
  }
};

const modalSubmitFn: Record<string, ModalSubmitFn> = {
  추가: (form: modalState) =>
    postCreateUsage({
      userId: form.userId as string,
      spaceId: form.spaceId as string,
      startDate: formatDatetoISOString(form.startDate as Date),
      endDate: formatDatetoISOString(form.endDate as Date),
    }),
  다운로드: (form: modalState) =>
    postUsageExcel({
      userId: form.userId as string,
      spaceId: form.spaceId as string,
      startDate: formatDatetoISOString(form.startDate as Date),
      endDate: formatDatetoISOString(form.endDate as Date),
    }),
};

const UsagePage = () => {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalInputs, setModalInputs] = useState<
    { label: string; key: string; type: ModalInputTypesType }[] | null
  >(null);
  const [modalTitle, setModalTitle] = useState<string>("");
  const [tableData, setTableData] = useState<UsageData[] | null>(null);

  const [isDeleteMode, setIsDeleteMode] = useState<boolean>(false);
  const [selectedRowId, setSelectedRowId] = useState<string>('');

  const [selectForm, selectDispatch] = useReducer(selectReducer, initialSelectForm);
  const [usageForm, usageDispatch] = useReducer(usageReducer, initialUsageForm);

  const sortTableData = useMemo(()=>{
    if(!tableData)return null
    return [...tableData].sort((a,b) => {
    if(selectForm.order==='이용일순'){
      if(isBefore(new Date(a.start_at as string), new Date(b.start_at as string)))return -1;
      else return 1;
    }
    else {
      const aStatus = isBefore(new Date(a.start_at as string), new Date()) && isAfter(new Date(a.end_at as string), new Date());
      const bStatus = isBefore(new Date(b.start_at as string), new Date()) && isAfter(new Date(b.end_at as string), new Date());
      if(aStatus&&!bStatus)return -1;
      else if(!aStatus&&bStatus)return 1;
      else return 0;
    }
  })},[tableData, selectForm.order])

  useEffect(() => {
    if (selectForm.useDate) {
      if (selectForm.useDate.startDate) {
        const formatStartDate = formatDatetoISOString(selectForm.useDate.startDate as Date);
        usageDispatch({ type: "CHANGE", payload: { key: "startDate", value: formatStartDate } });
      }
      if (selectForm.useDate.endDate) {
        const formatEndDate = formatDatetoISOString(selectForm.useDate.endDate as Date);
        usageDispatch({ type: "CHANGE", payload: { key: "endDate", value: formatEndDate } });
      }
    }
  }, [selectForm.useDate]);

  //테이블 값
  useEffect(() => {
    if (isModalOpen === true) return;
    const getTableData = async () => {
      const res = await postUsageSearch(usageForm);
      if (res.pass) {
        setTableData(res.data);
      } else {
        toast.error('데이터를 불러오지 못했습니다.');
      }
    };
    getTableData();
  }, [usageForm, isModalOpen, isDeleteMode]);

  const changeSelectedRow = ({id}:{id:string}) => {
    setSelectedRowId(id);
  }

  const onClickTableButton = ({ value }: { value: string }) => {
    if(value==='강제퇴실'){
      onClickDeleteButton();
      return;
    }
    setModalTitle(value);
    if (inputOption[value]) {
      setModalInputs(inputOption[value]);
    }
    setIsModalOpen(true);
  };

  const onCloseModal = () => {
    setIsModalOpen(false);
    setModalTitle("");
    setModalInputs(null);
  };

  const onClickDeleteButton = async () => {
    if(!isDeleteMode){
      setIsDeleteMode(true);
    }
    else {
      if(!selectedRowId){
        toast.error('선택된 사용자가 없습니다.');
        setIsDeleteMode(false);
        return;
      }
      const currentTime = formatDatetoISOString(new Date());
      const res = await putForcedToLeave({usageId: selectedRowId, end_at:currentTime});
      if(res.pass){
        toast.success('강제퇴실되었습니다.');
        setIsDeleteMode(false);
      }
      else{
        toast.error('강제퇴실에 실패했습니다.')
      }
    }
  }

  return (
    <div className="w-full">
      <MainHeader />
      <BannerButton />
      <div className="flex-1 mr-[50px] ml-[50px] text-nowrap">
        <div className="mr-[20px] ml-[20px] mb-[30px] flex justify-between">
          <div className="flex items-center">
            <h1 className="text-xl font-bold">이용 현황</h1>
            {filterSelects.map((item) => {
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
              onClick={() => onClickTableButton({ value: "다운로드" })}
            />
            <TableButton value="대여관리" onClick={()=>navigate('/rental') }/>
            <TableButton value="추가" onClick={() => onClickTableButton({ value: "추가" })} />
            <TableButton value="강제퇴실" onClick={() => onClickTableButton({ value: "강제퇴실" })} isDeleteMode={isDeleteMode} />
          </div>
        </div>
        <CustomTable header={tableHeader} data={sortTableData} changeSelectedRow={changeSelectedRow} isDeleteMode={isDeleteMode} selectedRowId={selectedRowId} />
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

export default UsagePage;
