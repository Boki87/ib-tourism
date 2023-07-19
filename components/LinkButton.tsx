import { Box, Text } from "@chakra-ui/react";
import type { Link } from "../types/Link";
import Image from "next/image";

export default function LinkButton({
  id,
  type,
  isActive,
  onClick,
  buttonSize = 70,
  ...rest
}: Link & {
  isActive: boolean;
  onClick?: (val: string) => void;
  buttonSize?: number;
  [x: string]: any;
}) {
  const image = type && type.split(" ").join("-");
  const imageSrc = `/links/${image}.jpg`;
  function onClickHandler() {
    if (!onClick || !id) return;
    onClick(id);
  }

  return (
    <Box
      onClick={onClickHandler}
      minW={`${buttonSize}px`}
      minH={`${buttonSize}px`}
      borderRadius="xl"
      bg="gray.100"
      overflow="hidden"
      cursor="pointer"
      opacity={isActive ? 1 : 0.3}
      position="relative"
      {...rest}
    >
      <Image
        src={imageSrc}
        alt={`${type} icon`}
        width={buttonSize}
        height={buttonSize}
      />
      {rest.title && (
        <Box
          position="absolute"
          bottom="0"
          left="0"
          w="full"
          h="40px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          bg="rgba(255,255,255,.7)"
          px={2}
        >
          <Text fontSize="sm" fontWeight="bold" isTruncated>
            {rest.title}
          </Text>
        </Box>
      )}
    </Box>
  );
}
