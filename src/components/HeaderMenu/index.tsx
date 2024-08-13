import { useAuth0 } from "@auth0/auth0-react";
import {
  Avatar,
  Box,
  Link as ChakraLink,
  Code,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useMediaQuery,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { ColorModeToggle } from "src/components/ColorModeToggle";
import { Type, useSubscribeModal } from "../Modals/useSubscribeModal";
import { MobileMenu } from "./components/MobileMenu";
import { SocialsMenu } from "./components/SocialsMenu";
import { SubscribeMenu } from "./components/SubscribeMenu";

interface Props {
  withSignIn?: boolean;
}

export const HeaderMenu = ({ withSignIn }: Props) => {
  const { SubscribeModal, onOpen, isOpen } = useSubscribeModal();
  const [type, setType] = useState<Type>("investor");
  const [isLessThan768] = useMediaQuery("(max-width: 768px)");

  const { user, logout, isAuthenticated, loginWithPopup } = useAuth0();
  const clientId = btoa(encodeURIComponent(user?.sub ?? ""));

  const { pathname } = useRouter();

  return (
    <>
      {isOpen && <SubscribeModal type={type} />}

      {isLessThan768 ? (
        <Flex gap={2} alignItems="center">
          <ColorModeToggle ml={2} />
          <MobileMenu
            withSignIn={withSignIn}
            onOpen={onOpen}
            setType={setType}
          />
        </Flex>
      ) : (
        <Flex gap={6} alignItems="center">
          {isAuthenticated && (
            <>
              <Link
                passHref
                href={`/embed-designer/${clientId}`}
                as={`/embed-designer/${clientId}`}
              >
                <ChakraLink>Embed Designer</ChakraLink>
              </Link>
              {!pathname.match(/^\/dashboard.*/) ? (
                <Link
                  passHref
                  href="/dashboard/dashboard"
                  as="/dashboard/dashboard"
                >
                  <ChakraLink>Dashboard</ChakraLink>
                </Link>
              ) : (
                <Link passHref href="/" as="/">
                  <ChakraLink>Home</ChakraLink>
                </Link>
              )}
            </>
          )}
          <SubscribeMenu setType={setType} onOpen={onOpen} />
          <SocialsMenu />
          <Box>
            {isAuthenticated ? (
              <Menu>
                <MenuButton
                  as={IconButton}
                  aria-label="Options"
                  icon={
                    <Avatar size="sm" name={user?.name} src={user?.picture} />
                  }
                  variant="outline"
                />
                <MenuList>
                  <MenuItem>
                    <Code>{user?.email}</Code>
                  </MenuItem>
                  <MenuItem
                    onClick={() =>
                      logout({
                        logoutParams: {
                          returnTo: window.location.origin + "/signin",
                        },
                      })
                    }
                  >
                    Sign Out
                  </MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <>
                {withSignIn && (
                  <Link passHref href="#">
                    <ChakraLink
                      ml={2}
                      variant="link"
                      onClick={() => loginWithPopup()}
                    >
                      Sign In
                    </ChakraLink>
                  </Link>
                )}
              </>
            )}
            <ColorModeToggle ml={2} />
          </Box>
        </Flex>
      )}
    </>
  );
};
