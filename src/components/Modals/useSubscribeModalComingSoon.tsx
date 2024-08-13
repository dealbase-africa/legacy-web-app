import {
  Button,
  Flex,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { useSaveSubscriber } from "@dealbase/client";
import { Subscriber } from "@dealbase/db";
import { ComponentType, FormEvent, memo, useRef } from "react";

export interface SubscribeModalProps {
  onOpen: () => void;
  onClose: () => void;
  isOpen: boolean;
}

export const SubscribeModalBase = ({
  onClose,
  isOpen,
}: SubscribeModalProps) => {
  const initialRef = useRef<HTMLInputElement>(null);
  const { saveSubscriber, isPending } = useSaveSubscriber(onClose);

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const formValues = Object.fromEntries(formData);
    const newSubscriber = {
      ...formValues,
      type: "coming_soon",
    };

    saveSubscriber(newSubscriber as Subscriber);
  };

  return (
    <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Email List Signup</ModalHeader>
        <ModalCloseButton />

        <ModalBody pb={6}>
          <form id="emailListSignup" onSubmit={handleSubmit}>
            <FormControl mt={4}>
              <Input
                ref={initialRef}
                type="email"
                isRequired
                name="email"
                placeholder="Email"
              />
            </FormControl>
            <Flex gap={2} mt={4}>
              <FormControl>
                <Input type="text" name="firstname" placeholder="First Name" />
              </FormControl>
              <FormControl>
                <Input type="text" name="lastname" placeholder="Last Name" />
              </FormControl>
            </Flex>
            <FormControl mt={4}>
              <Input type="text" name="company" placeholder="Company" />
            </FormControl>
          </form>
        </ModalBody>

        <ModalFooter>
          <Button
            isLoading={isPending}
            loadingText="Submitting"
            type="submit"
            form="emailListSignup"
            colorScheme="green"
            mr={3}
          >
            Sign Up
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const SubscribeModal = memo(SubscribeModalBase);

export const useSubscribeModal = (): Pick<
  ReturnType<typeof useDisclosure>,
  "onOpen" | "isOpen"
> & { SubscribeModal: ComponentType } => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return {
    onOpen,
    isOpen,
    SubscribeModal: (props) => (
      <SubscribeModal
        {...props}
        onClose={onClose}
        onOpen={onOpen}
        isOpen={isOpen}
      />
    ),
  };
};
