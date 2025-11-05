// 테이블 관련 타입 모음

import type { MODAL_TITLES } from "@/constants/modals";

export interface TableHeader {
  name: string;
  id: string;
}

export type UsageData = Record<string, string | number | number[]>;

export interface ManagementTableProps {
  tableHeader: TableHeader[];
  filterData: UsageData[] | null;
  isDeleteMode: boolean;
  selectedRowId: string;
  totalPages: number;
  onRowClick: (row: UsageData, title?: (typeof MODAL_TITLES)[keyof typeof MODAL_TITLES]) => void;
  onChangeSelectedRow: ({ id }: { id: string | null }) => void;
}
