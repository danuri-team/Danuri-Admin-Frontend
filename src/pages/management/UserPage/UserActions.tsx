import { memo } from "react";
import TableButton from "@/components/TableButton";
import { MODAL_TITLES } from "@/constants/modals";

interface UserActionsProps {
  onTableButton: ({ value }: { value: (typeof MODAL_TITLES)[keyof typeof MODAL_TITLES] }) => void;
  onJoinFormNavigate: () => void;
  isDeleteMode: boolean;
  isJoinForm: boolean;
}

const UserActions = memo<UserActionsProps>(
  ({ onTableButton, onJoinFormNavigate, isDeleteMode, isJoinForm }) => {
    return (
      <div className="flex gap-[10px]">
        {/* <TableButton
          value={MODAL_TITLES.ADD}
          onClick={() => onTableButton({ value: MODAL_TITLES.ADD })}
        /> */}
        <TableButton
          value={MODAL_TITLES.SEARCH}
          onClick={() => onTableButton({ value: MODAL_TITLES.SEARCH })}
        />
        <TableButton
          value={MODAL_TITLES.DELETE}
          onClick={() => onTableButton({ value: MODAL_TITLES.DELETE })}
          isDeleteMode={isDeleteMode}
        />
        {!isJoinForm && <TableButton value={MODAL_TITLES.FORM} onClick={onJoinFormNavigate} />}
      </div>
    );
  }
);

UserActions.displayName = "UserActions";

export default UserActions;
