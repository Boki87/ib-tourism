import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
  Box,
  Center,
  Spinner,
  Text,
  DrawerHeader,
  Button,
} from "@chakra-ui/react";
import { useServices } from "../../hooks/useServices";
import { ServiceCategory } from "../../types/ServiceCategory";
import FrontPageService from "./FrontPageService";

interface FrontPageServicesDrawerProps {
  activeServiceCategory: ServiceCategory | null;
  venueId: string;
  onClose: () => void;
}

export default function FrontPageServicesDrawer({
  activeServiceCategory,
  venueId,
  onClose,
}: FrontPageServicesDrawerProps) {
  const { loading, services } = useServices(
    activeServiceCategory?.id || "",
    venueId,
  );

  const liveServices = services.filter((s) => s.is_live);

  let content = (
    <Box>
      {liveServices.length > 1 && (
        <Box
          borderRadius="lg"
          bg="gray.100"
          shadow="sm"
          px={3}
          py={4}
          mb={10}
          textAlign="left"
        >
          <ul style={{ marginLeft: "20px" }}>
            {liveServices
              .filter((s) => s.title && s.title !== "")
              .map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`}>
                    <Text
                      fontWeight="bold"
                      fontSize="lg"
                      color="blue.700"
                      _hover={{ textDecoration: "underline" }}
                    >
                      {s.title}
                    </Text>
                  </a>
                </li>
              ))}
          </ul>
        </Box>
      )}
      {liveServices.map((s) => (
        <FrontPageService service={s} key={s.id} />
      ))}
    </Box>
  );

  if (liveServices.length === 0) {
    content = <Box>No services</Box>;
  }

  if (loading) {
    content = (
      <Center w="full" h="full">
        <Spinner size="lg" color="blue.500" />
      </Center>
    );
  }
  return (
    <Drawer
      isOpen={!!activeServiceCategory}
      onClose={onClose}
      placement={"right"}
      size={["full", "md"]}
      isFullHeight
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader>
          <Text fontWeight="bold" fontSize="2xl">
            {activeServiceCategory?.title}
          </Text>
          <DrawerCloseButton onClick={onClose} />
        </DrawerHeader>
        <DrawerBody overflowY="auto" scrollBehavior="smooth">
          <Box maxW="lg" mx="auto" pb="80px">
            {content}
          </Box>
        </DrawerBody>
        <Button
          onClick={onClose}
          colorScheme="blue"
          position="fixed"
          bottom="85px"
          right="0px"
          h="50px"
          borderTopLeftRadius="25px"
          borderBottomLeftRadius="25px"
          borderBottomRightRadius="0px"
          borderTopRightRadius="0px"
          zIndex="100"
          shadow="lg"
        >
          Back
        </Button>
      </DrawerContent>
    </Drawer>
  );
}
