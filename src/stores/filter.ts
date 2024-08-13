import { Filter, filterDeals, filterInvestors } from "@dealbase/core";
import { defaultFilter } from "@dealbase/fixtures";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { useDealflowStore } from "./dealflow";

export interface FilterState {
  filter: Filter;
  setFilter: (
    arg: ((currentFilter: Filter) => Filter) | Partial<Filter>,
  ) => void;
  setSearchTerm: (searchTerm: string) => void;
  resetFilter: () => void;
}

export const useFilterStore = create(
  devtools<FilterState>((set) => ({
    filter: defaultFilter,
    setFilter: (
      arg: ((currentFilter: Filter) => Filter) | Partial<Filter>,
    ): void => {
      set((currentState) => {
        let newFilter: Filter;
        if (typeof arg === "function") {
          newFilter = arg(currentState.filter);
        } else {
          newFilter = {
            ...currentState.filter,
            ...arg,
          };
        }

        const { deals, investors, setState } = useDealflowStore.getState();

        const filteredDeals = filterDeals(deals, newFilter);
        const filteredInvestors = filterInvestors(filteredDeals, investors);

        setState((currentState) => ({
          ...currentState,
          filteredDeals,
          filteredInvestors,
        }));

        return {
          ...currentState,
          filter: newFilter,
        };
      });
    },
    setSearchTerm: (searchTerm: string) => {
      set((currentDealflow) => ({
        ...currentDealflow,
        filter: {
          ...currentDealflow.filter,
          searchTerm,
        },
      }));
    },
    resetFilter: () => {
      set((currentState) => ({
        ...currentState,
        filter: { ...defaultFilter },
      }));
    },
  })),
);
