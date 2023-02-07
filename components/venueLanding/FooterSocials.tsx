import { Box, HStack, Stack, Center, Image, Text } from "@chakra-ui/react";
import { GrFacebookOption } from "react-icons/gr";
import { BsInstagram } from "react-icons/bs";
import { FaLinkedinIn, FaTiktok } from "react-icons/fa";

const socials = [
  {
    icon: <GrFacebookOption />,
    title: "facebook",
    url: "https://www.facebook.com",
  },
  {
    icon: <BsInstagram />,
    title: "instagram",
    url: "",
  },
  {
    icon: <FaTiktok />,
    title: "tiktok",
    url: "",
  },
  {
    icon: <FaLinkedinIn />,
    title: "linkedin",
    url: "",
  },
];

const FooterSocials = () => {
  function openUrl(url: string) {
    if (url === "") return;
    window.open(url, "_blank");
  }

  return (
    <Stack mb="10px" mt="30px">
      <Text color="gray.600" textAlign="center">
        Follow Us
      </Text>
      <Center>
        <HStack>
          {socials.map((social) => (
            <Box
              onClick={() => openUrl(social.url)}
              w="40px"
              h="40px"
              borderRadius="full"
              bg="black"
              display="flex"
              alignItems="center"
              justifyContent="center"
              color="white"
              border="1px solid black"
              transition="0.3s all easein-out"
              cursor="pointer"
              _hover={{ bg: "white", color: "black" }}
              key={social.title}
            >
              {social.icon}
            </Box>
          ))}
        </HStack>
      </Center>
    </Stack>
  );
};

export default FooterSocials;
