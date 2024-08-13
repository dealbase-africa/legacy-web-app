import { ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Heading,
  Link,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Text,
} from "@chakra-ui/react";
import { useScrappedArticles } from "@dealbase/client";
import { ChangeEvent, useEffect, useState } from "react";
import { DashboardLayout } from "src/layouts/DashboardLayout";

export const Scrapper = () => {
  const [number, setNumber] = useState(7);
  const [unit, setUnit] = useState("days");

  const { sources, refetch } = useScrappedArticles(number, unit);

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [number, unit]);

  const handleNumberChange = (_: string, valueAsNumber: number) => {
    setNumber(valueAsNumber);
  };

  const handleUnitChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    console.log("value:", value);

    setUnit(value);
  };

  return (
    <DashboardLayout>
      <Box _dark={{ bg: "gray.900" }} bg="gray.50" p={8} rounded={16}>
        <Flex justifyContent="space-between" alignItems="center">
          <Heading as="h1">Latest Articles</Heading>
          <Flex gap={2}>
            <NumberInput
              onChange={handleNumberChange}
              value={number}
              max={30}
              min={1}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <Select
              onChange={handleUnitChange}
              placeholder="Select a unit"
              title="Select a unit"
              value={unit}
            >
              <option value="days">days</option>
              <option value="weeks">weeks</option>
              <option value="months">months</option>
            </Select>
          </Flex>
        </Flex>
      </Box>

      <Accordion
        mt={2}
        rounded={16}
        p={8}
        _dark={{ bg: "gray.900" }}
        bg="gray.50"
        defaultIndex={[0]}
        allowMultiple
        allowToggle
      >
        {sources?.map((source) => (
          <AccordionItem key={source.title}>
            <AccordionButton>
              <Text flex="1" align="left" px={8} fontWeight="bold">
                {source.title}
              </Text>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel display="flex" flexDir="column" gap={2}>
              {source.data?.map((article: any) => (
                <Link
                  p={2}
                  px={6}
                  ml={8}
                  rounded={16}
                  color="gray.800"
                  _hover={{
                    bg: "gray.600",
                    textDecoration: "none",
                    color: "white",
                  }}
                  bg="gray.200"
                  _dark={{
                    _hover: {
                      bg: "gray.600",
                      color: "white",
                    },
                    bg: "gray.700",
                    color: "gray.300",
                  }}
                  href={article.postLink}
                  key={article.postLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Flex gap={4} alignItems="center">
                    <Text fontWeight="bold">{article.postTitle}</Text>
                    <ExternalLinkIcon w={3} h={3} />
                  </Flex>
                  <Text fontSize="xs">{article.postDate}</Text>
                </Link>
              ))}
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </DashboardLayout>
  );
};

export default Scrapper;

export { getServerSideProps } from "src/lib/Chakra";
