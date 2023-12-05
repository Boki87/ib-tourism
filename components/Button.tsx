import { ReactNode } from "react";
import { Button as ChakraButton } from "@chakra-ui/react";

interface IButton {
  children: ReactNode;
  [k: string]: any;
}

export default function Button({ children, ...rest }: IButton) {
  return (
    <ChakraButton
      bg="#176FF2"
      _hover={{ filter: "brightness(90%)" }}
      _active={{
        filter: "brightness(85%)",
      }}
      color="white"
      {...rest}
    >
      {children}
    </ChakraButton>
  );
}
