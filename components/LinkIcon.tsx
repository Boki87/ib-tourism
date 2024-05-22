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
  FaLinkedin,
} from "react-icons/fa";
import { BsTwitterX } from "react-icons/bs";

type TIconsMap = {
  [x: string]: {
    icon: ReactNode;
    bg: string;
  };
};

const IconsMap: TIconsMap = {
  facebook: {
    icon: <FaFacebook size={40} />,
    bg: "linear(to-l, blue.600, blue.400)",
  },
  linkedin: {
    icon: <FaLinkedin size={40} />,
    bg: "linear(to-l, blue.600, blue.400)",
  },
  google: {
    icon: <FaGoogle size={40} />,
    bg: "linear(to-l, red.600, red.600)",
  },
  instagram: {
    icon: <FaInstagram size={40} />,
    bg: "linear(to-l, purple.400, pink.500, red.500)",
  },
  twitter: {
    icon: <BsTwitterX size={40} />,
    bg: "black",
  },
  invino: {
    icon: <FaWineBottle size={40} />,
    bg: "linear(to-l, orange.400, orange.300)",
  },
  "trip advisor": {
    icon: <FaTripadvisor size={40} />,
    bg: "linear(to-l, green.500, green.300)",
  },
  yelp: { icon: <FaYelp size={40} />, bg: "linear(to-l, red.600, red.400)" },
  youtube: {
    icon: <FaYoutube size={40} />,
    bg: "linear(to-l, red.400, red.400)",
  },
  custom: {
    icon: <FaBook size={40} />,
    bg: "linear(to-l, teal.400, teal.300)",
  },
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
      rounded="lg"
      color="gray.500"
      _hover={{ color: "gray.900" }}
      fontSize="lg"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p="3px"
      cursor="pointer"
      transition="all .3s ease-in-out"
    >
      {IconsMap[type || ""]?.icon}
    </Box>
  );
}
