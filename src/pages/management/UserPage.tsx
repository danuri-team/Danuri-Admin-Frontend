import CustomTable, { type UsageData } from "../../components/CustomTable";
import MainHeader from "../../components/MainHeader";
import CustomSelect from "../../components/CustomSelect";
import BannerButton from "../../components/BannerButton";
import TableButton from "../../components/TableButton";
import type { ModalInputTypesType } from "../../components/modal/ModalInput";
import { useEffect, useReducer, useState } from "react";
import Modal from "../../components/modal/Modal";
import { deleteUser, getSearchCompanyUser, postCreateUser, putUpdateUser } from "../../api/UserAPI";
import type { ModalSubmitFn, modalState } from "./ItemPage";
import { formatDatetoISOString } from "../../utils/format/dateFormat";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getJoinForm } from "../../api/FormAPI";

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

//type = 'select' || 'date'
const filterSelects: filterSelectType[] = [
  { id: "joinDate", type: "date", options: ["가입일"] },
  { id: "age", type: "select", options: ["나이대", "중학생", "고등학생"] },
  { id: "sex", type: "select", options: ["성별", "남", "여"] },
];

const inputOption: Record<
  string,
  {
    label: string;
    key: string;
    type: ModalInputTypesType;
    initial?: string | number | Date;
    hide?: boolean;
  }[]
> = {
  추가: [
    { label: "이름", key: "name", type: "text" },
    { label: "전화번호", key: "phone", type: "text" },
    { label: "성별", key: "sex", type: "option" },
  ],
  수정: [
    { label: "사용자 ID", key: "id", type: "text", hide: true },
    { label: "이름", key: "name", type: "text" },
    { label: "전화번호", key: "phone", type: "text" },
    { label: "성별", key: "sex", type: "option" },
  ],
  검색: [
    { label: "이름", key: "name", type: "text" },
    { label: "전화번호", key: "phone", type: "text" },
    { label: "성별", key: "sex", type: "option" },
  ],
};

const selectReducer = (state: SelectState, action: SelectAction) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        [action.payload.key]: action.payload.value,
      };
    case "RESET":
      return initialSelectForm;
  }
};

