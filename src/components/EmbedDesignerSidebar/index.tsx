import {
  Box,
  Button,
  Checkbox,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputLeftAddon,
  Link,
  Select,
  Text,
  Textarea,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { countryList } from "@dealbase/fixtures";
import dynamic from "next/dynamic";
import {
  ChangeEvent,
  Dispatch,
  FormEventHandler,
  SetStateAction,
  useState,
} from "react";
import { ColorModeToggle } from "src/components/ColorModeToggle";
import { theme as appTheme } from "src/lib/theme";
import { useRouter } from "next/router";

const CheckPicker = dynamic(
  () => import("src/components/FormElements/Inputs/MiniCheckPicker"),
  {
    ssr: false,
  },
);

const chartTypes = ["monthly", "sectors", "diversity", "compare"];
type ColorTheme = "light" | "dark";

interface Props {
  generateEmbedCode: () => void;
  refreshIframe: (formValues: { [k: string]: FormDataEntryValue }) => void;
  charts: string;
  setCharts: Dispatch<SetStateAction<string>>;
  embedCode: string;
  setEmbedCode: Dispatch<SetStateAction<string>>;
  theme: ColorTheme;
  setTheme: Dispatch<SetStateAction<ColorTheme>>;
  colorScheme: string;
  setColorScheme: Dispatch<SetStateAction<string>>;
  countries: string[];
  setCountries: Dispatch<SetStateAction<string[]>>;
  iframeDimensions: { width: number; height: number };
}

export default function EmbedDesignerSidebar({
  refreshIframe,
  generateEmbedCode,
  charts,
  setCharts,
  embedCode,
  setEmbedCode,
  theme,
  setTheme,
  colorScheme,
  setColorScheme,
  iframeDimensions,
  setCountries,
  countries,
}: Props) {
  const { push } = useRouter();

  function handleCheckPickerClean() {
    setCountries(["All"]);
  }

  function handleCheckPickerChange(value: string[]) {
    const valueWithoutAll =
      value.length > 1 && value.includes("All")
        ? value.filter((v) => v !== "All")
        : value.length === 0
          ? ["All"]
          : value;

    setCountries(valueWithoutAll);
  }

  const handleThemeChange = () => {
    if (theme === "dark") setTheme("light");
    if (theme === "light") setTheme("dark");
  };

  const handleColorSchemeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setColorScheme(e.target.value);
  };

  const [width, setWidth] = useState(iframeDimensions.width);
  const [height, setHeight] = useState(iframeDimensions.height);

  const handleDimensionChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "width") {
      setWidth(+value);
    } else if (name === "height") {
      setHeight(+value);
    }
  };

  const handleRefresh: FormEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const formValues = Object.fromEntries(formData);

    refreshIframe(formValues);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmbedCode("");
    const { name, checked } = e.target;

    if (checked) {
      setCharts((currentCharts) =>
        [...(currentCharts === "" ? [] : currentCharts.split(",")), name].join(
          ",",
        ),
      );
    } else {
      setCharts((currentCharts) =>
        currentCharts
          .split(",")
          .filter((chart) => chart !== name)
          .join(","),
      );
    }
  };

  const [copiedText, setCopiedText] = useState("");

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode);
    setCopiedText("Copied to Clipboard!");
    setTimeout(() => {
      setCopiedText("");
    }, 2000);
  };

  return (
    <Flex
      w="full"
      h="full"
      bg={`${colorScheme}.900`}
      p={8}
      pt={4}
      overflow="auto"
      alignItems="center"
      justifyContent="space-between"
      gap={4}
      flexDir="column"
    >
      <Flex w="full" h="full" gap={4} flexDir="column">
        <Heading>Embed Designer</Heading>
        <Flex as="form" flexDir="column" gap={2} onSubmit={handleRefresh}>
          <Text>Dimensions</Text>
          <InputGroup>
            <InputLeftAddon>Width</InputLeftAddon>
            <Input
              type="number"
              name="width"
              value={width}
              onChange={handleDimensionChange}
            />
          </InputGroup>
          <InputGroup>
            <InputLeftAddon>Height</InputLeftAddon>
            <Input
              type="number"
              name="height"
              value={height}
              onChange={handleDimensionChange}
            />
          </InputGroup>
          <Button type="submit">Refresh Dimensions</Button>
        </Flex>
        <div className="flex w-full flex-col items-start justify-between gap-2">
          <div className="flex flex-col gap-2">
            <p>Countries:</p>
            <CheckPicker
              onChange={handleCheckPickerChange}
              onClean={handleCheckPickerClean}
              placeholder="Select a country"
              value={countries}
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
            />
          </div>
          <Text>Charts</Text>
          {chartTypes.map((chartType) => (
            <Checkbox
              name={chartType}
              id={chartType}
              key={chartType}
              onChange={handleChange}
              checked={charts.includes(chartType)}
            >
              {chartType}
            </Checkbox>
          ))}
        </div>
        <Box w="full">
          <Text>Theme</Text>
          <Flex alignItems="center" gap={2}>
            <ColorModeToggle onClick={handleThemeChange} override />
            <Text>{theme}</Text>
          </Flex>

          <InputGroup display="flex" flexDirection="column" mt={4} gap={2}>
            <Text>Color Scheme</Text>
            <Select
              value={colorScheme}
              onChange={handleColorSchemeChange}
              placeholder="Select option"
            >
              {Object.keys(appTheme.colors)
                .filter(
                  (color) =>
                    ![
                      "transparent",
                      "white",
                      "black",
                      "whiteAlpha",
                      "blackAlpha",
                      "current",
                    ].includes(color),
                )
                .map((color: string) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
            </Select>
          </InputGroup>
        </Box>
        <Flex
          position="relative"
          flexDir="column"
          gap={2}
          w="full"
          justifyContent="space-around"
        >
          {embedCode ? (
            <>
              <Textarea rows={4} isDisabled value={embedCode} />
              <Button colorScheme="red" onClick={() => setEmbedCode("")}>
                Clear Code
              </Button>
              <Button onClick={handleCopy}>Copy Code</Button>
              {copiedText && (
                <Text
                  bg="blackAlpha.500"
                  p={4}
                  top={8}
                  left={8}
                  position="absolute"
                >
                  {copiedText}
                </Text>
              )}
            </>
          ) : (
            <Button colorScheme="teal" onClick={generateEmbedCode}>
              Generate Embed Code
            </Button>
          )}
        </Flex>
      </Flex>

      <Button
        w="full"
        variant="outline"
        colorScheme="teal"
        onClick={() => push("/")}
      >
        Back to Home
      </Button>
    </Flex>
  );
}
