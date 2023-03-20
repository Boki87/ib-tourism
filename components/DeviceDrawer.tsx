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
  Select,
  Link as CLink,
} from "@chakra-ui/react";
import { Link } from "../types/Link";
import { BsTrash } from "react-icons/bs";
import { Nfc } from "../types/Nfc";
import { Venue } from "../types/Venue";
import { APP_URL } from "../libs/supabase";
import { NfcExtended } from "../types/Nfc";

const DeviceDrawer = ({
  activeDeviceId,
  venues,
  isOpen,
  onClose,
  deviceUpdated,
}: {
  activeDeviceId: string;
  venues: Venue[];
  isOpen: boolean;
  onClose: () => void;
  deviceUpdated: (device: NfcExtended) => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [deviceData, setDeviceData] = useState<Nfc>();

  async function fetchDeviceData(id: string) {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("nfcs")
        .select()
        .match({ id })
        .single();
      if (error) throw Error(error.message);
      setDeviceData(data);
      setIsLoading(false);
    } catch (e) {
      console.log(e);
      setIsLoading(false);
    }
  }

  function venueChangeHandler(e: SyntheticEvent) {
    const select = e.target as HTMLSelectElement;
    console.log(select.value);
    setDeviceData((old) => ({ ...old, venue_id: select.value }));
  }

  function updateDeviceDataHandler(e: SyntheticEvent) {
    if (!deviceData) return;
    const input = e.target as HTMLInputElement;
    setDeviceData({ ...deviceData, [input.name]: input.value });
  }

  async function submitHandler(e: SyntheticEvent) {
    e.preventDefault();
    if (!deviceData) return;
    try {
      setIsUpdating(true);
      const { data, error } = await supabase
        .from("nfcs")
        .update({
          title: deviceData.title,
          is_active: deviceData.is_active,
          venue_id: deviceData.venue_id,
        })
        .match({ id: deviceData.id })
        .select(
          "*, device_types(id, image), venues(id,title,logo), employees(id, full_name)"
        )
        .single();
      if (error) throw Error(error.message);
      deviceUpdated(data);
      setIsUpdating(false);
    } catch (e) {
      console.log(e);
      setIsUpdating(false);
    }
  }

  useEffect(() => {
    if (isOpen && activeDeviceId !== "") {
      fetchDeviceData(activeDeviceId);
    } else {
    }
  }, [activeDeviceId, isOpen, venues]);

  return (
    <Drawer isOpen={isOpen} onClose={onClose} placement={"right"} size="md">
      <DrawerOverlay />
      <DrawerContent borderLeftRadius="md">
        <DrawerCloseButton onClick={onClose} />
        <DrawerBody p="10px" pb="60px" mt="30px" overflowY="auto">
          {isLoading ? (
            <Center mt="30px">
              <Spinner size="xl" />
            </Center>
          ) : (
            <form onSubmit={submitHandler}>
              <FormControl isRequired mb={4}>
                <FormLabel>Title</FormLabel>
                <Input
                  name="title"
                  type="text"
                  placeholder="Device Title"
                  variant="filled"
                  value={deviceData?.title || ""}
                  onInput={updateDeviceDataHandler}
                />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Belongs to venue</FormLabel>
                <Select
                  value={deviceData?.venue_id}
                  onChange={venueChangeHandler}
                >
                  {venues.map((venue) => (
                    <option value={venue.id} key={venue.id}>
                      {venue.title}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl mb={4} display="flex" alignItems="center">
                <FormLabel m="0px" mr="10px">
                  Is Active
                </FormLabel>
                <Switch
                  size="lg"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    let isChecked = e.target.checked;
                    let toggle = !isChecked;
                    APP_URL;
                    setDeviceData({ ...deviceData, is_active: !toggle });
                  }}
                  isChecked={deviceData?.is_active}
                />
              </FormControl>
              <Box>
                <CLink
                  textDecor="underline"
                  color="blue.500"
                  href={`${APP_URL}/d/${deviceData?.id}`}
                  target="_blank"
                >
                  VIEW URL
                </CLink>
              </Box>
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

export default DeviceDrawer;
