import { AddIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Heading, Input } from "@chakra-ui/react";
import { useCrowdsourcedDeals } from "@dealbase/client";
import { CrowdsourcedDeal } from "@dealbase/db";
import { search } from "fast-fuzzy";
import React, { useEffect } from "react";
import { useCrowdsourcedDealsModal } from "src/components/Modals/useCrowdsourcedDealsModal";
import { useUserPermissions } from "src/hooks/useUserPermissions";
import { DashboardLayout } from "src/layouts/DashboardLayout";

export const CrowdsourcedDealsDashboardPage = () => {
  const { CrowdsourcedDealsModal, onOpen: onCrowdsourcedDealsModalOpen } =
    useCrowdsourcedDealsModal();

  const { permissions } = useUserPermissions();

  const { crowdsourced_deals, isLoading: crowdsourcedDealsLoading } =
    useCrowdsourcedDeals();

  const [searchTerm, setSearchTerm] = React.useState("");
  const [filteredCrowdsourcedDeals, setFilteredCrowdsourcedDeals] =
    React.useState<CrowdsourcedDeal[]>([]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchTerm(e.target.value);
  }

  useEffect(() => {
    if (searchTerm) {
      const filtered = search(searchTerm, crowdsourced_deals || [], {});
      setFilteredCrowdsourcedDeals(filtered);
    } else {
      setFilteredCrowdsourcedDeals(crowdsourced_deals || []);
    }
  }, [searchTerm, crowdsourced_deals]);

  return (
    <DashboardLayout>
      <Box _dark={{ bg: "gray.900" }} bg="gray.50" p={8} rounded={16}>
        <Flex justifyContent="space-between" alignItems="center">
          <Heading as="h1" mb={4}>
            Crowdsourced Deals
          </Heading>

          {permissions.includes("add:deals") && (
            <Button colorScheme="green" onClick={onCrowdsourcedDealsModalOpen}>
              Add A New Crowdsourced Deal
              <AddIcon ml={2} />
            </Button>
          )}
        </Flex>

        <Flex mt={4}>
          <Input
            placeholder="Search"
            value={searchTerm}
            onChange={handleChange}
          />
        </Flex>
      </Box>

      <CrowdsourcedDealsModal />
    </DashboardLayout>
  );
};

export default CrowdsourcedDealsDashboardPage;

export { getServerSideProps } from "src/lib/Chakra";
