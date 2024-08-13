import { ModalBody } from "@chakra-ui/react";
import { useEditDeal } from "@dealbase/client";
import { Deal } from "@dealbase/core";
import { memo, RefObject } from "react";
import { useForm } from "react-hook-form";
import { EditDealFormFields } from "src/components/Forms/Deals/EditDealFormFields";

interface Props {
  deal?: Deal;
  initialRef?: RefObject<HTMLInputElement> | null;
  onDone: () => void;
  renderActions: (isLoading: boolean) => JSX.Element;
}

const EditDealFormBase = ({ deal, renderActions, onDone }: Props) => {
  const { editDeal, status: editDealStatus } = useEditDeal(onDone);

  const { register, handleSubmit, control, getValues, setValue, watch } =
    useForm<Deal>({
      defaultValues: {
        ...deal,
      },
    });

  const onSubmit = async (data: Deal) => {
    const {
      pressRelease: { date, link },
      ...remainingDeal
    } = data;

    if (deal) {
      // await editDeal({
      //   ...remainingDeal,
      //   id: deal.id,
      //   // pressRelease: { date: new Date(date ?? "").toUTCString(), link },
      // });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ModalBody pb={6}>
        <EditDealFormFields
          register={register}
          control={control}
          getValues={getValues}
          setValue={setValue}
          watch={watch}
        />
      </ModalBody>

      {renderActions(editDealStatus === "pending")}
    </form>
  );
};

export const EditDealForm = memo(EditDealFormBase);
