import { describe, expect, it } from "vitest";
import { getTitle } from "./getTitle";

const filter = {
  searchTerm: "",
  country: ["All"],
  stage: ["All"],
  sector: ["All"],
  dateRange: {
    start: "2022-05-07",
    end: "2022-06-06",
  },
};

describe("getTitle", () => {
  it("should return the expected title for all countries", () => {
    expect(getTitle(filter)).toEqual(
      "All Countries fundraising roundup for 07 May, 2022 - 06 Jun, 2022",
    );
  });

  it("should return the expected title for South Africa", () => {
    const newDealflow = {
      ...filter,
      country: ["South Africa"],
    };
    expect(getTitle(newDealflow)).toEqual(
      "South Africa fundraising roundup for 07 May, 2022 - 06 Jun, 2022",
    );
  });

  it("should return the expected title for many countries", () => {
    const newDealflow = {
      ...filter,
      country: ["South Africa", "Nigeria", "Ghana"],
    };
    expect(getTitle(newDealflow)).toEqual(
      "South Africa, Nigeria, Ghana fundraising roundup for 07 May, 2022 - 06 Jun, 2022",
    );
  });

  it("should return second argument if it is provided", () => {
    const title = "title";
    expect(getTitle(filter, title)).toBe(title);
  });
});
