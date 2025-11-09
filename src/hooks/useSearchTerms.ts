import { useEffect, useState } from "react";
import { getSearchTerm, type SearchLabel } from "@/utils/searchTermOption";
import { useDebounce } from "./useDebounce";

export interface SearchTerm {
  name: string;
  id: string;
}

export function useSearchTerms(label: SearchLabel, searchInput: string) {
  const [searchTerms, setSearchTerms] = useState<SearchTerm[]>([]);
  const debouncedSearchInput = useDebounce(searchInput, 200);

  useEffect(() => {
    const fetchSearchTerms = async () => {
      const terms = await getSearchTerm(label, debouncedSearchInput);
      setSearchTerms(terms);
    };

    if (debouncedSearchInput) {
      fetchSearchTerms();
    } else {
      setSearchTerms([]);
    }
  }, [debouncedSearchInput, label]);

  return searchTerms;
}
