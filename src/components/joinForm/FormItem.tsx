import {
  useSortable,
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import DeleteIcon from "../../assets/icons/delete-icon.svg?react";
import GripIcon from "../../assets/icons/grip-icon.svg?react";
import PasteIcon from "../../assets/icons/paste-icon.svg?react";
import PlusIcon from "../../assets/icons/plus-icon.svg?react";
import FieldOptions from "./FieldOptions";
import ToggleButton from "./ToggleButton";
import { useEffect, useRef, useState } from "react";
import {
  KeyboardSensor,
  MouseSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  DndContext,
  closestCenter,
} from "@dnd-kit/core";
import MultipleChoiceItem from "./MultipleChoiceItem";
import CustomInput from "../CustomInput";
import type { FormItemType } from "../../pages/management/JoinFormPage";

type FormItemProps = FormItemType & {
  index: number;
  deleteFormItem: (id: number) => void;
  addFormItem: (id: number) => void;
  changeFormItem: (
    id: number,
    key: keyof FormItemType,
    value: string | { id: number; option: string }[] | boolean
  ) => void;
};

const FormItem = ({
  id,
  index,
  deleteFormItem,
  addFormItem,
  changeFormItem,
  label,
  options,
  placeHolder,
  isMultiSelect,
  isRequired,
  type,
}: FormItemProps) => {
  const { attributes, setNodeRef, listeners, transform, transition } = useSortable({ id });
  //옵션 선택에 대한 데이터 전달 논의 필요

  //label 길이 측정용 Ref
  const spanRef = useRef<HTMLSpanElement>(null);
  const [inputWidth, setInputWidth] = useState<number>(0);

  useEffect(() => {
    if (spanRef.current) {
      const spanWidth = spanRef.current.offsetWidth;
      setInputWidth(spanWidth);
    }
  }, [label]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!options) return;
    if (over && active.id !== over.id) {
      const preIndex = options?.findIndex((item) => item.id === Number(active.id));
      const newIndex = options?.findIndex((item) => item.id === Number(over.id));

      const changeOptions = arrayMove(options, preIndex, newIndex);

      changeFormItem(id, "options", changeOptions);
    }
  };

  //객관식 문항 추가
  const addQuestion = () => {
    const newItemId = Math.max(...options.map((item) => item.id)) + 1;
    changeFormItem(id, "options", [...options, { id: newItemId, option: "" }]);
  };

  //객관식 문항 삭제
  const deleteQuestion = (id: number) => {
    const newQuestion = options.filter((item) => item.id !== id);
    changeFormItem(id, "options", newQuestion);
  };

  //객관식 문항 내용 수정
  const changeQuestion = (id: number, value: string) => {
    const changeQuestion = options.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          option: value,
        };
      }
      return { ...item };
    });
    changeFormItem(id, "options", changeQuestion);
  };

  const handleOption = (option: "INPUT" | "CHECK" | "PHONE") => {
    changeFormItem(id, "type", option);
  };

  const handleToggle = (type: string, state: boolean) => {
    if (type === "essential") {
      changeFormItem(id, "isRequired", state);
      return;
    }
    changeFormItem(id, "isMultiSelect", state);
  };

  return (
    <div
      className="flex flex-col border-1 border-gray-200 mb-[30px] rounded-xl p-[25px] bg-white"
      ref={setNodeRef}
      style={style}
      {...attributes}
    >
      <button
        className="text-gray-400 cursor-pointer hover:bg-gray-100 p-[5px] rounded-sm self-center"
        {...listeners}
        aria-label="drag handle"
      >
        <GripIcon />
      </button>
      <FieldOptions handleOption={handleOption} selectOption={type} />
      <div className="flex text-[22px] font-semibold mt-[24px] mb-[24px] border-b border-gray-100">
        <p className="mr-[12px]">{index + 1}.</p>
        <input
          className={`focus:outline-none max-w-full`}
          style={{ width: `${inputWidth > 0 ? inputWidth + 5 + "px" : "100%"}` }}
          type="text"
          value={label}
          onChange={(e) => changeFormItem(id, "label", e.target.value)}
        />
        <span className="bg-gray-300 absolute" ref={spanRef} style={{ visibility: "hidden" }}>
          {label}
        </span>
        {isRequired && <span className="text-red-500">*</span>}
      </div>
      <div>
        {type === "CHECK" ? (
          <div className="flex flex-col w-full">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={options} strategy={verticalListSortingStrategy}>
                {options.map((item) => (
                  <MultipleChoiceItem
                    key={item.id}
                    id={item.id}
                    deleteQuestion={deleteQuestion}
                    changeOption={(e) => changeQuestion(item.id, e.target.value)}
                    option={item.option}
                  />
                ))}
              </SortableContext>
            </DndContext>
            <button
              className="self-center text-gray-500 cursor-pointer hover:bg-gray-100 p-[5px] rounded-sm"
              onClick={() => addQuestion()}
            >
              <PlusIcon />
            </button>
          </div>
        ) : (
          <div>
            <CustomInput
              label="placeholder"
              type="text"
              value={placeHolder || ""}
              onChange={(e) => {
                changeFormItem(id, "placeHolder", e.target.value);
              }}
            />
            <p className="text-[12px] text-gray-500 mt-[8px]">
              사용자 입력창에 표시될 예시 문구를 입력하세요.
            </p>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between mt-[60px]">
        <div className="flex items-center">
          <div className="flex items-center gap-[16px]">
            <p className="text-[15px]">필수 입력</p>
            <ToggleButton handleToggle={handleToggle} isActive={isRequired} type={"essential"} />
          </div>
          {type === "CHECK" && (
            <div className="flex items-center gap-[16px] ml-[24px]">
              <p className="text-[15px]">복수 선택</p>
              <ToggleButton
                handleToggle={handleToggle}
                isActive={isMultiSelect}
                type={"multiple"}
              />
            </div>
          )}
        </div>
        <div className="flex gap-[50px]">
          <button
            className="text-gray-500 cursor-pointer hover:bg-gray-100 p-[5px] rounded-sm"
            onClick={() => addFormItem(id)}
          >
            <PasteIcon />
          </button>
          <button
            className="text-gray-500 cursor-pointer hover:bg-gray-100 p-[5px] rounded-sm"
            onClick={() => deleteFormItem(id)}
          >
            <DeleteIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormItem;
