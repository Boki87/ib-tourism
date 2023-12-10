import { Box, Image, Text } from "@chakra-ui/react";
import { Service } from "../../types/Service";

export default function FrontPageServices({ service }: { service: Service }) {
  return (
    <Box id={service.id} mb={5}>
      {service?.title !== "" && <Text>{service.title}</Text>}
      {service.images && service?.images?.length > 0 && (
        <Image src={service.images[0]} w="100px" />
      )}
    </Box>
  );
}
