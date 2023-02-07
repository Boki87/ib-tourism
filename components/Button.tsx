import { ReactNode } from "react";
import { Button as ChakraButton } from "@chakra-ui/react";

interface IButton {
  children: ReactNode;
  [k: string]: any;
}

export default function Button({ children, ...rest }: IButton) {
  return (
    <ChakraButton
      bgGradient="linear(to-r, teal.400, green.500)"
      _hover={{ bgGradient: "linear(to-l, teal.400, green.500)" }}
      _active={{
        bgGradient: "linear(to-l, teal.400, green.500)",
        filter: "brightness(90%)",
      }}
      color="white"
      {...rest}
    >
      {children}
    </ChakraButton>
  );
}
