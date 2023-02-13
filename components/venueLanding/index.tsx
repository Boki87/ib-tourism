import { createContext, useContext, useEffect } from "react";
import { Box, useColorMode } from "@chakra-ui/react";
import { Link } from "../../types/Link";
import { Venue } from "../../types/Venue";
import VenueHeader from "./VenueHeader";
import VenueLinks from "./VenueLinks";
import VenueContact from "./VenueContact";

interface IVenueLanding {
  venueData: Venue | null;
  links: Link[];
  inPreviewMode?: boolean;
  nfcId?: string;
}

const VenueLandingContext = createContext<IVenueLanding>({
  venueData: null,
  links: [],
  inPreviewMode: false,
});

export const useVenueData = () => useContext(VenueLandingContext);

export default function VenueLanding({
  venueData,
  links,
  inPreviewMode,
  nfcId,
}: IVenueLanding) {
  const { setColorMode } = useColorMode();

  useEffect(() => {
    if (!venueData?.default_theme) return;
    setColorMode(venueData?.default_theme);
  }, []);
  return (
    <Box w="full" h="full">
      <Box maxW="3xl" mx="auto">
        <VenueLandingContext.Provider value={{ venueData, links, nfcId }}>
          <VenueHeader />
          <VenueLinks />
          <VenueContact />
        </VenueLandingContext.Provider>
      </Box>
    </Box>
  );
}
