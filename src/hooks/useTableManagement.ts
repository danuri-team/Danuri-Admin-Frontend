import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import type { UsageData } from "@/components/CustomTable";

interface UseTableManagementProps {
  fetchFn: (params: { page: number; size: number }) => Promise<{
    pass: boolean;
    data: {
      [key: string]: any;
      total_pages?: number;
    };
  }>;
  deleteFn?: (params: any) => Promise<{ pass: boolean }>;
  transformFn?: (data: any) => UsageData;
  dataKey?: string;
}

interface UseTableManagementReturn {
  data: UsageData[] | null;
  totalPages: number;
  isDeleteMode: boolean;
  selectedRowId: string;
  isLoading: boolean;
  page: number;
  size: number;
  refreshData: () => void;
  handleDeleteMode: () => void;
  handleChangeSelectedRow: ({ id }: { id: string | null }) => void;
  handleDelete: () => Promise<void>;
  setData: (data: UsageData[] | null) => void;
}

export const useTableManagement = ({
  fetchFn,
  deleteFn,
  transformFn,
  dataKey = "content",
}: UseTableManagementProps): UseTableManagementReturn => {
  const [searchParams] = useSearchParams();
  const [data, setData] = useState<UsageData[] | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Extract search params
  const page = Number(searchParams.get("page")) || 0;
  const size = Number(searchParams.get("size")) || 10;

  // 데이터 가져오기
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetchFn({ page, size });
      if (res.pass) {
        // 데이터 추출 로직 개선
        let extractedData = res.data;

        // dataKey가 있으면 해당 키에서 데이터 추출
        if (dataKey && res.data[dataKey]) {
          extractedData = res.data[dataKey];
        }

        // content 또는 data 배열 찾기
        const dataArray = extractedData.content || extractedData.data || extractedData;

        // 변환 함수가 있으면 적용
        const transformedData = transformFn ? dataArray.map(transformFn) : dataArray;

        setData(transformedData);

        // total_pages 찾기
        const pages =
          extractedData.total_pages || res.data.total_pages || extractedData.totalPages || 0;
        setTotalPages(pages);
      }
    } catch (error) {
      console.error("[다누리] 데이터 로드 실패:", error);
      toast.error("데이터를 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [fetchFn, transformFn, dataKey, page, size]);

  // 초기 로드 및 페이지 변경 시 데이터 가져오기
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 삭제 모드 토글
  const handleDeleteMode = useCallback(() => {
    setIsDeleteMode((prev) => !prev);
    if (isDeleteMode) {
      setSelectedRowId("");
    }
  }, [isDeleteMode]);

  // 선택된 행 변경
  const handleChangeSelectedRow = useCallback(({ id }: { id: string | null }) => {
    setSelectedRowId(id || "");
  }, []);

  // 삭제 처리
  const handleDelete = useCallback(async () => {
    if (!deleteFn) {
      toast.error("삭제 기능이 구현되지 않았습니다.");
      return;
    }

    if (!selectedRowId) {
      toast.error("선택된 항목이 없습니다.");
      setIsDeleteMode(false);
      return;
    }

    try {
      const res = await deleteFn({ id: selectedRowId });
      if (res.pass) {
        toast.success("삭제되었습니다.");
        setIsDeleteMode(false);
        setSelectedRowId("");
        // 데이터 새로고침
        await fetchData();
      } else {
        toast.error("삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("[다누리] 삭제 실패:", error);
      toast.error("삭제 중 오류가 발생했습니다.");
    }
  }, [deleteFn, selectedRowId, fetchData]);

  // 데이터 새로고침
  const refreshData = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    totalPages,
    isDeleteMode,
    selectedRowId,
    isLoading,
    page,
    size,
    refreshData,
    handleDeleteMode,
    handleChangeSelectedRow,
    handleDelete,
    setData,
  };
};

// 삭제 모드 전용 훅
export const useDeleteMode = () => {
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<string>("");

  const toggleDeleteMode = useCallback(() => {
    setIsDeleteMode((prev) => !prev);
    if (isDeleteMode) {
      setSelectedRowId("");
    }
  }, [isDeleteMode]);

  const selectRow = useCallback((id: string | null) => {
    setSelectedRowId(id || "");
  }, []);

  const resetDeleteMode = useCallback(() => {
    setIsDeleteMode(false);
    setSelectedRowId("");
  }, []);

  return {
    isDeleteMode,
    selectedRowId,
    toggleDeleteMode,
    selectRow,
    resetDeleteMode,
  };
};
