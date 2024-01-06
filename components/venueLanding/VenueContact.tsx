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
import { BsEnvelope, BsLink45Deg, BsSave, BsTelephone } from "react-icons/bs";
import FooterSocials from "./FooterSocials";
import VCard from "vcard-creator";
import { FaLink, FaMapMarkerAlt, FaViber, FaWhatsapp } from "react-icons/fa";
import { TbChecklist } from "react-icons/tb";

export default function VenueContact({ nfcId }: { nfcId: string }) {
  const { venueData, links, setIsReviewModalOpen } = useVenueData();

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

    if (venueData?.website) {
      myVCard.addSocial(venueData?.website, "website");
    }

    let cardLink =
      process.env.NODE_ENV === "development"
        ? `http://localhost:3000/d/${nfcId}`
        : `https://ib-tourism.vercel.app/d/${nfcId}`;

    if (!nfcId) {
      cardLink =
        process.env.NODE_ENV === "development"
          ? `http://localhost:3000/venue/${venueData?.id}`
          : `https://ib-tourism.vercel.app/venue/${venueData?.id}`;
    }

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
      {venueData?.website && venueData?.website !== "" && (
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
            {venueData?.website}
          </Text>
          <Spacer />
          <a
            href={`${
              venueData?.website.startsWith("http")
                ? venueData?.website
                : "https://" + venueData?.website
            }`}
            target="_blank"
          >
            <CButton colorScheme="blackAlpha">
              <FaLink />
            </CButton>
          </a>
        </HStack>
      )}
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
      {venueData?.address && venueData?.address !== "" && (
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
            {venueData?.address}
          </Text>
          <Spacer />
          <a
            href={`https://maps.google.com/maps?q=${venueData?.address}`}
            target="_blank"
          >
            <Button>
              <FaMapMarkerAlt />
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
            gap={0}
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
            {venueData?.has_viber && (
              <a
                href={`viber://call?number=${venueData?.phone
                  .replace("+", "%2B")
                  .replaceAll(" ", "")}`}
              >
                <CButton colorScheme="purple">
                  <FaViber />
                </CButton>
              </a>
            )}
            {venueData?.has_whatsapp && (
              <a
                href={`https://api.whatsapp.com/send?phone=${venueData?.phone.replaceAll(
                  " ",
                  "",
                )}`}
              >
                <CButton colorScheme="green">
                  <FaWhatsapp />
                </CButton>
              </a>
            )}
            {/* {venueData?.address && venueData?.address !== "" && ( */}
            {/*   <HStack */}
            {/*     w="full" */}
            {/*     maxW="sm" */}
            {/*     h="40px" */}
            {/*     bg="gray.200" */}
            {/*     borderRadius="md" */}
            {/*     pl="10px" */}
            {/*     mb={3} */}
            {/*     mx="auto" */}
            {/*   > */}
            {/*     <Text isTruncated color="gray.700"> */}
            {/*       {venueData?.address} */}
            {/*     </Text> */}
            {/*     <Spacer /> */}
            {/*     <a */}
            {/*       href={`https://maps.google.com/maps?q=${venueData?.address}`} */}
            {/*     > */}
            {/*       <Button> */}
            {/*         <BsEnvelope /> */}
            {/*       </Button> */}
            {/*     </a> */}
            {/*   </HStack> */}
            {/* )} */}
          </HStack>
        </>
      )}
      {/* <FooterSocials /> */}
      {venueData?.show_cta && (
        <Center>
          <Button
            as="a"
            w="full"
            maxW="sm"
            size="lg"
            mx="auto"
            rightIcon={<BsLink45Deg size={25} />}
            href={`${venueData?.cta_link}`}
            target="_blank"
            mt={5}
            mb={4}
          >
            <span style={{ fontFamily: "Secular One" }}>
              {venueData?.cta_title !== "" ? venueData?.cta_title : "OPEN LINK"}
            </span>
          </Button>
        </Center>
      )}
      {venueData?.show_review && (
        <Center>
          <Button
            onClick={() => setIsReviewModalOpen(true)}
            w="full"
            maxW="sm"
            size="lg"
            rightIcon={<TbChecklist size={25} />}
          >
            <span style={{ fontFamily: "Secular One" }}>TAKE OUR SURVEY</span>
          </Button>
        </Center>
      )}
    </Box>
  );
}
