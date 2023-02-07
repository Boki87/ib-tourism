import { useState, useEffect, useRef, RefObject, LegacyRef } from "react";
import { Box, Text, VStack } from "@chakra-ui/react";
import { venue_links } from "../libs/utils";
import { HiOutlinePlus } from "react-icons/hi";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

export default function NewLinkButton({
  onSelect,
}: {
  onSelect: (type: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  return (
    <Box position="relative">
      {/*Links*/}
      <AnimatePresence initial={true}>
        {isOpen && (
          <VStack
            as={motion.div}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            position="absolute"
            bottom="78px"
            zIndex={9}
          >
            {venue_links.map((link, index) => {
              return (
                <Box
                  onClick={() => {
                    onSelect(link.name);
                    setIsOpen(false);
                  }}
                  as={motion.div}
                  w="70px"
                  h="70px"
                  bg="gray.100"
                  cursor="pointer"
                  borderRadius="xl"
                  overflow="hidden"
                  key={link.name}
                >
                  <Image
                    src={link.icon}
                    width="70"
                    height="70"
                    alt="venue link option"
                  />
                </Box>
              );
            })}
          </VStack>
        )}
      </AnimatePresence>

      {/*Trigger button*/}
      <Box
        onClick={() => setIsOpen(!isOpen)}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        bg="gray.200"
        height="70px"
        width="70px"
        color="gray.800"
        cursor="pointer"
        borderRadius="xl"
        _hover={{ bg: "gray.300" }}
        _active={{ bg: "gray.400" }}
        ref={ref}
        zIndex={10}
      >
        <HiOutlinePlus
          style={{
            fontSize: "1.7rem",
            marginBottom: "3px",
            transform: `rotate(${isOpen ? "45deg" : "0deg"})`,
            transition: "all 0.3s ease-in-out",
          }}
        />
        <Text fontSize="sm">{!isOpen ? "Add Link" : "Close"}</Text>
      </Box>
    </Box>
  );
}
