import { motion } from "framer-motion";
import {
  Box,
  Center,
  HStack,
  Text,
  Button as CButton,
  useColorMode,
} from "@chakra-ui/react";
import { useVenueData } from "./";
import LogoButton from "../LogoButton";
import Button from "../Button";
import { BsLink45Deg } from "react-icons/bs";
import { TbChecklist } from "react-icons/tb";

export default function VenueHeader() {
  const { venueData, setIsReviewModalOpen } = useVenueData();
  return (
    <Box>
      <Box
        h="220px"
        w="full"
        bg={venueData?.background_color || "blue.400"}
        borderBottomRadius="3xl"
        position="relative"
      >
        <HStack
          position="absolute"
          top="0px"
          left="0px"
          w="full"
          h="50px"
          px="10px"
        >
          <LogoButton />
        </HStack>

        {venueData?.background_image && (
          <Box
            w="full"
            h="full"
            display="flex"
            alignItems="center"
            justifyContent="center"
            borderBottomRadius="3xl"
            overflow="hidden"
          >
            <img
              src={venueData?.background_image}
              style={{
                minWidth: "100%",
                minHeight: "100%",
                objectFit: "cover",
              }}
            />
          </Box>
        )}

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {venueData?.logo && (
            <Box
              w={["150px", "180px"]}
              h={["150px", "180px"]}
              borderRadius="full"
              bg="white"
              position="absolute"
              bottom="-30px"
              left="50%"
              transform="translateX(-50%)"
              overflow="hidden"
              display="flex"
              alignItems="center"
              justifyContent="center"
              border="4px"
              borderColor="whitesmoke"
            >
              <img
                style={{
                  minWidth: "100%",
                  minHeight: "100%",
                  objectFit: "cover",
                }}
                src={venueData?.logo}
                alt="vanue logo"
              />
            </Box>
          )}
        </motion.div>
      </Box>
      {venueData?.title && venueData?.title !== "" && (
        <Center mt="40px">
          <Text fontSize="3xl" fontWeight="bold">
            {venueData?.title}
          </Text>
        </Center>
      )}
      {venueData?.description && venueData?.description !== "" && (
        <Center mt="0px" mb="20px">
          <Text fontSize="xl">{venueData?.description}</Text>
        </Center>
      )}
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
          >
            {venueData?.cta_title !== "" ? venueData?.cta_title : "OPEN LINK"}
          </Button>
        </Center>
      )}
      {venueData?.show_review && (
        <Center mt="15px">
          <Button
            onClick={() => setIsReviewModalOpen(true)}
            w="full"
            maxW="sm"
            size="lg"
            rightIcon={<TbChecklist size={25} />}
          >
            Take our survey
          </Button>
        </Center>
      )}
    </Box>
  );
}
