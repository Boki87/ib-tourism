import {
  Box,
  useColorModeValue,
  Text,
  HStack,
  Card,
  Center,
  Spinner,
  Skeleton,
} from "@chakra-ui/react";
import Image from "next/image";
import { services } from "./config";
import { useEffect, useState } from "react";
import FrontPageServicesDrawer from "./FrontPageServicesDrawer";
import { useServices } from "../../hooks/useServices";

interface FrontPageServicesProps {
  venueId: string;
}

export default function FrontPageServices({ venueId }: FrontPageServicesProps) {
  const [activeService, setActiveService] = useState<string | null>(null);

  const {
    allServices,
    fetchAllServices,
    loadingAll: loading,
  } = useServices("", venueId);

  useEffect(() => {
    fetchAllServices();
  }, []);

  const uniqueTypes = Array.from(
    new Set(allServices.filter((s) => s.is_live).map((obj) => obj.type)),
  );
  const uniqueServices: { key: string; label: string; image: any }[] =
    services.filter((s) => uniqueTypes.includes(s.key));
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
          uniqueServices.map((service) => (
            <Card
              onClick={() => setActiveService(service.key)}
              w="100%"
              h="100%"
              ml={0}
              style={{ marginLeft: "0px" }}
              display="flex"
              flexDir="column"
              alignItems="center"
              gap={2}
              p={3}
              cursor="pointer"
              key={service.key}
              borderRadius="lg"
              bg="gray.100"
            >
              <Box display="flex" justifyContent="center">
                <Image
                  src={service.image}
                  width={70}
                  height={70}
                  alt="service icon"
                />
              </Box>
              <Text fontSize="sm" textTransform="capitalize">
                {service.label}
              </Text>
            </Card>
          ))}
      </HStack>
      <FrontPageServicesDrawer
        activeServiceType={activeService || ""}
        onClose={() => setActiveService(null)}
        venueId={venueId}
      />
    </>
  );
}
