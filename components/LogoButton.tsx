import { Box } from "@chakra-ui/react";
import LogoSmallLight from "../public/images/logo-sm-light.png";
import Image from "next/image";

export default function LogoButton({ onClick }: { onClick?: () => void }) {
  return (
    <Box
      onClick={onClick}
      w="40px"
      h="40px"
      bgGradient="linear(to-r, teal.400, green.500)"
      borderRadius="md"
      cursor="pointer"
    >
      <Image src={LogoSmallLight} alt="brand logo" />
    </Box>
  );
}
