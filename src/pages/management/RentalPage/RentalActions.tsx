// 물품 관리 테이블 버튼 컨테이너

import { memo } from "react";
import TableButton from "@/components/TableButton";
import { MODAL_TITLES } from "@/constants/modals";

interface RentalActionsProps {
  onTableButton: ({ value }: { value: (typeof MODAL_TITLES)[keyof typeof MODAL_TITLES] }) => void;
}

const RentalActions = memo<RentalActionsProps>(({ onTableButton }) => {
  return (
    <div className="flex gap-[10px]">
      <TableButton
        value={MODAL_TITLES.ADD}
        onClick={() => onTableButton({ value: MODAL_TITLES.ADD })}
      />
    </div>
  );
});

RentalActions.displayName = "RentalActions";

export default RentalActions;
