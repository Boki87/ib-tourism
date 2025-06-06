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
  const { venueData } = useVenueData();
  return (
    <Box>
      <Box
        h="220px"
        w="full"
        bg={venueData?.background_color || "blue.400"}
        borderBottomRadius="3xl"
        position="relative"
      >
        {/* <HStack */}
        {/*   position="absolute" */}
        {/*   top="0px" */}
        {/*   left="0px" */}
        {/*   w="full" */}
        {/*   h="50px" */}
        {/*   px="7px" */}
        {/* > */}
        {/*   <Box */}
        {/*     as="a" */}
        {/*     href="" */}
        {/*     rounded="lg" */}
        {/*     bg="black" */}
        {/*     p={1} */}
        {/*   > */}
        {/*     <LogoButton /> */}
        {/*   </Box> */}
        {/* </HStack> */}

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
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                }}
                src={venueData?.logo}
                alt="vanue logo"
              />
            </Box>
          )}
        </motion.div>
      </Box>
      {venueData?.show_title && venueData?.title && venueData?.title !== "" && (
        <Center mt="40px" mb={6} p={3}>
          <Text fontSize="3xl" fontWeight="bold" textAlign="center">
            {venueData?.title}
          </Text>
        </Center>
      )}
      {venueData?.description && venueData?.description !== "" && (
        <Center
          mt={!venueData.show_title ? "20px" : "0px"}
          mb="20px"
          textAlign="center"
        >
          <Text fontSize="xl" p={4} textAlign="center">
            {venueData?.description}
          </Text>
        </Center>
      )}
    </Box>
  );
}
