import { useColorMode, useMediaQuery } from "@chakra-ui/react";
import { numberFormatter } from "@dealbase/core";
import { ResponsivePie } from "@nivo/pie";
import { useDiversityData } from "src/hooks/useDiversityData";

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
export const GenderPie = () => {
  const [isLessThan768] = useMediaQuery("(max-width: 768px)");

  const { genderSeparate, deals } = useDiversityData();

  const { colorMode } = useColorMode();

  return (
    <ResponsivePie
      theme={{
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        textColor: colorMode === "dark" ? "silver" : "gray",
        fontSize: 14,
        tooltip: {
          container: {
            color: "black",
          },
        },
      }}
      data={genderSeparate}
      margin={{
        top: 10,
        right: 10,
        bottom: 80,
        left: 10,
      }}
      innerRadius={0.5}
      colors={({ label }) => {
        return label === "Has Female Founder" ? "#31A078" : "#D98F39";
      }}
      valueFormat={(value: number) =>
        `${numberFormatter(value, {
          minimumFractionDigits: 0,
        })} (${((value / deals) * 100).toFixed(2)}%)`
      }
      padAngle={1}
      cornerRadius={6}
      activeOuterRadiusOffset={8}
      borderWidth={1}
      borderColor={{
        from: "color",
        modifiers: [["darker", 0.2]],
      }}
      enableArcLinkLabels={false}
      arcLinkLabelsSkipAngle={10}
      arcLinkLabelsThickness={2}
      arcLinkLabelsColor={{ from: "color" }}
      arcLabelsSkipAngle={10}
      arcLabelsTextColor={({ data }) => {
        return data.id === "Has Female Founder" ? "white" : "black";
      }}
      legends={[
        {
          anchor: "bottom",
          direction: "column",
          justify: false,
          translateX: -50,
          translateY: isLessThan768 ? 0 : 60,
          itemsSpacing: 5,
          itemWidth: 100,
          itemHeight: 18,
          itemDirection: "left-to-right",
          itemOpacity: 1,
          symbolSize: 18,
          symbolShape: "circle",
        },
      ]}
    />
  );
};

export default GenderPie;
