import { Flex, FormControl, FormLabel, Switch } from "@chakra-ui/react";
import { Deal } from "@dealbase/core";
import { UseFormRegister } from "react-hook-form";

interface Props {
  register: UseFormRegister<Deal>;
}

export const DiversityFields = ({ register }: Props) => {
  return (
    <Flex gap={4} mb={2} flexDir={"column"}>
      <FormControl display="flex" alignItems="center">
        <FormLabel htmlFor="email-alerts" mb="0">
          Has female co-founder?
        </FormLabel>
        <Switch id="female_founder" {...register("company.femaleFounder")} />
      </FormControl>
      <FormControl display="flex" alignItems="center">
        <FormLabel htmlFor="email-alerts" mb="0">
          Has diverse founders?
        </FormLabel>
        <Switch
          id="diverse_founders"
          {...register("company.diverseFounders")}
        />
      </FormControl>
    </Flex>
  );
};
