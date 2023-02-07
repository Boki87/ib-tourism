import { Box, Center, HStack, Spacer, Text } from "@chakra-ui/react";
import Button from "../Button";
import { useVenueData } from "./";
import { BsEnvelope, BsSave, BsTelephone } from "react-icons/bs";
import FooterSocials from "./FooterSocials";
import VCard from "vcard-creator";

export default function VenueContact() {
  const { venueData } = useVenueData();

  function saveToContacts() {
    const myVCard = new VCard();

    myVCard.addName(venueData?.title, "", venueData?.description);

    if (venueData?.logo && venueData?.logo != "") {
      myVCard.addPhotoURL(venueData?.logo);
    }
    if (venueData?.phone && venueData?.phone != "") {
      myVCard.addPhoneNumber(venueData?.phone);
    }
    if (venueData?.email && venueData?.email != "") {
      myVCard.addEmail(venueData?.email);
    }

    const blob = new Blob([myVCard.toString()], { type: "text/vcard" });
    const elem = window.document.createElement("a");
    elem.href = window.URL.createObjectURL(blob);
    elem.download = "vcard.vcf";
    document.body.appendChild(elem);
    elem.click();
    document.body.removeChild(elem);
  }

  return (
    <Box px="20px" pb="40px">
      <Center mb="30px">
        <Button
          onClick={saveToContacts}
          size="lg"
          textTransform="uppercase"
          rightIcon={<BsSave />}
        >
          Save to contacts
        </Button>
      </Center>
      {venueData?.email && venueData?.email !== "" && (
        <HStack
          w="full"
          h="40px"
          bg="gray.200"
          borderRadius="md"
          pl="10px"
          mb="10px"
          maxW="md"
          mx="auto"
        >
          <Text isTruncated color="gray.700">
            {venueData?.email}
          </Text>
          <Spacer />
          <a href={`mailto:${venueData?.email}`}>
            <Button>
              <BsEnvelope />
            </Button>
          </a>
        </HStack>
      )}
      {venueData?.phone && venueData?.phone !== "" && (
        <HStack
          w="full"
          h="40px"
          bg="gray.200"
          borderRadius="md"
          pl="10px"
          maxW="md"
          mx="auto"
        >
          <Text isTruncated color="gray.700">
            {venueData?.phone}
          </Text>
          <Spacer />
          <a href={`tel:${venueData?.phone}`}>
            <Button>
              <BsTelephone />
            </Button>
          </a>
        </HStack>
      )}
      <FooterSocials />
    </Box>
  );
}
