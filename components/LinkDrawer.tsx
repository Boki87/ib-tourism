import {
  useEffect,
  useState,
  useMemo,
  SyntheticEvent,
  ChangeEvent,
} from "react";
import supabase from "../libs/supabase-browser";
import Image from "next/image";
import {
  Box,
  Button,
  Switch,
  Text,
  Drawer,
  Spinner,
  Center,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerCloseButton,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { Link } from "../types/Link";
import { BsTrash } from "react-icons/bs";

const LinkDrawer = ({
  activeLinkId,
  isOpen,
  onClose,
  onDelete,
  linkUpdated,
}: {
  activeLinkId: string;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (id: string) => void;
  linkUpdated: (link: Link) => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [linkData, setLinkData] = useState<Link | null>(null);

  async function fetchLinkData(id: string) {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("venue_links")
        .select()
        .match({ id })
        .single();
      if (error) throw Error(error.message);
      setLinkData(data);
      setIsLoading(false);
    } catch (e) {
      console.log(e);
      setIsLoading(false);
    }
  }

  function updateLinkDataHandler(e: SyntheticEvent) {
    if (!linkData) return;
    const input = e.target as HTMLInputElement;
    setLinkData({ ...linkData, [input.name]: input.value });
  }

  async function submitHandler(e: SyntheticEvent) {
    e.preventDefault();
    if (!linkData) return;
    try {
      setIsUpdating(true);
      const { data, error } = await supabase
        .from("venue_links")
        .update({
          url: linkData.url,
          title: linkData.title,
          is_active: linkData.is_active,
        })
        .match({ id: linkData.id })
        .select()
        .single();
      if (error) throw Error(error.message);
      linkUpdated(data);
      setIsUpdating(false);
    } catch (e) {
      console.log(e);
      setIsUpdating(false);
    }
  }

  const logoImage = useMemo(() => {
    if (!linkData) return "";
    return `/links/${linkData.type?.split(" ").join("-")}.jpg`;
  }, [linkData]);

  useEffect(() => {
    if (isOpen && activeLinkId !== "") {
      fetchLinkData(activeLinkId);
    } else {
    }
  }, [activeLinkId, isOpen]);

  return (
    <Drawer isOpen={isOpen} onClose={onClose} placement={"right"} size="md">
      <DrawerOverlay />
      <DrawerContent borderLeftRadius="md">
        <DrawerCloseButton onClick={onClose} />
        <Button
          onClick={() => {
            onDelete(activeLinkId);
            onClose();
          }}
          position="absolute"
          size="sm"
          top="8px"
          left="8px"
          variant="ghost"
        >
          <BsTrash />
        </Button>
        <DrawerBody p="10px" pb="60px" mt="30px" overflowY="auto">
          {isLoading ? (
            <Center mt="30px">
              <Spinner size="xl" />
            </Center>
          ) : (
            <form onSubmit={submitHandler}>
              <Center flexDirection="column">
                <Box h="120px" w="120px" overflow="hidden" borderRadius="md">
                  {logoImage !== "" && (
                    <Image
                      src={logoImage}
                      alt="link logo"
                      height="120"
                      width="120"
                    />
                  )}
                </Box>
                <Text mt="10px" textTransform="capitalize">
                  {linkData?.type}
                </Text>
              </Center>
              <FormControl mb={4}>
                <FormLabel>Title</FormLabel>
                <Input
                  name="title"
                  type="text"
                  placeholder={`My ${linkData?.type} account`}
                  variant="filled"
                  value={linkData?.title || ""}
                  onInput={updateLinkDataHandler}
                />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>URL</FormLabel>
                <Input
                  name="url"
                  type="text"
                  placeholder="https://"
                  variant="filled"
                  value={linkData?.url || ""}
                  onInput={updateLinkDataHandler}
                />
              </FormControl>
              <FormControl mb={4} display="flex" alignItems="center">
                <FormLabel m="0px" mr="10px">
                  Link is Active
                </FormLabel>
                <Switch
                  size="lg"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    let isChecked = e.target.checked;
                    let toggle = !isChecked;

                    setLinkData({ ...linkData, is_active: !toggle });
                  }}
                  isChecked={linkData?.is_active}
                />
              </FormControl>
              <Center>
                <Button isLoading={isUpdating} colorScheme="blue" type="submit">
                  Save
                </Button>
              </Center>
            </form>
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};
<Input name="is_active" type="text" placeholder="" variant="filled" />;

export default LinkDrawer;
