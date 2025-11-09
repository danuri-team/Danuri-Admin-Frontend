import { memo } from "react";
import CustomSelect from "@/components/CustomSelect";

interface FilterSelectConfig {
  id: string;
  type: "select" | "date" | "rangeDate";
  options: string[];
}

interface UsageFiltersProps {
  selectForm: {
    order: string;
    useDate: { startDate: Date | null; endDate: Date | null };
  };
  onFilterChange: (key: string, value: string | Date | null) => void;
  onResetFilter: () => void;
}

const FILTER_SELECTS: FilterSelectConfig[] = [
  { id: "order", type: "select", options: ["이용일순", "상태순"] },
  { id: "useDate", type: "rangeDate", options: ["이용일"] },
];

const UsageFilters = memo<UsageFiltersProps>(({ selectForm, onFilterChange }) => {
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

UsageFilters.displayName = "UsageFilters";

export default UsageFilters;
