import { useEffect, useState } from "react";
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
  Text,
  HStack,
  Button as CButton,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Box,
} from "@chakra-ui/react";
import Button from "../Button";
import ServiceDrawer from "./ServiceDrawer";
import { services as servicesOptions } from "./config";
import { useServices } from "../../hooks/useServices";
import { FaEdit, FaTrash } from "react-icons/fa";

interface ServicesDrawerProps {
  activeServiceType: string | null;
  onClose: () => void;
  venueId: string;
}

export default function ServicesDrawer({
  activeServiceType,
  onClose,
  venueId,
}: ServicesDrawerProps) {
  const serviceTitle = servicesOptions.find(
    (s) => s.key === activeServiceType
  )?.label;

  const [activeServiceId, setActiveServiceId] = useState<string | null>(null);

  const {
    fetchServices,
    loading,
    services,
    setServices,
    addService,
    deleteService,
  } = useServices(activeServiceType, venueId);

  useEffect(() => {
    if (!activeServiceType) {
      setActiveServiceId(null);
    }
  }, [activeServiceType]);

  return (
    <>
      <Drawer
        isOpen={!!activeServiceType}
        onClose={onClose}
        placement={"right"}
        size="lg"
      >
        <DrawerOverlay />
        <DrawerContent borderLeftRadius="md">
          <DrawerCloseButton onClick={onClose} />
          <DrawerBody p="10px" pb="60px" mt="50px" overflowY="auto">
            <Text fontSize="2xl" textAlign="center">
              Services for{" "}
              <strong style={{ textTransform: "uppercase" }}>
                {serviceTitle}
              </strong>
            </Text>
            <HStack justifyContent="center" mt={3}>
              <Button
                onClick={addService}
                leftIcon={<span style={{ fontSize: "20px" }}>+</span>}
              >
                Add service
              </Button>
            </HStack>
            {!services ||
              (services.length === 0 && (
                <Text mt={8} textAlign="center">
                  No items for this category
                </Text>
              ))}

            {services && services.length > 0 && (
              <TableContainer>
                <Table
                  variant="simple"
                  border="1px"
                  borderColor="gray.100"
                  borderRadius="lg"
                  mt={5}
                >
                  <Thead>
                    <Tr>
                      <Th maxW="200px">Title</Th>
                      <Th>Description</Th>
                      <Th maxW="100px">actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {services.map((service) => (
                      <Tr key={service.id}>
                        <Td maxW="100px" isTruncated>
                          {service.title}
                        </Td>
                        <Td>
                          <Box>
                            {service?.description?.slice(0, 12).trim()}
                            {service?.description &&
                            service?.description?.length > 12
                              ? "..."
                              : ""}
                          </Box>
                        </Td>
                        <Td maxW={{ base: "auto", md: "100px" }}>
                          <CButton
                            mr={1}
                            onClick={() => setActiveServiceId(service.id || "")}
                          >
                            <FaEdit />
                          </CButton>
                          <CButton
                            onClick={() => deleteService(service.id || "")}
                          >
                            <FaTrash />
                          </CButton>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            )}
          </DrawerBody>
          {activeServiceId && (
            <ServiceDrawer
              activeService={activeServiceId}
              onClose={() => setActiveServiceId(null)}
              onUpdate={() => fetchServices()}
            />
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}