//company id는 임의 값
const modalSubmitFn: Record<string, ModalSubmitFn> = {
  추가: (form: modalState) =>
    postCreateUser({
      company_id: form.company_id as string,
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

const UserPage = () => {
  const navigate = useNavigate();

  const [userTableHeader, setUserTableHeader] = useState<{ name: string; id: string }[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalInputs, setModalInputs] = useState<
    { label: string; key: string; type: ModalInputTypesType }[] | null
  >(null);
  const [modalTitle, setModalTitle] = useState<string>("");
  const [tableData, setTableData] = useState<UsageData[] | null>(null);
  const [filterData, setFilterData] = useState<UsageData[] | null>(null);

  const [isDeleteMode, setIsDeleteMode] = useState<boolean>(false);
  const [selectedRowId, setSelectedRowId] = useState<string>("");

  const [selectForm, selectDispatch] = useReducer(selectReducer, initialSelectForm);
  const [isJoinForm, setIsJoinForm] = useState<boolean>(false);

  useEffect(() => {
    if (isModalOpen === true || modalTitle === "검색") return;
    setModalTitle("");
    const getTableData = async () => {
      const res = await getSearchCompanyUser();
      if (res.pass) {
        const users = res.data.user_list.map(
          (user: {
            id: string;
            phone: string;
            sign_up_form_schema: string;
            created_at: string;
            updated_at: string;
            usage_count: number;
          }) => {
            let str = user.sign_up_form_schema;
            const arr = str.slice(1, str.length - 1).split(",");
            const schema = Object.fromEntries(
              arr.map((str) => {
                const [key, value] = str.split(":");
                return [key.trim(), value.trimStart()];
              })
            );
            return {
              ...user,
              ...schema,
            };
          }
        );
        setTableData(users);
        const headers = res.data.header_list.map((header: string) => ({
          name: header,
          id: header,
        }));
        setUserTableHeader([{ name: "ID", id: "id" }, ...headers]);
      }
    };

    getTableData();
  }, [isModalOpen, isDeleteMode, modalTitle]);

  useEffect(() => {
    if (!tableData) return;
    const filterTableData = tableData.filter((item) => {
      const matchJoinDate =
        !selectForm.joinDate ||
        (item.created_at as string).substring(0, 10) ===
          formatDatetoISOString(selectForm.joinDate as Date).substring(0, 10);
      const matchAge =
        selectForm.age === "나이대" ||
        (selectForm.age === "고등학생" && item.age === "HIGH") ||
        (selectForm.age === "중학생" && item.age === "MIDDLE");
      const matchSex =
        selectForm.sex === "성별" ||
        (selectForm.sex === "남" && item.sex === "MALE") ||
        (selectForm.sex === "여" && item.sex === "FEMALE");

      return matchJoinDate && matchAge && matchSex;
    });
    setFilterData(filterTableData);
  }, [selectForm, tableData]);

  useEffect(() => {
    const getData = async () => {
      const res = await getJoinForm();
      if (res.pass) {
        if (res.data.schema === "") {
          setIsJoinForm(false);
        } else {
          setIsJoinForm(true);
        }
      }
    };
    getData();
  }, []);

  const changeSelectedRow = ({ id }: { id: string }) => {
    setSelectedRowId(id);
  };

  const searchTableData = (form: modalState) => {
    if (!tableData) return;
    const searchData = tableData.filter((item) => {
      const searchName = !form.name || form.name === item.name;
      const searchPhone = !form.phone || form.phone === item.phone;
      const searchSex = !form.sex || form.sex === item.sex;
      const searchAge = !form.age || form.age === item.age;

      return searchName && searchPhone && searchSex && searchAge;
    });
    setFilterData(searchData);
  };

  const onClickTableButton = ({ value }: { value: string }) => {
    if (value === "삭제") {
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
    if (!isDeleteMode) {
      setIsDeleteMode(true);
    } else {
      if (!selectedRowId) {
        toast.error("선택된 사용자가 없습니다.");
        setIsDeleteMode(false);
        return;
      }
      const res = await deleteUser({ userId: selectedRowId });
      if (res.pass) {
        toast.success("삭제되었습니다.");
        setIsDeleteMode(false);
      } else {
        toast.error("삭제에 실패했습니다.");
      }
    }
  };

  const onClickTableRow = (row: UsageData) => {
    setModalTitle("수정");
    const addInitialInputs = inputOption["수정"].map((item) => {
      return {
        ...item,
        initial: item.key === "itemId" ? row.id : row[item.key],
      };
    });
    setModalInputs(addInitialInputs);
    setIsModalOpen(true);
  };

  const onCloseModal = () => {
    setIsModalOpen(false);
    setModalInputs(null);
  };

  return (
    <div className="w-full">
      <MainHeader />
      <BannerButton />
      <div className="flex-1 max-w-360 justify-self-center mr-[50px] ml-[50px] text-nowrap">
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
            <TableButton value="검색" onClick={() => onClickTableButton({ value: "검색" })} />
            <TableButton
              value="삭제"
              onClick={() => onClickTableButton({ value: "삭제" })}
              isDeleteMode={isDeleteMode}
            />
            {isJoinForm || (
              <TableButton value="가입 폼 관리" onClick={() => navigate("/joinForm")} />
            )}
          </div>
        </div>
        <CustomTable
          header={userTableHeader}
          data={filterData}
          rowUpdate={onClickTableRow}
          isDeleteMode={isDeleteMode}
          changeSelectedRow={changeSelectedRow}
          selectedRowId={selectedRowId}
        />
      </div>
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          title={modalTitle}
          inputs={modalInputs}
          onClose={onCloseModal}
          onSubmit={
            modalTitle !== "검색"
              ? modalSubmitFn[modalTitle]
              : (form: modalState) => searchTableData(form)
          }
        />
      )}
    </div>
  );
};

export default UserPage;
