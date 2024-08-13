import { Filter } from "@dealbase/core";

export const generateWhereClause = (filter?: string) => {
  const whereClause: any = {};

  if (filter) {
    const filterObject = JSON.parse(filter as string) as Filter;

    if (filterObject.searchTerm !== "") {
      whereClause.company = { name: { contains: filterObject.searchTerm } };
    }

    if (
      filterObject.country.length > 0 &&
      !filterObject.country.includes("All")
    ) {
      whereClause.company = {
        ...whereClause.company,
        country: { in: filterObject.country },
      };
    }

    if (filterObject.stage.length > 0 && !filterObject.stage.includes("All")) {
      whereClause.stage = { in: filterObject.stage };
    }

    if (
      filterObject.sector.length > 0 &&
      !filterObject.sector.includes("All")
    ) {
      whereClause.company = {
        ...whereClause.company,
        sectors: { some: { sector: { name: { in: filterObject.sector } } } },
      };
    }

    if (filterObject.dateRange) {
      whereClause.pressRelease = {
        date: {
          gte: new Date(filterObject.dateRange.start),
          lte: new Date(filterObject.dateRange.end),
        },
      };
    }

    return whereClause;
  }
};
