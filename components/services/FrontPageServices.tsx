import { Box, Text, HStack, Card, Skeleton, Spacer } from "@chakra-ui/react";
import * as Icon from "react-icons/fa";
import { useEffect, useState } from "react";
import FrontPageServicesDrawer from "./FrontPageServicesDrawer";
import { supabase } from "../../libs/supabase";
import { ServiceCategory } from "../../types/ServiceCategory";

interface FrontPageServicesProps {
  venueId: string;
}

export default function FrontPageServices({ venueId }: FrontPageServicesProps) {
  const [activeService, setActiveService] = useState<ServiceCategory | null>(
    null,
  );
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchCategories() {
    setLoading(true);
    const { data, error } = await supabase
      .from("service_categories")
      .select()
      .match({ venue_id: venueId })
      .order("order_index");

    if (error) {
      setLoading(false);
      return;
    }
    setCategories(data as ServiceCategory[]);
    setLoading(false);
  }

  useEffect(() => {
    if (!venueId) return;

    fetchCategories();
  }, [venueId]);

  return (
    <>
      <HStack
        display="grid"
        gridTemplateColumns="1fr 1fr"
        gap={3}
        maxW="md"
        mx="auto"
        mb={5}
        justifyContent="center"
        p={5}
      >
        {loading && (
          <>
            <Skeleton w="100%" h="125px" borderRadius="lg" />
            <Skeleton w="100%" h="125px" borderRadius="lg" />
            <Skeleton w="100%" h="125px" borderRadius="lg" />
            <Skeleton w="100%" h="125px" borderRadius="lg" />
            <Skeleton w="100%" h="125px" borderRadius="lg" />
            <Skeleton w="100%" h="125px" borderRadius="lg" />
          </>
        )}
        {!loading &&
          categories.map((service) => {
            const IconComponent = Icon[service.icon as keyof typeof Icon];

            return (
              <Card
                onClick={() => setActiveService(service)}
                w="100%"
                h="auto"
                ml={0}
                style={{ marginLeft: "0px" }}
                display="flex"
                flexDir="column"
                gap={2}
                p={3}
                cursor="pointer"
                key={service.id}
                borderRadius="lg"
                bg="gray.100"
                isTruncated
              >
                <Box display="flex" justifyContent="center">
                  <IconComponent size={50} />
                </Box>
                <Spacer />
                <Box textAlign="center">
                  <Text fontSize="sm" textTransform="capitalize" isTruncated>
                    {service.title}
                  </Text>
                </Box>
              </Card>
            );
          })}
      </HStack>
      <FrontPageServicesDrawer
        activeServiceCategory={activeService}
        onClose={() => setActiveService(null)}
        venueId={venueId}
      />
    </>
  );
}
