import { useState } from "react";
import {
  Popover,
  PopoverTrigger,
  Button,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  PopoverHeader,
  PopoverCloseButton,
  Box,
  Divider,
} from "@chakra-ui/react";

const defaultColors = [
  "gray.400",
  "red.400",
  "orange.400",
  "yellow.400",
  "green.400",
  "teal.400",
  "blue.400",
  "cyan.400",
  "purple.400",
  "pink.400",
];

const ChakraColorPicker = ({
  value,
  colors = defaultColors,
  onChange,
}: {
  value: string;
  colors?: string[];
  onChange: (val: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  function setColor(color: string) {
    onChange(color);
    setIsOpen(false);
  }

  return (
    <Popover isOpen={isOpen} closeOnBlur={true} closeOnEsc={true}>
      <PopoverTrigger>
        <Button
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        >
          {/* <Text>Background: </Text> */}
          <Box
            bg={value}
            minW="20px"
            minH="20px"
            ml="0px"
            borderRadius="full"
          ></Box>
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton
          onClick={() => {
            setIsOpen(false);
          }}
        />
        <PopoverHeader>Pick a color</PopoverHeader>
        <PopoverBody display="flex" flexWrap="wrap" justifyContent="center">
          {colors.map((color: string) => (
            <Box
              onClick={() => setColor(color)}
              minW="50px"
              minH="50px"
              m="3px"
              borderRadius="md"
              bg={color}
              cursor="pointer"
              key={color}
            ></Box>
          ))}

          <Divider my="10px" />
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default ChakraColorPicker;
