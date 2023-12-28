import { ReactNode } from "react";
import { Box } from "@chakra-ui/react";
import type { Link } from "../types/Link";
import {
  FaFacebook,
  FaGoogle,
  FaInstagram,
  FaTripadvisor,
  FaYelp,
  FaYoutube,
  FaBook,
  FaWineBottle,
} from "react-icons/fa";

type TIconsMap = {
  [x: string]: {
    icon: ReactNode;
    bg: string;
  };
};

const IconsMap: TIconsMap = {
  facebook: {
    icon: <FaFacebook />,
    bg: "linear(to-l, blue.600, blue.400)",
  },
  google: { icon: <FaGoogle />, bg: "linear(to-l, red.600, red.600)" },
  instagram: {
    icon: <FaInstagram />,
    bg: "linear(to-l, purple.400, pink.500, red.500)",
  },
  invino: {
    icon: <FaWineBottle />,
    bg: "linear(to-l, orange.400, orange.300)",
  },
  "trip advisor": {
    icon: <FaTripadvisor />,
    bg: "linear(to-l, green.500, green.300)",
  },
  yelp: { icon: <FaYelp />, bg: "linear(to-l, red.600, red.400)" },
  youtube: { icon: <FaYoutube />, bg: "linear(to-l, red.400, red.400)" },
  custom: { icon: <FaBook />, bg: "linear(to-l, teal.400, teal.300)" },
};

export default function LinkIcon({
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
  return (
    <Box
      onClick={() => onClick?.(id || "")}
      w="full"
      h="125px"
      rounded="lg"
      bgGradient={IconsMap[type || ""]?.bg}
      color="white"
      fontSize="5xl"
      display="flex"
      alignItems="center"
      justifyContent="center"
      shadow="md"
    >
      {IconsMap[type || ""]?.icon}
    </Box>
  );
}
