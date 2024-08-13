import { useColorMode, useMediaQuery } from "@chakra-ui/react";
import { PropsWithChildren, ReactNode, SyntheticEvent } from "react";
import {
  CheckPicker as RSCheckPicker,
  CustomProvider as RSuiteProvider,
} from "rsuite";

interface Props {
  data: { label: string; value: string }[];
  value: string[];
  defaultValue?: string[];
  onChange: (
    value: string[],
    item: { label?: string | ReactNode; value?: string | number | undefined },
    event: SyntheticEvent<Element, Event>,
  ) => void;
  onClean?: (event: SyntheticEvent) => void;
  placeholder?: string;
  isGrouped?: boolean;
}

type LabelProps =
  | {
      label?: never;
      id?: string;
    }
  | {
      label: string;
      id: string;
    };

export const MiniCheckPicker = ({
  label,
  data,
  value,
  defaultValue,
  onClean,
  onChange,
  placeholder,
  isGrouped = false,
}: PropsWithChildren<Props & LabelProps>) => {
  const [isLessThan960] = useMediaQuery("(max-width: 960px)");

  const { colorMode } = useColorMode();

  return (
    <RSuiteProvider theme={colorMode}>
      <RSCheckPicker
        label={label}
        sticky
        appearance="default"
        preventOverflow
        onClean={onClean}
        disabledItemValues={
          value.length > 0 && value[0] !== "All" ? ["All"] : []
        }
        cleanable
        placeholder={placeholder || "Select a value"}
        data={data.map(({ label, value }) => ({
          label,
          value,
          group: label.at?.(0)?.toUpperCase() || "",
        }))}
        groupBy={isGrouped ? "group" : undefined}
        value={value}
        onSelect={onChange}
        placement={isLessThan960 ? "bottom" : "leftStart"}
        style={{
          marginLeft: "-7px",
          maxWidth: isLessThan960 ? "initial" : 200,
          width: "100%",
        }}
        defaultValue={defaultValue}
      />
    </RSuiteProvider>
  );
};

export default MiniCheckPicker;
