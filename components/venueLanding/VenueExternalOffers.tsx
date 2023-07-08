import {
  Box,
  HStack,
  Text,
  useColorModeValue,
  Image,
  Button,
  Link,
  Spacer,
  ButtonGroup,
  Center,
} from "@chakra-ui/react";
import { FaLink, FaPhoneAlt, FaViber, FaWhatsapp } from "react-icons/fa";
import { useVenueData } from ".";
import { ExternalOffer } from "../../types/ExternalOffer";

export default function VenueExternalOffers() {
  const { externalOffers } = useVenueData();
  const liveOffers = externalOffers.filter((offer) => offer.is_live);
  if (!liveOffers || liveOffers.length === 0) return null;

  return (
    <Box p={4}>
      {liveOffers.map((offer) => (
        <VenueOfferCard offer={offer} key={offer.id} />
      ))}
    </Box>
  );
}

export function VenueOfferCard({ offer }: { offer: ExternalOffer }) {
  const borderColor = useColorModeValue("blackAlpha.200", "whiteAlpha.200");
  const bgColor = useColorModeValue("gray.50", "gray.700");
  const phoneLinkBg = useColorModeValue("gray.100", "gray.600");
  return (
    <Box
      w="full"
      border="1px"
      borderColor={borderColor}
      rounded="lg"
      bg={bgColor}
      p={4}
      my={4}
      textAlign="center"
    >
      <Text textAlign="center" fontWeight="bold" fontSize="2xl">
        {offer.title}
      </Text>
      {offer.images && offer.images.length === 1 && (
        <Center my={4}>
          <Box
            w="265px"
            h="full"
            position="relative"
            display="flex"
            alignItems="center"
            justifyContent="center"
            scrollSnapAlign="center"
          >
            <Image
              src={offer.images[0]}
              objectFit="cover"
              minW="100%"
              minH="100%"
            />
          </Box>
        </Center>
      )}
      {offer.images && offer.images.length > 1 && (
        <HStack
          h="150px"
          w="full"
          overflowY="hidden"
          overflowX="auto"
          scrollSnapType="x mandatory"
        >
          <HStack h="full">
            {offer.images?.map((image) => (
              <Box
                key={image}
                w="265px"
                h="full"
                position="relative"
                display="flex"
                alignItems="center"
                justifyContent="center"
                scrollSnapAlign="center"
              >
                <Image src={image} objectFit="cover" minW="100%" minH="100%" />
              </Box>
            ))}
          </HStack>
        </HStack>
      )}
      {offer.url && (
        <a href={`${offer.url}`} target="_blank">
          <Button leftIcon={<FaLink />} w="full" my={3}>
            Website
          </Button>
        </a>
      )}
      {offer.phone && (
        <HStack bg={phoneLinkBg} rounded="md" pl={4}>
          <Link
            href={`tel:${offer.phone}`}
            display="flex"
            alignItems="center"
            gap={2}
            fontSize="lg"
            flex={1}
          >
            <FaPhoneAlt />
            {offer.phone}
          </Link>
          <Button
            colorScheme="purple"
            as="a"
            href={`viber://add?number=${offer.phone}`}
            borderRightRadius="0px"
          >
            <FaViber />
          </Button>
          <Button
            colorScheme="green"
            as="a"
            href={`https://api.whatsapp.com/send?phone=${offer.phone}`}
            borderLeftRadius="0px"
            style={{ marginLeft: "0px" }}
          >
            <FaWhatsapp />
          </Button>
        </HStack>
      )}
    </Box>
  );
}
