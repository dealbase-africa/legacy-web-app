import { CloseIcon } from "@chakra-ui/icons";
import { Flex, Text, useColorMode, useMediaQuery } from "@chakra-ui/react";
import debounce from "debounce";
import { RefObject, useMemo, useRef, useState } from "react";
import {
  AutoComplete,
  InputGroup,
  PickerHandle,
  CustomProvider as RSuiteProvider,
} from "rsuite";
import { CloudinaryImage } from "src/components/CloudinaryImage";
import { useDeals } from "src/hooks";
import { useFilterStore } from "src/stores/filter";
import { shallow } from "zustand/shallow";

interface Props {
  tableRef: RefObject<HTMLDivElement>;
}

export const CompanySearchInput = ({ tableRef }: Props) => {
  const [showClearButton, setShowClearButton] = useState(false);
  const [autocompleteValue, setAutocompleteValue] = useState("");
  const setSearchTerm = useFilterStore((state) => state.setSearchTerm, shallow);
  const { deals } = useDeals();

  const clearAutocomplete = () => {
    setShowClearButton(false);
    setSearchTerm("");
    setAutocompleteValue("");
  };

  function handleSelect(value: string) {
    setSearchTerm(value);
    tableRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  const [isLessThan960] = useMediaQuery("(max-width: 960px)");

  const { colorMode } = useColorMode();

  const companyLogos = useMemo(() => {
    return deals?.reduce<Record<string, string>>((acc, deal) => {
      if (!deal.company) {
        return acc;
      }
      return {
        ...acc,
        [deal?.company.name as string]:
          deal?.company.logo?.cloudinaryPublicId || "",
      };
    }, {});
  }, [deals]);

  const inputRef = useRef<PickerHandle | null>(null);

  return (
    <InputGroup
      inside
      style={{
        outlineColor: "#D98F39",
        flex: 1,
        marginTop: !isLessThan960 ? "-16px" : "",
      }}
    >
      <InputGroup.Addon style={{ fontWeight: "bold" }}>Or</InputGroup.Addon>
      <RSuiteProvider theme={colorMode}>
        <AutoComplete
          size="lg"
          ref={inputRef}
          onChange={(value) => {
            value === "" ? setShowClearButton(false) : setShowClearButton(true);
            setAutocompleteValue(value);
          }}
          value={autocompleteValue}
          placeholder="Search by Company"
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          data={[...new Set(deals?.map((deal) => deal.company.name) || [])]}
          onSelect={debounce(handleSelect, 300)}
          renderMenuItem={(item) => {
            return (
              <Flex alignItems="center" gap={2}>
                {companyLogos?.[item as string] && (
                  <CloudinaryImage
                    publicId={companyLogos[item as string] || ""}
                    imageWidth={32}
                    alt="Logo"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    bg="white"
                    p={0}
                  />
                )}
                <Text
                  color="teal.500"
                  _dark={{
                    color: "teal.100",
                  }}
                >
                  {item}
                </Text>
              </Flex>
            );
          }}
        />
      </RSuiteProvider>

      {showClearButton && (
        <InputGroup.Button
          onClick={() => {
            inputRef.current?.root?.querySelector("input")?.focus();
            clearAutocomplete();
          }}
        >
          <CloseIcon fontSize={12} />
        </InputGroup.Button>
      )}
    </InputGroup>
  );
};

export default CompanySearchInput;
