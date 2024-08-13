import {
  Deal,
  Dealflow,
  getDealsValue,
  getInvestorsLength,
  Investor,
} from "@dealbase/core";
import { defaultDealflow } from "@dealbase/fixtures";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface State {
  deals: Deal[];
  filteredDeals: Deal[];
  filteredInvestors: Investor[];
  investors: Investor[];
  dealflow: Dealflow;
  compareOffset: Duration;
}

interface Actions {
  setState: (callback: (state: DealflowStore) => DealflowStore) => void;
  setCompareOffset: (offset: Duration) => void;
  setDealflow: (newDealflow: Dealflow) => void;
  calculateStats: (deals: Deal[]) => void;
}

export interface DealflowStore extends State, Actions {}

export const useDealflowStore = create(
  devtools<DealflowStore>((set) => ({
    dealflow: defaultDealflow,
    deals: [],
    filteredDeals: [],
    filteredInvestors: [],
    investors: [],
    compareOffset: { years: 1 },

    setState: (callback: (state: DealflowStore) => DealflowStore) => {
      set((currentDealflow) => callback(currentDealflow));
    },

    setCompareOffset: (newCompareOffset: Duration) => {
      set((currentDealflow) => ({
        ...currentDealflow,
        compareOffset: newCompareOffset,
      }));
    },

    setDealflow: (newDealflow: Dealflow) => {
      set((currentDealflow) => ({
        ...currentDealflow,
        dealflow: {
          ...currentDealflow.dealflow,
          ...newDealflow,
        },
      }));
    },

    calculateStats: (deals: Deal[]) => {
      set((currentDealflow) => ({
        ...currentDealflow,
        dealflow: {
          ...currentDealflow.dealflow,
          deals: deals.length || 0,
          investors: getInvestorsLength(deals),
          value: getDealsValue(deals),
        },
      }));
    },
  })),
);
