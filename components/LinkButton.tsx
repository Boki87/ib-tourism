import { Box } from "@chakra-ui/react";
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
    if (!onClick) return;
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
      {...rest}
    >
      <Image
        src={imageSrc}
        alt={`${type} icon`}
        width={buttonSize}
        height={buttonSize}
      />
    </Box>
  );
}
