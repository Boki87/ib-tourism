import { createContext, useContext, useEffect, useState } from "react";
import { Box, useColorMode } from "@chakra-ui/react";
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
          <FrontPageServices venueId={venueData?.id || ""} />
          <VenueContact nfcId={nfcId || ""} />
          <VenueLinks />
          <ReviewModal />
        </VenueLandingContext.Provider>
      </Box>
    </Box>
  );
}
