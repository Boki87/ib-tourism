import {
  Box,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
  Button as CButton,
  Drawer,
  DrawerContent,
  DrawerBody,
  DrawerOverlay,
  HStack,
  Center,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { useServices } from "../../hooks/useServices";
import ServiceDrawer from "./ServiceDrawer";

interface ServicesSecitonFrontProps {
  venueId: string;
}

export default function ServicesSectionFront({
  venueId,
}: ServicesSecitonFrontProps) {
  const {
    fetchServices,
    loading,
    services,
    setServices,
    addService,
    deleteService,
  } = useServices("_", venueId);

  const [activeServiceId, setActiveServiceId] = useState<string | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <Box
      borderWidth={1}
      borderColor="gray.200"
      borderRadius="md"
      mb={5}
      p={4}
      position="relative"
    >
      <Text fontSize="2xl" fontWeight="bold" textAlign="center" mb={4}>
        Front Page Services
      </Text>
      <HStack justifyContent="right">
        <CButton onClick={addService} rightIcon={<FaPlus />}>
          ADD
        </CButton>
      </HStack>
      {services.length === 0 && (
        <Center>
          <Text>No front page services yet</Text>
        </Center>
      )}

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
                      {service?.description && service?.description?.length > 12
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
                    <CButton onClick={() => deleteService(service.id || "")}>
                      <FaTrash />
                    </CButton>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      )}
      <Drawer
        isOpen={!!activeServiceId}
        onClose={() => setActiveServiceId(null)}
        placement={"right"}
        size="lg"
      >
        <DrawerOverlay />
        <DrawerContent borderLeftRadius="md">
          <DrawerBody p="10px" pb="60px" mt="50px" overflowY="auto">
            <ServiceDrawer
              activeService={activeServiceId}
              onClose={() => {
                setActiveServiceId(null);
                fetchServices();
              }}
              onUpdate={() => {
                fetchServices();
              }}
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}
