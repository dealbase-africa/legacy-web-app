import { useAuth0 } from "@auth0/auth0-react";
import { Box, Grid, GridItem } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import EmbedDesignerSidebar from "src/components/EmbedDesignerSidebar";
import ErrorPage from "src/components/ErrorPage";
import { config } from "src/lib/config";

type ColorTheme = "light" | "dark";

export default function EmbedDesigner() {
  const {
    query: { clientId: clientIdEncoded },
  } = useRouter();

  const clientId = decodeURIComponent(atob((clientIdEncoded ?? "") as string));

  const { user } = useAuth0();

  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const [theme, setTheme] = useState<ColorTheme>("light");
  const [colorScheme, setColorScheme] = useState("purple");
  const [countries, setCountries] = useState(["All"]);

  const [charts, setCharts] = useState("");
  const [embedCode, setEmbedCode] = useState("");
  const [iframeDimensions, setIframeDimensions] = useState({
    width: 1200,
    height: 1300,
  });

  if (typeof clientId !== "string") {
    return <ErrorPage />;
  }

  if (clientId !== user?.sub) {
    return <ErrorPage>Sorry, you do not have access to this page.</ErrorPage>;
  }

  const iframeData = {
    clientId,
    charts,
    theme,
    w: `${iframeDimensions.width.toString()}px`,
    h: `${iframeDimensions.height.toString()}px`,
    colorScheme,
    countries,
  };

  const embedData = btoa(encodeURIComponent(JSON.stringify(iframeData)));

  const iframeSrc = `${config.embedUrl}/?data=${embedData}`;

  const generateEmbedCode = () => {
    setEmbedCode(
      `<iframe src="${iframeSrc}" width="${iframeDimensions.width.toString()}px" height="${iframeDimensions.height.toString()}px" />`,
    );
  };

  const refreshIframe = (formValues: { [k: string]: FormDataEntryValue }) => {
    if (iframeRef.current) {
      setIframeDimensions({
        width: +formValues.width,
        height: +formValues.height,
      });

      iframeRef.current.src = iframeSrc;
    }
  };

  return (
    <Grid
      templateColumns={"minmax(100px, 320px) 1fr"}
      placeItems="center"
      h="100vh"
    >
      <GridItem
        w="full"
        h="full"
        bg="teal.900"
        overflow="auto"
        rowSpan={1}
        colSpan={1}
        alignItems="center"
        gap={4}
        display="flex"
        flexDir="column"
      >
        <EmbedDesignerSidebar
          iframeDimensions={iframeDimensions}
          refreshIframe={refreshIframe}
          generateEmbedCode={generateEmbedCode}
          charts={charts}
          setCharts={setCharts}
          embedCode={embedCode}
          setEmbedCode={setEmbedCode}
          theme={theme}
          setTheme={setTheme}
          countries={countries}
          setCountries={setCountries}
          colorScheme={colorScheme}
          setColorScheme={setColorScheme}
        />
      </GridItem>
      <GridItem
        display="grid"
        placeItems="center"
        h="full"
        w="full"
        overflow="auto"
        colSpan={1}
      >
        <Box
          ref={iframeRef}
          h={`${iframeDimensions.height.toString()}px`}
          w={`${iframeDimensions.width.toString()}px`}
          as="iframe"
          src={iframeSrc}
        />
      </GridItem>
    </Grid>
  );
}
