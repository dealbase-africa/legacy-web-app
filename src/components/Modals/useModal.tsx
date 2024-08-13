import { useDisclosure, UseDisclosureReturn } from "@chakra-ui/react";
import { ComponentType, memo, MemoExoticComponent } from "react";

export type PropsWithDisclosure<T> = T & Partial<UseDisclosureReturn>;

export const useModal = <T,>(
  Modal: ComponentType<T>,
): Pick<ReturnType<typeof useDisclosure>, "onOpen" | "isOpen" | "onClose"> & {
  Modal: MemoExoticComponent<(props: T) => JSX.Element>;
} => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const MemoModal = (props: T) => (
    <Modal {...props} isOpen={isOpen} onClose={onClose} />
  );

  return {
    Modal: memo(MemoModal),
    onOpen,
    isOpen,
    onClose,
  };
};
