import {
  getDealRange,
  getFormattedDealRange,
  getFormattedSectorCounts,
  getFormattedStageCounts,
  getSectors,
  Investor,
} from "@dealbase/core";
import { useEffect, useMemo, useState } from "react";
import { useDealflowStore } from "src/stores/dealflow";
import { shallow } from "zustand/shallow";

export type InvestorWithDeals = Investor & {
  allDeals?: number;
  numberOfDealsInPeriod?: number;
  dealsRange?: string;
  stageCounts?: string;
  sectorCounts?: string;
  maxDealValue?: number;
  minDealValue?: number;
  sectors?: string[];
};

export const useFilteredInvestors = (): {
  filteredInvestors: InvestorWithDeals[];
  investors: Investor[];
} => {
  const { filteredDeals, filteredInvestors, investors } = useDealflowStore(
    (state) => ({
      filteredDeals: state.filteredDeals,
      filteredInvestors: state.filteredInvestors,
      investors: state.investors,
    }),
    shallow,
  );

  const [filteredInvestorsWithDeals, setFilteredInvestorsWithDeals] = useState<
    InvestorWithDeals[]
  >([]);

  useEffect(() => {
    const reshapedFilteredInvestors = filteredInvestors.map((investor) => {
      const dealsInPeriod = filteredDeals.filter((deal) =>
        deal.investors
          .map((i) => i.investor.name)
          .includes(investor.investor.name),
      );

      return {
        ...investor,
        numberOfDealsInPeriod: dealsInPeriod.length,
        dealsInPeriod,
        maxDealValue: getDealRange(dealsInPeriod).max,
        minDealValue: getDealRange(dealsInPeriod).min,
        dealsRange: getFormattedDealRange(dealsInPeriod),
        stageCounts: getFormattedStageCounts(dealsInPeriod),
        sectorCounts: getFormattedSectorCounts(dealsInPeriod),
        sectors: getSectors(dealsInPeriod),
      };
    });

    setFilteredInvestorsWithDeals(reshapedFilteredInvestors);
  }, [filteredInvestors, filteredDeals]);

  return useMemo(
    () => ({
      filteredInvestors: filteredInvestorsWithDeals,
      investors,
    }),
    [filteredInvestorsWithDeals, investors],
  );
};
