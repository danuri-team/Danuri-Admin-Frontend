// 물품 관리 테이블 버튼 컨테이너

import { memo } from "react";
import TableButton from "@/components/TableButton";
import { MODAL_TITLES } from "@/constants/modals";

interface JoinFormActionsProps {
  onSubmitForm: () => void;
}

const JoinFormActions = memo<JoinFormActionsProps>(({ onSubmitForm }) => {
  return (
    <div className="flex gap-[10px]">
      <TableButton value={MODAL_TITLES.ADD} onClick={() => onSubmitForm()} />
    </div>
  );
});

JoinFormActions.displayName = "JoinFormActions";

export default JoinFormActions;
