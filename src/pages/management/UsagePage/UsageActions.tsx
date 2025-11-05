import { memo } from "react";
import TableButton from "@/components/TableButton";
import { MODAL_TITLES } from "@/constants/modals";

interface UsageActionsProps {
  onRentalNavigate: () => void;
  onTableButton: ({ value }: { value: (typeof MODAL_TITLES)[keyof typeof MODAL_TITLES] }) => void;
  isDeleteMode: boolean;
}

const UsageActions = memo<UsageActionsProps>(
  ({ onTableButton, isDeleteMode, onRentalNavigate }) => {
    return (
      <div className="flex gap-[10px]">
        <TableButton
          value={MODAL_TITLES.DOWNLOAD}
          onClick={() => onTableButton({ value: MODAL_TITLES.DOWNLOAD })}
        />
        <TableButton value={MODAL_TITLES.RENTAL} onClick={onRentalNavigate} />
        <TableButton
          value={MODAL_TITLES.ADD}
          onClick={() => onTableButton({ value: MODAL_TITLES.ADD })}
        />
        <TableButton
          value={MODAL_TITLES.FORCED}
          onClick={() => onTableButton({ value: MODAL_TITLES.FORCED })}
          isDeleteMode={isDeleteMode}
        />
      </div>
    );
  }
);

UsageActions.displayName = "UsageActions";

export default UsageActions;
