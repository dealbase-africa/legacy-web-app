import {
  Box,
  Divider,
  Flex,
  useColorMode,
  useMediaQuery,
} from "@chakra-ui/react";
import { countryList, sectors, stages } from "@dealbase/fixtures";
import dynamic from "next/dynamic";
import { RefObject, useRef } from "react";
import { isProd } from "src/lib/config";
import * as ga from "src/lib/googleAnalytics";
import { useFilterStore } from "src/stores/filter";
import { shallow } from "zustand/shallow";

const CheckPicker = dynamic(
  () => import("src/components/FormElements/Inputs/CheckPicker"),
  {
    ssr: false,
  },
);

const DatePicker = dynamic(
  () => import("src/components/FormElements/Inputs/FilterDatePicker"),
  {
    ssr: false,
  },
);

const CompanySearchInput = dynamic(() => import("./CompanySearchInput"), {
  ssr: false,
});

interface Props {
  tableRef: RefObject<HTMLDivElement>;
}

export const Filters = ({ tableRef }: Props) => {
  const [isLessThan960] = useMediaQuery("(max-width: 960px)");
  const { colorMode } = useColorMode();
  const { filter, setFilter } = useFilterStore(
    (state) => ({
      filter: state.filter,
      setFilter: state.setFilter,
    }),
    shallow,
  );

  const filtersRef = useRef<HTMLDivElement | null>(null);

  function handleDateSelectChange(value: [Date, Date]) {
    filtersRef.current?.scrollIntoView({ behavior: "smooth" });

    setFilter({
      dateRange: { start: value[0] as any, end: value[1] as any },
    });
  }

  function handleCheckPickerClean(field: "country" | "sector" | "stage") {
    filtersRef.current?.scrollIntoView({ behavior: "smooth" });

    setFilter({ [field]: ["All"] });
  }

  function handleCheckPickerChange(
    value: string[],
    field: "country" | "sector" | "stage",
  ) {
    filtersRef.current?.scrollIntoView({ behavior: "smooth" });

    const valueWithoutAll =
      value.length > 1 && value.includes("All")
        ? value.filter((v) => v !== "All")
        : value.length === 0
          ? ["All"]
          : value;

    if (isProd) {
      ga.event({
        action: "filter",
        params: {
          [field]: valueWithoutAll,
        },
      });
    }

    setFilter({ [field]: valueWithoutAll });
  }

  return (
    <Box
      _dark={{ bg: "gray.900" }}
      ref={filtersRef}
      boxShadow="0px 0px 20px -5px rgba(0, 0, 0, 0.25)"
      bg="white"
      pt={12}
      px={8}
      pb={8}
      rounded={30}
    >
      <Flex
        gap={4}
        flexDir={isLessThan960 ? "column" : "row"}
        justifyContent="space-between"
        alignItems="center"
        mb={isLessThan960 ? 4 : 8}
      >
        <CheckPicker
          label="Country"
          flex={1}
          id="country"
          noBorder
          onChange={(value) => handleCheckPickerChange(value, "country")}
          onClean={() => handleCheckPickerClean("country")}
          placeholder="Select a country"
          value={filter.country}
          defaultValue={["All"]}
          isGrouped
          data={[
            { label: "All", value: "All" },
            ...countryList
              .sort((a, b) => a?.name.localeCompare(b?.name))
              .map(({ name, code }) => ({
                label: name,
                value: code,
              })),
          ]}
          icon={
            colorMode === "dark"
              ? "/icons/country-dark.svg"
              : "/icons/country-light.svg"
          }
        />
        <CheckPicker
          label="Sector"
          flex={1}
          id="sector"
          noBorder
          onChange={(value) => handleCheckPickerChange(value, "sector")}
          onClean={() => handleCheckPickerClean("sector")}
          placeholder="Select a sector"
          value={filter.sector}
          defaultValue={["All"]}
          data={[
            { label: "All", value: "All" },
            ...sectors
              .sort((a, b) => a?.value.localeCompare(b?.value))
              .map(({ label, value }) => ({
                label,
                value,
              })),
          ]}
          icon={
            colorMode === "dark"
              ? "/icons/country-dark.svg"
              : "/icons/country-light.svg"
          }
        />
        <CheckPicker
          label="Stage"
          flex={1}
          id="stage"
          noBorder
          onChange={(value) => handleCheckPickerChange(value, "stage")}
          onClean={() => handleCheckPickerClean("stage")}
          placeholder="Select a stage"
          value={filter.stage}
          defaultValue={["All"]}
          data={[
            { label: "All", value: "All" },
            ...stages
              .sort((a, b) => a?.value.localeCompare(b?.value))
              .map(({ label, value }) => ({
                label,
                value,
              })),
          ]}
          icon={
            colorMode === "dark"
              ? "/icons/country-dark.svg"
              : "/icons/country-light.svg"
          }
        />
        <DatePicker
          id="date"
          label="Date"
          onOk={handleDateSelectChange}
          icon={
            colorMode === "dark"
              ? "/icons/date-dark.svg"
              : "/icons/date-light.svg"
          }
          flex={1}
          value={[filter.dateRange.start as any, filter.dateRange.end as any]}
          noBorder
        />
        {isLessThan960 && <Divider orientation="horizontal" />}
      </Flex>

      <CompanySearchInput tableRef={tableRef} />
    </Box>
  );
};

export default Filters;
