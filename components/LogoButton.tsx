import { Box } from "@chakra-ui/react";
import Image from "next/image";
import Logo from "../assets/logo.svg";

export default function LogoButton({ onClick }: { onClick?: () => void }) {
  return (
    <Box
      onClick={onClick}
      w="40px"
      h="40px"
      borderRadius="md"
      cursor="pointer"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Image src={Logo.src} height={35} width={35} alt="brand logo" />
    </Box>
  );
}
