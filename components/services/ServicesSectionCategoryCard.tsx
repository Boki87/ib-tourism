import { Box, Card, Text } from "@chakra-ui/react";
import * as Icon from "react-icons/fa";

interface ServicesSectionCategoryCardProps {
  title: string;
  icon: string;
  isLive: boolean;
  [x: string]: any;
}

export default function ServicesSectionCategoryCard({
  title,
  icon,
  isLive,
  ...rest
}: ServicesSectionCategoryCardProps) {
  const CatIcon = Icon[icon as keyof typeof Icon];
  return (
    <Card
      w="110px"
      ml={0}
      style={{ marginLeft: "0px" }}
      display="flex"
      flexDir="column"
      gap={2}
      p={3}
      cursor="pointer"
      bg="gray.100"
      opacity={isLive ? 1 : 0.5}
      isTruncated
      {...rest}
    >
      <Box display="flex" justifyContent="center">
        {CatIcon && <CatIcon size={35} />}
      </Box>
      <Box textAlign="center">
        <Text fontSize="sm" textTransform="capitalize" isTruncated>
          {title}
        </Text>
      </Box>
    </Card>
  );
}
