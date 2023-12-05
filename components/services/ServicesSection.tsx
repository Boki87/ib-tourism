import { Box, useColorModeValue, Text, HStack, Card } from "@chakra-ui/react";
import services from "./config";

interface ServicesSectionProps {
  venueId: string;
}

export default function ServicesSection({ venueId }: ServicesSectionProps) {
  const borderColor = useColorModeValue("blackAlpha.200", "whiteAlpha.200");
  const bgColor = useColorModeValue("gray.50", "gray.700");

  return (
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
            <Card h="100px" w="100px" ml={0} style={{ marginLeft: "0px" }}>
              <Text>{service.label}</Text>
            </Card>
          ))}
        </HStack>
      </Box>
    </Box>
  );
}
