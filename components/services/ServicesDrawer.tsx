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
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import Button from "../Button";
import ServiceDrawer from "./ServiceDrawer";
import { services as servicesOptions } from "./config";
import { useServices } from "../../hooks/useServices";
import { FaEdit, FaTrash } from "react-icons/fa";
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { Service } from "../../types/Service";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MdOutlineDragIndicator } from "react-icons/md";
import { ServiceCategory } from "../../types/ServiceCategory";
import IconSelector from "../IconSelector/IconSelector";
import { supabase } from "../../libs/supabase";

interface ServicesDrawerProps {
  activeServiceCategory: ServiceCategory | null;
  onClose: () => void;
  venueId: string;
}

export default function ServicesDrawer({
  activeServiceCategory,
  onClose,
  venueId,
}: ServicesDrawerProps) {
  const [activeServiceId, setActiveServiceId] = useState<string | null>(null);
  const [category, setCategory] = useState<ServiceCategory | null>(null);

  const {
    fetchServices,
    loading,
    services,
    setServices,
    addService,
    deleteService,
    handleDragEnd,
  } = useServices(activeServiceCategory?.id || "", venueId);

  async function onCategoryChangeHandler(
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
    const { value, name } = e.target;
    setCategory((prev) => ({
      ...(prev as ServiceCategory),
      [name]: value,
    }));
  }

  async function iconChangeHandler(icon: string) {
    console.log("Icons changed to ", icon);
    setCategory((prev) => ({
      ...(prev as ServiceCategory),
      icon,
    }));

    if (!activeServiceCategory) return;
    const { error } = await supabase
      .from("service_categories")
      .update({ icon })
      .match({ id: activeServiceCategory.id });

    if (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    setCategory(activeServiceCategory);
    if (!activeServiceCategory) {
      setActiveServiceId(null);
    }
  }, [activeServiceCategory]);

  useEffect(() => {
    let t = setTimeout(async () => {
      if (!activeServiceCategory || !category?.title) return;
      const { error } = await supabase
        .from("service_categories")
        .update({ title: category.title })
        .match({ id: activeServiceCategory.id });

      if (error) {
        console.error(error);
      }
    }, 500);
    return () => clearTimeout(t);
  }, [category?.title]);

  return (
    <>
      <Drawer
        isOpen={!!activeServiceCategory}
        onClose={onClose}
        placement={"right"}
        size="lg"
      >
        <DrawerOverlay />
        <DrawerContent borderLeftRadius="md">
          <DrawerCloseButton onClick={onClose} />
          <DrawerBody p="10px" pb="60px" mt="50px" overflowY="auto">
            <Text fontSize="xl" mb={5} textAlign="center">
              <strong>Title:</strong> {category?.title}
            </Text>
            <HStack alignItems="flex-start">
              <Box>
                <IconSelector
                  icon={category?.icon || ""}
                  onSelect={iconChangeHandler}
                />
              </Box>
              <FormControl mb={4}>
                <FormLabel>Service Category Title</FormLabel>
                <Input
                  name="title"
                  type="text"
                  placeholder="Please enter category title"
                  onInput={onCategoryChangeHandler}
                  value={category?.title || ""}
                  variant="filled"
                />
              </FormControl>
            </HStack>

            <HStack justifyContent="center" mt={3}>
              <Button
                onClick={() => addService(false)}
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
              <ServicesSortableContext
                items={services}
                onDragEnd={handleDragEnd}
              >
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
                        <Th display={{ base: "none", md: "block" }}>
                          Description
                        </Th>
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
          </DrawerBody>
          {activeServiceId && (
            <ServiceDrawer
              activeService={activeServiceId}
              onClose={() => {
                setActiveServiceId(null);
                fetchServices();
              }}
              onUpdate={() => fetchServices()}
            />
          )}
        </DrawerContent>
      </Drawer>
    </>
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
