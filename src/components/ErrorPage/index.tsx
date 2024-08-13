import { Link, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import { Logo } from "src/components/Header/Logo";

interface Props {
  children?: React.ReactNode;
}

export default function ErrorPage({ children }: Props) {
  return (
    <div className="mx-auto flex max-w-screen-xl flex-col items-center justify-center p-16">
      <Link w={36} overflow="none">
        <Logo />
      </Link>
      <Text as="h1" fontSize={18} fontWeight="bold">
        {children ?? "Something went wrong. Please try again later."}
      </Text>
      <Link as={NextLink} href="/">
        Go back to the dealbase.africa homepage
      </Link>
    </div>
  );
}
