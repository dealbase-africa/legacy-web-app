import { useEffect, useMemo } from "react";
import { useDeals } from "src/hooks";
import { useDealflowStore } from "src/stores/dealflow";
import { useFilterStore } from "src/stores/filter";
import { shallow } from "zustand/shallow";

export const useFilteredDeals = () => {
  const calculateStats = useDealflowStore((state) => state.calculateStats);

  const { searchTerm, resetFilter } = useFilterStore(
    (state) => ({
      resetFilter: state.resetFilter,
      searchTerm: state.filter.searchTerm,
    }),
    shallow,
  );

  const { deals, isLoading: dealsLoading, isFetched } = useDeals();

  useEffect(() => {
    if (deals) {
      calculateStats(deals);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deals]);

  useEffect(() => {
    if (deals) {
      if (searchTerm) {
        const filtered = deals.filter((deal) =>
          deal.company.name?.includes(searchTerm),
        );
      } else {
        resetFilter();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  return useMemo(
    () => ({ filteredDeals: deals, deals, dealsLoading, isFetched }),
    [deals, dealsLoading, isFetched],
  );
};
