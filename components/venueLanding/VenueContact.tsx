import {
  Box,
  Center,
  HStack,
  Spacer,
  Text,
  Button as CButton,
} from "@chakra-ui/react";
import Button from "../Button";
import { useVenueData } from "./";
import { BsEnvelope, BsSave, BsTelephone } from "react-icons/bs";
import FooterSocials from "./FooterSocials";
import VCard from "vcard-creator";
import { FaViber, FaWhatsapp } from "react-icons/fa";

export default function VenueContact() {
  const { venueData, links, nfcId } = useVenueData();

  async function saveToContacts() {
    const myVCard = new VCard();

    myVCard.addName("", venueData?.title);

    if (venueData?.phone && venueData?.phone != "") {
      myVCard.addPhoneNumber(venueData?.phone);
    }
    if (venueData?.email && venueData?.email != "") {
      myVCard.addEmail(venueData?.email);
    }

    myVCard.addJobtitle(venueData?.description ?? "");

    const cardLink =
      process.env.NODE_ENV === "development"
        ? `http://localhost:3000/d/${nfcId}`
        : `${process.env.NEXT_PUBLIC_VERCEL_URL}/d/${nfcId}`;
    myVCard.addURL(cardLink);

    links.forEach((link) => {
      if (link.is_active) {
        myVCard.addSocial(link.url ?? "", link.type ?? "");
      }
    });

    async function getBase64FromImageUrl(url: string): Promise<string> {
      const response = await fetch(url);
      const blob = await response.blob();

      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            resolve(reader.result);
          } else {
            reject(new Error("Failed to convert image to Base64"));
          }
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    }

    if (venueData?.logo) {
      const imageBase64 = await getBase64FromImageUrl(venueData.logo);
      console.log(imageBase64);
      myVCard.addPhoto(imageBase64.split("base64,")[1], "JPEG");
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
          w="full"
          maxW="sm"
          textTransform="uppercase"
          rightIcon={<BsSave />}
        >
          <span style={{ fontFamily: "Secular One" }}>Save to contacts</span>
        </Button>
      </Center>
      {venueData?.email && venueData?.email !== "" && (
        <HStack
          w="full"
          maxW="sm"
          h="40px"
          bg="gray.200"
          borderRadius="md"
          pl="10px"
          mb={3}
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
        <>
          <HStack
            w="full"
            maxW="sm"
            h="40px"
            bg="gray.200"
            borderRadius="md"
            pl="10px"
            mx="auto"
            mb={3}
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
          <HStack
            w="full"
            maxW="sm"
            h="40px"
            bg="gray.200"
            borderRadius="md"
            pl="10px"
            mx="auto"
            mb={3}
          >
            <Text isTruncated color="gray.700">
              {venueData?.phone}
            </Text>
            <Spacer />
            <a href={`viber://call?number=${venueData?.phone}`}>
              <CButton colorScheme="purple">
                <FaViber />
              </CButton>
            </a>
          </HStack>
          <HStack
            w="full"
            maxW="sm"
            h="40px"
            bg="gray.200"
            borderRadius="md"
            pl="10px"
            mx="auto"
            mb={3}
          >
            <Text isTruncated color="gray.700">
              {venueData?.phone}
            </Text>
            <Spacer />
            <a href={`https://api.whatsapp.com/send?phone=${venueData?.phone}`}>
              <CButton colorScheme="green">
                <FaWhatsapp />
              </CButton>
            </a>
          </HStack>
        </>
      )}
      {/* <FooterSocials /> */}
    </Box>
  );
}
