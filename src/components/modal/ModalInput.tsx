import { memo, type ReactNode } from "react";

import DateTimeInput from "./inputs/DateTimeInput";
import SearchInput from "./inputs/SearchInput";
import OptionInput from "./inputs/OptionInput";
import DefaultInput from "./inputs/DefaultInput";
import QRInput from "./inputs/QRInput";

interface LabelProps {
  children: ReactNode;
}

interface TermListProps {
  children: ReactNode;
}

interface TermItemProps {
  id: string;
  value: string;
  onClick: () => void;
}

interface BaseProps {
  label: string;
  resetValue?: () => void;
  availableCount?: number;
  disabled?: boolean;
}

export interface DateTimeInputProps extends BaseProps {
  type: "date" | "time";
  value: Date | null;
  onChange: (date: Date | null) => void;
}

export interface GenericInputProps extends BaseProps {
  type: "search" | "text" | "number" | "option" | "image";
  value: string | number;
  onChange: (value: string | number) => void;
}

type ModalInputType = DateTimeInputProps | GenericInputProps;

const ModalInput = (props: ModalInputType) => {
  const INPUT_COMPONENT_MAP = {
    date: <DateTimeInput {...(props as DateTimeInputProps)} />,
    time: <DateTimeInput {...(props as DateTimeInputProps)} />,
    search: <SearchInput {...(props as GenericInputProps)} />,
    option: <OptionInput {...(props as GenericInputProps)} />,
    text: <DefaultInput {...(props as GenericInputProps)} />,
    number: <DefaultInput {...(props as GenericInputProps)} />,
    image: <QRInput {...(props as GenericInputProps)} />,
  };

  return <div className="text-sm mb-[15px]">{INPUT_COMPONENT_MAP[props.type]}</div>;
};

const Label = memo<LabelProps>(({ children }) => {
  return <p className="mb-[5px]">{children}</p>;
});

Label.displayName = "ModalInputLayout.Label";

const TermList = memo<TermListProps>(({ children }) => {
  return (
    <ul className="absolute w-full border-1 border-gray-200 max-h-70 overflow-scroll rounded-xl p-[8px] bg-white mt-[10px] z-1">
      {children}
    </ul>
  );
});

TermList.displayName = "ModalInputLayout.TermList";

const TermItem = memo<TermItemProps>(({ id, value, onClick }) => {
  return (
    <li
      className={`cursor-pointer hover:bg-gray-100 p-[12px] rounded-sm`}
      onMouseDown={onClick}
      key={id}
    >
      {value}
    </li>
  );
});

TermItem.displayName = "ModalInputLayout.TermItem";

const ModalInputLayout = Object.assign(memo(ModalInput), {
  Label,
  TermList,
  TermItem,
});

export default ModalInputLayout;
