import { useOffsetDeals } from "@dealbase/client";
import { getDealsValue, getInvestorsLength } from "@dealbase/core";
import { formatDuration, sub } from "date-fns";
import { useDealflowStore } from "src/stores/dealflow";
import { useFilterStore } from "src/stores/filter";
import { shallow } from "zustand/shallow";

export const useCompareData = (offset = false) => {
  const { compareOffset, filteredDeals } = useDealflowStore(
    (state) => ({
      compareOffset: state.compareOffset,
      filteredDeals: state.filteredDeals,
    }),
    shallow,
  );

  const filter = useFilterStore((state) => state.filter, shallow);

  const start = sub(
    new Date(filter.dateRange.start),
    offset ? compareOffset : { years: 0 },
  );

  const end = sub(
    new Date(filter.dateRange.end),
    offset ? compareOffset : { years: 0 },
  );

  const { deals: offsetDeals } = useOffsetDeals({
    ...filter,
    dateRange: {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      start,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      end,
    },
  });

  return {
    offset: {
      deals: offsetDeals?.length || 0,
      investors: getInvestorsLength(offsetDeals ?? []),
      value: getDealsValue(offsetDeals ?? []),
      data: offsetDeals ?? [],
      start,
      end,
      label: `${formatDuration(offset ? compareOffset : { years: 0 })} ago`,
    },
    current: {
      deals: filteredDeals?.length || 0,
      investors: getInvestorsLength(filteredDeals ?? []),
      value: getDealsValue(filteredDeals ?? []),
      data: filteredDeals ?? [],
      start: filter.dateRange.start,
      end: filter.dateRange.end,
      label: "Current period",
    },
  };
};
