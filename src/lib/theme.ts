import { extendTheme, theme as base } from "@chakra-ui/react";

const config = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const activeLabelStyles = {};

export const theme = extendTheme({
  ...config,
  fonts: {
    heading: `Poppins, ${base.fonts.heading}`,
    body: `Poppins, ${base.fonts.body}`,
  },
  colors: {
    startupClub: {
      50: "#ffeade",
      100: "#ffc6b0",
      200: "#ffa280",
      300: "#fd7d4e",
      400: "#fb591d",
      500: "#e24004",
      600: "#b13102",
      700: "#7f2300",
      800: "#4d1200",
      900: "#200300",
    },
  },
  components: {
    Divider: {
      baseStyle: {
        borderWidth: "2px",
        borderColor: "gray.400",
      },
    },
    Button: {
      baseStyle: {
        fontWeight: "400",
      },
      sizes: {
        md: {
          py: "1.5rem",
        },
      },
    },
    Form: {
      variants: {
        filter: {
          container: {
            _focusWithin: {
              label: {
                ...activeLabelStyles,
              },
            },
            "input:not(:placeholder-shown) + label, .chakra-select__wrapper + label":
              {
                transform: "scale(0.85) translateY(-32px)",
              },
            "select:not(:placeholder-shown) + label, .chakra-select__wrapper + label":
              {
                transform: "scale(0.85) translateY(-32px)",
              },
            label: {
              top: 0,
              left: 0,
              zIndex: 2,
              position: "absolute",
              backgroundColor: "transparent",
              pointerEvents: "none",
              mx: 3,
              my: 2,
              transformOrigin: "left top",
            },
          },
        },
        floating: {
          container: {
            _focusWithin: {
              label: {
                ...activeLabelStyles,
              },
            },
            "input:not(:placeholder-shown) + label, .chakra-select__wrapper + label":
              {
                transform: "scale(0.85) translateY(-24px)",
              },
            "select:not(:placeholder-shown) + label, .chakra-select__wrapper + label":
              {
                transform: "scale(0.85) translateY(-24px)",
              },
            _dark: {
              label: {
                backgroundColor: "gray.700",
              },
            },
            label: {
              top: 0,
              left: 0,
              zIndex: 2,
              position: "absolute",
              backgroundColor: "white",
              pointerEvents: "none",
              mx: 3,
              px: 1,
              my: 2,
              transformOrigin: "left top",
            },
          },
        },
      },
    },
  },
});
