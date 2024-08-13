import { Flex, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { Investor } from "@dealbase/core";
import { useEffect } from "react";
import {
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import { ImageUploader } from "../ImageUploader";

interface Props {
  register: UseFormRegister<Investor>;
  getValues: UseFormGetValues<Investor>;
  setValue: UseFormSetValue<Investor>;
}

export const InvestorsFormFields = ({
  register,
  getValues,
  setValue,
}: Props) => {
  useEffect(() => {
    register("investor.logo");
  }, [register]);

  return (
    <>
      <Flex w="full" alignItems="center" justifyContent="center" gap={4}>
        <FormControl>
          <FormLabel>Name</FormLabel>
          <Input {...register("investor.name")} placeholder="Name" />
        </FormControl>

        <ImageUploader
          value={getValues().investor.logo || null}
          onChange={(image) => setValue("investor.logo", image)}
        />
      </Flex>

      <FormControl mt={4}>
        <FormLabel>Website</FormLabel>
        <Input
          type="url"
          {...register("investor.website")}
          placeholder="Website"
        />
      </FormControl>
    </>
  );
};
