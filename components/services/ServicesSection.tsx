import {
  Box,
  useColorModeValue,
  Text,
  HStack,
  Card,
  Button,
  StepIndicator,
  Spacer,
} from "@chakra-ui/react";
import ServicesDrawer from "./ServicesDrawer";
import Image from "next/image";
import { services } from "./config";
import { useEffect, useState } from "react";
import { supabase } from "../../libs/supabase";
import { ServiceCategory } from "../../types/ServiceCategory";
import { FaPlus } from "react-icons/fa";
import ServicesSectionCategoryCard from "./ServicesSectionCategoryCard";

interface ServicesSectionProps {
  venueId: string;
  userId: string;
}

export default function ServicesSection({
  venueId,
  userId,
}: ServicesSectionProps) {
  const [activeServiceCategory, setActiveServiceCategory] =
    useState<ServiceCategory | null>(null);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  async function fetchCategories() {
    const { data, error } = await supabase
      .from("service_categories")
      .select()
      .match({ venue_id: venueId })
      .order("order_index");

    if (error) return;

    setCategories(data as ServiceCategory[]);
  }

  async function addCategory() {
    if (!userId && !venueId) return;
    setIsAdding(true);
    try {
      const { data, error } = await supabase.from("service_categories").insert({
        owner_id: userId,
        venue_id: venueId,
        title: "Edit me!!!",
        icon: "FaHome",
      });
      if (error) throw Error("Could not add new category");
      await fetchCategories();
      setIsAdding(false);
    } catch (e) {
      setIsAdding(false);
      console.error(e);
    }
  }

  useEffect(() => {
    if (!venueId) return;
    //fetch categories
    fetchCategories();
  }, [venueId, activeServiceCategory]);

  return (
    <>
      <Box
        borderWidth={1}
        borderColor="gray.200"
        borderRadius="md"
        mb={5}
        p={4}
      >
        <HStack alignItems="center" mb={4}>
          <Text fontSize="2xl" fontWeight="bold" textAlign="center">
            Services
          </Text>
          <Spacer />
          <Button
            onClick={addCategory}
            isLoading={isAdding}
            rightIcon={<FaPlus />}
          >
            ADD
          </Button>
        </HStack>
        <Box>
          <HStack flexWrap="wrap" justifyContent="center" gap={3}>
            {categories.map((cat) => (
              <ServicesSectionCategoryCard
                onClick={() => setActiveServiceCategory(cat)}
                title={cat.title}
                icon={cat.icon}
                key={cat.id || ""}
              />
            ))}
          </HStack>
        </Box>
      </Box>
      <ServicesDrawer
        activeServiceCategory={activeServiceCategory}
        onClose={() => setActiveServiceCategory(null)}
        venueId={venueId}
      />
    </>
  );
}
