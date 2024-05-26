import {
  Text,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Grid,
  Input,
  GridItem,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import * as Icon from "react-icons/fa";
import { useDebounce } from "../../hooks/useDebounce";

interface IconSelectorProps {
  icon: string;
  onSelect: (icon: string) => void;
  [x: string]: any;
}

const allIconNames = Object.keys(Icon);

export default function IconSelector({ icon, onSelect }: IconSelectorProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const CatIcon = Icon[icon as keyof typeof Icon];

  const [searchText, setSearchText] = useState("");
  const debaouncedText = useDebounce(searchText, 500);

  function onIconSelected(icon: string) {
    onSelect(icon);
    setIsDrawerOpen(false);
  }

  const iconsList = React.useMemo(() => {
    return allIconNames?.map((iconName) => {
      const IconComponent = Icon[iconName as keyof typeof Icon];

      return (
        <GridItem
          borderRadius="lg"
          key={iconName}
          className="custom-icons"
          id={`cutom_icon-${iconName}`}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          w="100%"
          maxW="100%"
          p={3}
          _hover={{ bg: "gray.100" }}
          cursor="pointer"
          onClick={() => onIconSelected(iconName)}
        >
          <IconComponent size={40} />
          {/* <Text size="xs">{iconName}</Text> */}
        </GridItem>
      );
    });
  }, [allIconNames]);

  function toggleIcons(id: string) {
    document.querySelectorAll<HTMLElement>(".custom-icons").forEach((el) => {
      el.style.display = "none";
    });

    document.querySelectorAll<HTMLElement>(".custom-icons").forEach((el) => {
      if (el.id.toLowerCase().includes(id.trim().toLowerCase())) {
        el.style.display = "flex";
      }
    });
  }

  useEffect(() => {
    toggleIcons(debaouncedText);
  }, [debaouncedText]);

  return (
    <>
      <Box bg="gray.100">
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          bg="gray.100"
          h="100px"
          w="100px"
          mx="auto"
        >
          {CatIcon && <CatIcon size={35} />}
        </Box>
        <Button
          onClick={() => setIsDrawerOpen(true)}
          size="sm"
          colorScheme="blue"
        >
          Change Icon
        </Button>
      </Box>
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        placement={"right"}
        size="md"
      >
        <DrawerOverlay />
        <DrawerContent borderLeftRadius="md">
          <DrawerCloseButton />
          <DrawerBody overflowX="hidden" overflowY="auto" pt={5}>
            <Text>Pick an icon</Text>
            <Input
              type="serach"
              value={searchText}
              placeholder="Type icon name here"
              mb={3}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setSearchText(e.target.value);
              }}
            />
            <Grid
              templateColumns={{ base: "repeat(3, 1fr)", md: "repeat(5, 1fr)" }}
              gap={2}
            >
              <GridItem
                borderRadius="lg"
                className="custom-icons"
                id={`cutom_icon-no_icon`}
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                w="100%"
                maxW="100%"
                p={3}
                _hover={{ bg: "gray.100" }}
                bg="gray.50"
                cursor="pointer"
                onClick={() => onIconSelected("")}
              >
                <Text size="xs">No Icon</Text>
              </GridItem>

              {iconsList}
            </Grid>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
