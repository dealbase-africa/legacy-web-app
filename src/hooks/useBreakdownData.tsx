import { getDealsValue, getInvestorsLength } from "@dealbase/core";
import { format, getYear } from "date-fns";
import { useMemo } from "react";
import { useDealflowStore } from "src/stores/dealflow";
import { useFilterStore } from "src/stores/filter";
import { shallow } from "zustand/shallow";

export const useMonthlyBreakdownData = () => {
  const dateRange = useFilterStore((state) => state.filter.dateRange, shallow);

  const filteredDeals = useDealflowStore(
    (state) => state.filteredDeals,
    shallow,
  );

  const amountPerMonth = useMemo(
    () =>
      (filteredDeals ?? []).reduce<
        Record<string, { monthNumber: number; Amount: number }>
      >((acc, curr) => {
        const currentMonth = format(
          new Date(curr.pressRelease.date ?? ""),
          "MMM, yy",
        );

        const monthNumber = format(
          new Date(curr.pressRelease.date ?? ""),
          "MM",
        );

        const yearNumber = getYear(new Date(curr.pressRelease.date ?? ""));

        if (acc[currentMonth]) {
          acc[currentMonth] = {
            ...acc[currentMonth],
            Amount: acc[currentMonth].Amount + curr.amount,
          };
        } else {
          acc[currentMonth] = {
            monthNumber: +`${yearNumber}${monthNumber}`,
            Amount: curr.amount,
          };
        }
        return acc;
      }, {}),
    [filteredDeals],
  );

  return {
    deals: filteredDeals?.length || 0,
    investors: getInvestorsLength(filteredDeals ?? []),
    value: getDealsValue(filteredDeals ?? []),
    data: Object.entries(amountPerMonth)
      .map(([key, value]) => {
        return {
          label: key,
          Amount: value.Amount,
          monthNumber: value.monthNumber,
        };
      })
      .sort((a, b) => (+a.monthNumber < +b.monthNumber ? -1 : 1)),
    start: dateRange.start,
    end: dateRange.end,
  };
};
