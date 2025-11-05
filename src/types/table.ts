// 테이블 관련 타입 모음

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
  onRowClick: (row: UsageData) => void;
  onChangeSelectedRow: ({ id }: { id: string | null }) => void;
}

