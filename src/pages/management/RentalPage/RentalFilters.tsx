import { memo } from "react";
import CustomSelect from "@/components/CustomSelect";

interface FilterSelectConfig {
  id: string;
  type: "select";
  options: string[];
}

interface RentalFiltersProps {
  // 선택된 값
  selectForm: {
    order: string;
  };
  // 선택 값 바뀌었을 때
  onFilterChange: (key: string, value: string | Date | null) => void;
  onResetFilter: () => void;
}

const FILTER_SELECTS: FilterSelectConfig[] = [
  { id: "order", type: "select", options: ["처리 여부", "미확인", "반납됨", "이용중"] },
];

const RentalFilters = memo<RentalFiltersProps>(({ selectForm, onFilterChange }) => {
  return (
    <>
      {FILTER_SELECTS.map((item) => (
        <CustomSelect
          type={item.type}
          key={item.id}
          options={item.options}
          value={selectForm[item.id as keyof typeof selectForm]}
          onChange={(value) => onFilterChange(item.id, value as string | Date | null)}
        />
      ))}
    </>
  );
});

RentalFilters.displayName = "RentalFilters";

export default RentalFilters;
