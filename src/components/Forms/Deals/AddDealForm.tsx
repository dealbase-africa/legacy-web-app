import { ModalBody } from "@chakra-ui/react";
import { useSaveDeal } from "@dealbase/client";
import { Deal } from "@dealbase/core";
import { memo, RefObject } from "react";
import { useForm } from "react-hook-form";
import { AddDealFormFields } from "src/components/Forms/Deals/AddDealFormFields";

interface Props {
  deal?: Deal;
  initialRef?: RefObject<HTMLInputElement> | null;
  onDone: () => void;
  renderActions: (isLoading: boolean) => JSX.Element;
}

const AddDealFormBase = ({ deal, renderActions, onDone }: Props) => {
  const { saveDeal, status: saveDealStatus } = useSaveDeal(onDone);

  const { register, handleSubmit, control, getValues, setValue, watch } =
    useForm<Deal>({
      defaultValues: {
        ...deal,
      },
    });

  const onSubmit = async (data: Deal) => {
    const {
      pressRelease: { date, link },
      investors,
    } = data;

    const newDeal = {
      ...data,
      pressRelease: { date: new Date(date ?? "").toUTCString(), link },
      investors: JSON.stringify(investors || []),
    };

    await saveDeal(newDeal as any);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ModalBody pb={6}>
        <AddDealFormFields
          register={register}
          control={control}
          getValues={getValues}
          setValue={setValue}
          watch={watch}
        />
      </ModalBody>

      {renderActions(saveDealStatus === "pending")}
    </form>
  );
};

export const AddDealForm = memo(AddDealFormBase);
