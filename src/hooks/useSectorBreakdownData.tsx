import { getDealsValue, getInvestorsLength } from "@dealbase/core";
import { useMemo } from "react";
import { useDealflowStore } from "src/stores/dealflow";
import { useFilterStore } from "src/stores/filter";
import { shallow } from "zustand/shallow";

export const useSectorBreakdownData = () => {
  const filter = useFilterStore((state) => state.filter, shallow);
  const filteredDeals = useDealflowStore(
    (state) => state.filteredDeals,
    shallow,
  );

  const amountPerSector = useMemo(
    () =>
      (filteredDeals ?? []).reduce<
        Record<string, { sector: string; Amount: number }>
      >((acc, curr) => {
        const sector = curr.company.sectors[0]?.sector.name;

        if (sector) {
          if (acc[sector]) {
            acc[sector] = {
              ...acc[sector],
              Amount: acc[sector].Amount + curr.amount,
            };
          } else {
            acc[sector] = {
              sector,
              Amount: curr.amount,
            };
          }
        }

        return acc;
      }, {}),
    [filteredDeals],
  );

  return {
    deals: filteredDeals?.length || 0,
    investors: getInvestorsLength(filteredDeals ?? []),
    value: getDealsValue(filteredDeals ?? []),
    data: Object.entries(amountPerSector)
      .map(([key, value]) => {
        return {
          label: key,
          Amount: value.Amount,
          sector: value.sector,
        };
      })
      .sort((a, b) => a.sector.localeCompare(b.sector)),
    start: filter.dateRange.start,
    end: filter.dateRange.end,
  };
};
