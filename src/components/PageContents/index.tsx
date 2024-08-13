import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useDisclosure,
  useMediaQuery,
} from "@chakra-ui/react";
import { useDeals, useInvestors } from "@dealbase/client";
import { filterDeals } from "@dealbase/core";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef } from "react";
import { DealDataView } from "src/components/DataView/DealDataView";
import { InvestorsDataView } from "src/components/DataView/Investors";
import { DataViz } from "src/components/DataViz";
import { Filters } from "src/components/Filters";
import { useDealflowStore } from "src/stores/dealflow";
import { useFilterStore } from "src/stores/filter";
import { shallow } from "zustand/shallow";
import { Logo } from "../Header/Logo";
import { useSubscribeModal } from "../Modals/useSubscribeModalComingSoon";

export function PageContents() {
  const [isLessThan768] = useMediaQuery("(max-width: 768px)");
  const setState = useDealflowStore((state) => state.setState);
  const { dealsFetched, investorsFetched } = useDealflowStore(
    (state) => ({
      dealsFetched: state.deals.length !== 0,
      investorsFetched: state.investors.length !== 0,
    }),
    shallow,
  );

  const filter = useFilterStore((state) => state.filter, shallow);

  const {
    deals,
    isLoading: isDealsLoading,
    isFetched: isDealsFetched,
  } = useDeals();

  if (isDealsFetched && !isDealsLoading && deals && !dealsFetched) {
    setState((currentState) => ({
      ...currentState,
      deals,
      filteredDeals: filterDeals(deals, filter),
    }));
  }

  const {
    investors,
    isLoading: isInvestorsLoading,
    isFetched: isInvestorsFetched,
  } = useInvestors();

  if (
    isInvestorsFetched &&
    !isInvestorsLoading &&
    investors &&
    !investorsFetched
  ) {
    setState((currentState) => ({
      ...currentState,
      investors,
      filteredInvestors: investors,
    }));
  }

  const tableRef = useRef<HTMLDivElement>(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    onOpen();
  }, []);

  const {
    SubscribeModal,
    onOpen: subscribeModalOnOpen,
    isOpen: subscribeModalIsOpen,
  } = useSubscribeModal();

  return (
    <Box
      display="flex"
      mx="auto"
      maxW="1920px"
      flexDirection="column"
      alignItems="center"
      p={isLessThan768 ? 4 : 16}
    >
      {subscribeModalIsOpen && <SubscribeModal />}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        closeOnOverlayClick={false}
        isCentered
        size="lg"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader display="flex">
            <span className="mr-2 whitespace-nowrap">🎉 Big News from</span>
            <span>
              <Logo />
            </span>
            <ModalCloseButton />
          </ModalHeader>
          <ModalBody>
            <h5 className="font-bold">
              We&apos;ve Been Hard at Work, and Something Exciting is Coming
              Your Way! 🚀
            </h5>
            <p className="mt-2">
              Over the past year, we&apos;ve gone back to the drawing board, all
              thanks to your invaluable feedback and our relentless pursuit for
              excellence. We&apos;ve meticulously reimagined DealBase.Africa to
              bring you an experience that&apos;s not just faster but also more
              intuitive, and—dare we say it—absolutely stunning!
            </p>
            <h5 className="mt-4 font-bold">What&apos;s New? 🔥</h5>
            <ul className="mt-2 flex list-disc flex-col gap-2 pl-4">
              <li>
                <span className="font-bold">Speed!</span> We&apos;ve
                turbo-charged our platform so you can find deals at lightning
                speed! 🚀
              </li>
              <li>
                <span className="font-bold">Intuitive Navigation! </span> Get
                the info you need, right when you need it! 🎯
              </li>
              <li>
                <span className="font-bold">Aesthetic Overhaul!</span> A more
                beautiful interface, designed with you in mind! 🎨
              </li>
              <li>
                <span className="font-bold">Optimized Search!</span> Finding the
                most useful information has never been easier! 🔍
              </li>
            </ul>
            <h5 className="mt-4 font-bold">Stay Tuned! </h5>
            <p className="mt-2">
              We can&apos;t wait to unveil the new and improved DealBase.Africa.
              Are you as excited as we are? It&apos;s a whole new world of
              deals, and it&apos;s coming your way soon! 🌟
            </p>
          </ModalBody>

          <ModalFooter>
            <p className="mr-2">Sign up to be the first to know</p>
            <Button
              colorScheme="green"
              size="sm"
              className="mr-2"
              onClick={() => {
                onClose();
                subscribeModalOnOpen();
              }}
            >
              Sign Up
            </Button>
            <Button size="sm" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <div className="flex gap-4">
        <div>
          <h1 className="mb-8 max-w-[500px] text-center text-3xl font-bold">
            Track the Latest in African Tech Fundraising
          </h1>
          <p></p>
        </div>
      </div>

      <Filters tableRef={tableRef} />

      <DataViz />

      <Tabs w="full" align="center" colorScheme="green" variant="solid-rounded">
        <TabList>
          <Tab>Deals</Tab>
          <Tab>Investors</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <DealDataView ref={tableRef} heading />
          </TabPanel>

          <TabPanel>
            <InvestorsDataView ref={tableRef} heading />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}

export default PageContents;
