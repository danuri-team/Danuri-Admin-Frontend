import CustomTable, { type UsageData } from "../components/CustomTable";
import MainHeader from "../components/MainHeader";
import CustomSelect from "../components/CustomSelect";
import BannerButton from "../components/BannerButton";
import TableButton from "../components/TableButton";
import type { ModalInputTypesType } from "../components/ModalInput";
import { useEffect, useReducer, useState } from "react";
import Modal from "../components/Modal";
import { getSearchCompanyUser, postCreateUser, putUpdateUser } from "../api/UserAPI";
import type { ModalSubmitFn, modalState } from "./ItemManagementPage";

type filterSelectType = {
  id: keyof SelectState;
  type: "select" | "date";
  options: string[];
};

type SelectState = {
  joinDate: Date | null;
  age: string;
  sex: string;
};

type SelectAction =
  | { type: "CHANGE"; payload: { key: string; value: string | Date | null } }
  | { type: "RESET" };

const initialSelectForm: SelectState = {
  joinDate: null,
  age: "나이대",
  sex: "성별",
};

const tableHeader = [
  { name: "이름", id: "name" },
  { name: "전화번호", id: "phone" },
  { name: "성별", id: "sex" },
  { name: "나이", id: "age" },
  { name: "가입일", id: "created_at" },
];

//type = 'select' || 'date'
const filterSelects: filterSelectType[] = [
  { id: "joinDate", type: "date", options: ["가입일"] },
  { id: "age", type: "select", options: ["나이대", "중학생", "고등학생"] },
  { id: "sex", type: "select", options: ["성별", "남", "여"] },
];

const inputOption: Record<string, { label: string; key: string; type: ModalInputTypesType, initial?: string | number | Date, hide?: boolean }[]> = {
  추가: [
    { label: "이름", key: "name", type: "text" },
    { label: "전화번호", key: "phone", type: "text" },
    { label: "성별", key: "sex", type: "text" },
    { label: "나이", key: "age", type: "text" },
  ],
  수정: [
    { label: "사용자 ID", key: "id", type: "text", hide:true },
    { label: "이름", key: "name", type: "text" },
    { label: "전화번호", key: "phone", type: "text" },
    { label: "성별", key: "sex", type: "text" },
    { label: "나이", key: "age", type: "text" },
  ],
};

const selectReducer = (state: SelectState, action: SelectAction) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        [action.payload.key]: [action.payload.value],
      };
    case "RESET":
      return initialSelectForm;
  }
};

//company id는 임의 값
const modalSubmitFn: Record<string, ModalSubmitFn> = {
  추가: (form: modalState) =>
    postCreateUser({
      company_id: "52515fd2-43e5-440b-9cc5-8630bc75954e",
      name: form.name as string,
      sex: form.sex as string,
      age: form.age as string,
      phone: form.phone as string,
    }),
  수정: (form: modalState) =>
    putUpdateUser({
      userId: form.id as string,
      name: form.name as string,
      sex: form.sex as string,
      age: form.age as string,
      phone: form.phone as string,
    }),
};

const UserManagementPage = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalInputs, setModalInputs] = useState<
    { label: string; key: string; type: ModalInputTypesType }[] | null
  >(null);
  const [modalTitle, setModalTitle] = useState<string>("");
  const [tableData, setTableData] = useState<UsageData[] | null>(null);

  const [selectForm, selectDispatch] = useReducer(selectReducer, initialSelectForm);

  const onClickTableButton = ({ value }: { value: string }) => {
    setIsModalOpen(true);
    setModalTitle(value);
    if (inputOption[value]) {
      setModalInputs(inputOption[value]);
    }
  };

  const onClickTableRow = (row:UsageData) => {
    setModalTitle('수정');
    const addInitialInputs = inputOption['수정'].map((item) => {
      return {
        ...item,
        initial: item.key==='itemId' ? row.id : row[item.key]
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

  useEffect(() => {
    if (isModalOpen === true) return;
    const getTableData = async () => {
      const res = await getSearchCompanyUser();
      if (res.pass) {
        setTableData(res.data);
      } else {
        console.log("데이터 불러오기 실패");
      }
    };

    getTableData();
  }, [isModalOpen]);

  return (
    <div className="w-full">
      <MainHeader />
      <BannerButton />
      <div className="flex-1 mr-[50px] ml-[50px] text-nowrap">
        <div className="mr-[20px] ml-[20px] mb-[30px] flex justify-between">
          <div className="flex items-center">
            <h1 className="text-xl font-bold">사용자 관리</h1>
            {filterSelects.map((item) => (
              <CustomSelect
                type={item.type}
                key={item.id}
                options={item.options}
                value={selectForm[item.id]}
                onChange={(value) =>
                  selectDispatch({
                    type: "CHANGE",
                    payload: { key: item.id, value: value as string | Date | null },
                  })
                }
              />
            ))}
          </div>
          <div className="flex gap-[10px]">
            <TableButton value="추가" onClick={() => onClickTableButton({ value: "추가" })} />
            <TableButton value="검색" />
            <TableButton value="삭제" />
          </div>
        </div>
        <CustomTable header={tableHeader} data={tableData} rowUpdate={onClickTableRow} />
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

export default UserManagementPage;
