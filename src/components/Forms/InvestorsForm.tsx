import { ModalBody, useToast } from "@chakra-ui/react";
import { useEditInvestor, useSaveInvestor } from "@dealbase/client";
import { Investor } from "@dealbase/core";
import { RefObject } from "react";
import { useForm } from "react-hook-form";
import { InvestorsFormFields } from "./InvestorsFormFields";

interface Props {
  investor?: Investor;
  initialRef?: RefObject<HTMLInputElement> | null;
  onDone: () => void;
  renderActions: (isLoading: boolean) => JSX.Element;
}

export const InvestorsForm = ({ investor, renderActions, onDone }: Props) => {
  const toast = useToast();

  const {
    saveInvestor,
    error,
    isPending: investorSaveLoading,
    isError,
  } = useSaveInvestor();

  const {
    editInvestor,
    error: editError,
    isPending: investorEditLoading,
  } = useEditInvestor(onDone);

  const { register, handleSubmit, getValues, setValue } = useForm<Investor>({
    defaultValues: {
      ...investor,
    },
  });

  const onSubmit = async (data: Investor) => {
    if (investor) {
      await editInvestor({
        ...data,
      });
    } else {
      await saveInvestor({
        ...data,
      });

      if (!investorSaveLoading && !isError) {
        toast({
          title: "Investor Added.",
          description: `${data.investor.name} has been added to the database.`,
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      }
    }

    if (
      ((!investorEditLoading || !investorEditLoading) && isError) ||
      editError
    ) {
      return toast({
        title: "An error occurred.",
        description: `${(error as Error).message}`,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }

    onDone();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ModalBody pb={6}>
        <InvestorsFormFields
          getValues={getValues}
          setValue={setValue}
          register={register}
        />
      </ModalBody>

      {renderActions(investorSaveLoading || investorEditLoading)}
    </form>
  );
};
