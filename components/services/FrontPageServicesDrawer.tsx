import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
  Box,
  Center,
  Spinner,
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

  let content = (
    <Box>
      {services.map((s) => (
        <FrontPageService service={s} key={s.id} />
      ))}
    </Box>
  );

  if (services.length === 0) {
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
      placement={"bottom"}
      size="full"
    >
      <DrawerOverlay />
      <DrawerContent borderLeftRadius="md">
        <DrawerCloseButton onClick={onClose} />
        <DrawerBody p="10px" pb="60px" mt="50px" overflowY="auto">
          {content}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
