import { Link } from "@chakra-ui/react";
import { Logo } from "src/components/Header/Logo";

export const Watermark = () => {
  return (
    <div className="items-flex-start opacity-8 fixed bottom-4 left-10 flex flex-col bg-gray-700 p-4 px-8">
      <p className="mr-2 w-[fit-content]">Powered by:</p>
      <Link w={36} overflow="none">
        <Logo />
      </Link>
    </div>
  );
};
