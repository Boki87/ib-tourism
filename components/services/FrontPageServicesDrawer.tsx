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
} from "@chakra-ui/react";
import { useServices } from "../../hooks/useServices";
import FrontPageService from "./FrontPageService";

interface FrontPageServicesDrawerProps {
  activeServiceType: string;
  venueId: string;
  onClose: () => void;
}

export default function FrontPageServicesDrawer({
  activeServiceType,
  venueId,
  onClose,
}: FrontPageServicesDrawerProps) {
  const {
    fetchServices,
    loading,
    services,
    setServices,
    addService,
    deleteService,
  } = useServices(activeServiceType, venueId);

  const liveServices = services.filter((s) => s.is_live);

  let content = (
    <Box>
      {liveServices.length > 1 && (
        <Box borderRadius="lg" bg="gray.100" shadow="sm" px={3} py={4} mb={10}>
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
      isOpen={!!activeServiceType}
      onClose={onClose}
      placement={"right"}
      size={["full", "md"]}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader>
          <Text textTransform="capitalize" fontWeight="bold" fontSize="2xl">
            {activeServiceType.replaceAll("_", " ")}
          </Text>
          <DrawerCloseButton onClick={onClose} />
        </DrawerHeader>
        <DrawerBody overflowY="auto" scrollBehavior="smooth">
          <Box maxW="lg" mx="auto">
            {content}
          </Box>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
