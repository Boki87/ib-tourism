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
import { Service } from "../../types/Service";
import ServiceDrawer from "./ServiceDrawer";
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { MdOutlineDragIndicator } from "react-icons/md";
import { CSS } from "@dnd-kit/utilities";

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
    handleDragEnd,
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
        <ServicesSortableContext items={services} onDragEnd={handleDragEnd}>
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
                  <Th maxW={{ base: "200px", md: "auto" }}>Title</Th>
                  <Th display={{ base: "none", md: "block" }}>Description</Th>
                  <Th maxW="100px">actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {services.map((service) => (
                  <ServiceDndTableItem
                    service={service}
                    onSetActive={(id: string) => {
                      console.log(id);
                      setActiveServiceId(id);
                    }}
                    onDelete={(id: string) => deleteService(id)}
                    key={service.id || ""}
                  />
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </ServicesSortableContext>
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

// dnd context component
interface ServicesSortableProps {
  items: Service[];
  children: React.ReactNode;
  onDragEnd({
    active,
    over,
  }: {
    active: { id: string };
    over: { id: string } | null;
  }): void;
}
function ServicesSortableContext({
  items,
  children,
  onDragEnd,
}: ServicesSortableProps) {
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10, // 10px
    },
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 300,
      tolerance: 5,
    },
  });

  const sensors = useSensors(mouseSensor, touchSensor);

  return (
    // @ts-ignore
    <DndContext sensors={sensors} onDragEnd={onDragEnd}>
      {/* @ts-ignore */}
      <SortableContext items={items}>{children}</SortableContext>
    </DndContext>
  );
}

// dnd draggable item
interface ServiceDndTableItemProps {
  service: Service;
  onSetActive: (id: string) => void;
  onDelete: (id: string) => void;
}

function ServiceDndTableItem({
  service,
  onSetActive,
  onDelete,
}: ServiceDndTableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    // @ts-ignore
    useSortable({ id: service.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Tr
      key={service.id}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <Td maxW={{ base: "200px", md: "auto" }}>
        <Box isTruncated display="flex" alignItems="center" gap={2}>
          <Box>
            <MdOutlineDragIndicator />
          </Box>
          <Text isTruncated>{service.title}</Text>
        </Box>
      </Td>
      <Td isTruncated display={{ base: "none", md: "block" }}>
        <Box isTruncated>
          {service?.description?.slice(0, 12).trim()}
          {service?.description && service?.description?.length > 12
            ? "..."
            : ""}
        </Box>
      </Td>
      <Td maxW={{ base: "auto", md: "100px" }}>
        <CButton
          mr={1}
          onClick={() => {
            console.log(111, service.id);
            onSetActive(service.id || "");
          }}
        >
          <FaEdit />
        </CButton>
        <CButton onClick={() => onDelete(service.id || "")}>
          <FaTrash />
        </CButton>
      </Td>
    </Tr>
  );
}
