// 물품 관리 테이블 버튼 컨테이너

import { memo } from "react";
import TableButton from "@/components/TableButton";
import { MODAL_TITLES } from "@/constants/modals";

interface MachineActionsProps {
  onTableButton: ({ value }: { value: (typeof MODAL_TITLES)[keyof typeof MODAL_TITLES] }) => void;
  isDeleteMode: boolean;
}

const MachineActions = memo<MachineActionsProps>(({ onTableButton, isDeleteMode }) => {
  return (
    <div className="flex gap-[10px]">
      <TableButton
        value={MODAL_TITLES.ADD}
        onClick={() => onTableButton({ value: MODAL_TITLES.ADD })}
      />
      <TableButton
        value={MODAL_TITLES.DELETE}
        onClick={() => onTableButton({ value: MODAL_TITLES.DELETE })}
        isDeleteMode={isDeleteMode}
      />
    </div>
  );
});

MachineActions.displayName = "MachineActions";

export default MachineActions;
