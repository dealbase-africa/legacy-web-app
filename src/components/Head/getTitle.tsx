import { Filter, formatInterval } from "@dealbase/core";

export const getTitle = (filter: Filter | null, title?: string) => {
  if (title) return title;

  if (filter?.country)
    return `${
      typeof filter.country === "string"
        ? filter.country
        : filter.country.length > 1
          ? filter.country.join(", ")
          : filter.country[0] === "All"
            ? "All Countries"
            : filter.country[0]
    } fundraising roundup for ${formatInterval({
      start: new Date(filter.dateRange.start),
      end: new Date(filter.dateRange.end),
    })}`;

  return "African Startup Opportunity | Equipping Founders to Raise Capital and Investors to Optimize Dealflow";
};
