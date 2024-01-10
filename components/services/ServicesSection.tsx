import { Box, useColorModeValue, Text, HStack, Card } from "@chakra-ui/react";
import ServicesDrawer from "./ServicesDrawer";
import Image from "next/image";
import { services } from "./config";
import { useState } from "react";

interface ServicesSectionProps {
  venueId: string;
}

export default function ServicesSection({ venueId }: ServicesSectionProps) {
  const [activeService, setActiveService] = useState<string | null>(null);
  const borderColor = "gray.200";
  const bgColor = "gray.50";

  return (
    <>
      <Box
        borderWidth={1}
        borderColor={borderColor}
        borderRadius="md"
        mb={5}
        p={4}
      >
        <Text fontSize="2xl" fontWeight="bold" textAlign="center" mb={4}>
          Your services
        </Text>
        <Box>
          <HStack flexWrap="wrap" justifyContent="center" gap={3}>
            {services.map((service) => (
              <Card
                onClick={() => setActiveService(service.key)}
                w="110px"
                ml={0}
                style={{ marginLeft: "0px" }}
                display="flex"
                flexDir="column"
                alignItems="center"
                gap={2}
                p={3}
                cursor="pointer"
                key={service.key}
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
        </Box>
      </Box>
      <ServicesDrawer
        activeServiceType={activeService}
        onClose={() => setActiveService(null)}
        venueId={venueId}
      />
    </>
  );
}
