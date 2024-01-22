import { createContext, useContext, useEffect, useState } from "react";
import { Box, Center, useColorMode } from "@chakra-ui/react";
import { Link } from "../../types/Link";
import { Venue } from "../../types/Venue";
import VenueHeader from "./VenueHeader";
import VenueLinks from "./VenueLinks";
import VenueContact from "./VenueContact";
import { ReviewModal } from "./ReviewModal";
import { ExternalOffer } from "../../types/ExternalOffer";
import VenueExternalOffers from "./VenueExternalOffers";
import FrontPageServices from "../services/FrontPageServices";
import { CallToAction } from "../../types/CallToAction";
import { useServices } from "../../hooks/useServices";
import FrontPageService from "../services/FrontPageService";
import { Service } from "../../types/Service";

interface IVenueLanding {
  venueData: Venue | null;
  links: Link[];
  externalOffers: ExternalOffer[];
  callToActions: CallToAction[];
  inPreviewMode?: boolean;
  nfcId?: string;
}

const VenueLandingContext = createContext<
  IVenueLanding & {
    isReviewModalOpen: boolean;
    setIsReviewModalOpen: (val: boolean) => void;
  }
>({
  venueData: null,
  links: [],
  externalOffers: [],
  callToActions: [],
  inPreviewMode: false,
  isReviewModalOpen: false,
  setIsReviewModalOpen: () => {},
});

export const useVenueData = () => useContext(VenueLandingContext);

export default function VenueLanding({
  venueData,
  links,
  externalOffers,
  callToActions,
  inPreviewMode,
  nfcId,
}: IVenueLanding) {
  const { setColorMode } = useColorMode();

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  useEffect(() => {
    if (!venueData?.default_theme) return;
    setColorMode(venueData?.default_theme);
  }, []);
  return (
    <Box w="full" h="full">
      <Box maxW="3xl" mx="auto">
        <VenueLandingContext.Provider
          value={{
            venueData,
            links,
            nfcId,
            isReviewModalOpen,
            externalOffers,
            callToActions,
            setIsReviewModalOpen,
          }}
        >
          <VenueHeader />
          <FrontPageServicesContainer venueId={venueData?.id || ""} />
          <FrontPageServices venueId={venueData?.id || ""} />
          <VenueContact nfcId={nfcId || ""} />
          <VenueLinks />
          <ReviewModal />
        </VenueLandingContext.Provider>
      </Box>
    </Box>
  );
}

function FrontPageServicesContainer({ venueId }: { venueId: string }) {
  const { services } = useServices("_", venueId);

  const liveServices: Service[] = services.filter((s) => s.is_live);

  return (
    <Box mx="auto" maxW="md">
      {liveServices.map((s) => (
        <Center p={4} w="full" key={s.id}>
          <FrontPageService service={s} key={s.id} />
        </Center>
      ))}
    </Box>
  );
}
