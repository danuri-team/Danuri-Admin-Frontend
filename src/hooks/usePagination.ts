import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

export function usePagination() {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = Number(searchParams.get("page")) || 0;
  const pageSize = Number(searchParams.get("size")) || 10;

  const setPage = useCallback(
    (page: number) => {
      searchParams.set("page", String(page));
      setSearchParams(searchParams);
    },
    [searchParams, setSearchParams]
  );

  const setSize = useCallback(
    (size: number) => {
      searchParams.set("size", String(size));
      searchParams.set("page", "0");
      setSearchParams(searchParams);
    },
    [searchParams, setSearchParams]
  );

  const nextPage = useCallback(() => {
    setPage(currentPage + 1);
  }, [currentPage, setPage]);

  const prevPage = useCallback(() => {
    setPage(currentPage - 1);
  }, [currentPage, setPage]);

  const goToPage = useCallback(
    (page: number) => {
      setPage(page);
    },
    [setPage]
  );

  return {
    currentPage,
    pageSize,
    setPage,
    setSize,
    nextPage,
    prevPage,
    goToPage,
  };
}
