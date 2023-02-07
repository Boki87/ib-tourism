import { SyntheticEvent, useEffect, useState } from "react";
import { GetServerSidePropsContext } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  useColorModeValue,
  Image,
  Center,
  Select,
} from "@chakra-ui/react";
import { supabase } from "../../libs/supabase";
import { Owner } from "../../types/Owner";
import { Nfc } from "../../types/Nfc";
import { Venue } from "../../types/Venue";
import AdminLayout from "../../components/AdminLayout";
import { User } from "../../types/User";
import { ImCheckboxUnchecked } from "react-icons/im";
import { FiCheckSquare } from "react-icons/fi";
import DeviceDrawer from "../../components/DeviceDrawer";

type NfcExtra = {
  device_types?: {
    image?: string;
  };
  venues?: {
    id?: string;
    logo?: string;
    title?: string;
  };
  employees?: {
    id?: string;
    full_name?: string;
  };
};

type NfcL = Nfc & NfcExtra;

/*
TODO:
Add feature for cusotmer/owner to be able to buy additional devices from this page 
*/

export default function Devices({
  user,
  devices,
  venues,
}: {
  user: Owner;
  devices: NfcL[];
  venues: Venue[];
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState("");
  const [cachedDevices, setCachedDevices] = useState(devices);
  const [filteredDevices, setFilteredDevices] = useState(cachedDevices);
  const [activeDevice, setActiveDevice] = useState<string>("");

  function selectChangeHandler(e: SyntheticEvent) {
    const select = e.target as HTMLSelectElement;
    setSelectedVenue(select.value);
  }

  async function deviceUpdatedHandler() {
    setIsLoading(true);
    const { data: newDevices, error: devicesError } = await supabase
      .from("nfcs")
      .select(
        "*, device_types(id, image), venues(id,title,logo), employees(id, full_name)"
      )
      .match({ owner_id: user.id })
      .order("created_at");
    if (devicesError) {
      //show error toast
      setIsLoading(false);
      window.alert("Error fetching devices");
      return;
    }

    setIsLoading(false);
    setCachedDevices(newDevices);
    setFilteredDevices(newDevices);
    setSelectedVenue("");
    setActiveDevice("");
  }

  useEffect(() => {
    if (selectedVenue !== "") {
      const newDevices = devices.filter((d) => d.venue_id === selectedVenue);
      setFilteredDevices(newDevices);
    } else {
      setFilteredDevices(devices);
    }
  }, [selectedVenue, devices]);

  const borderColor = useColorModeValue("gray.200", "gray.700");
  const hoverColor = useColorModeValue("gray.200", "gray.600");
  return (
    <AdminLayout>
      <Box mx="auto" maxW="2xl" w="full" my="30px">
        <Select mb="20px" value={selectedVenue} onChange={selectChangeHandler}>
          <option value="">All Venues</option>
          {venues.map((venue) => (
            <option value={venue.id} key={venue.id}>
              {venue.title}
            </option>
          ))}
        </Select>
        <TableContainer
          border="1px"
          borderColor={borderColor}
          borderRadius="md"
        >
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th></Th>
                <Th>Title</Th>
                <Th>Belongs to</Th>
                <Th>Current employee</Th>
                <Th>Is Active</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredDevices.map((device) => (
                <Tr
                  key={device.id}
                  onClick={() => {
                    if (!device.id) return;
                    setActiveDevice(device.id);
                  }}
                  opacity={device.is_active ? 1 : 0.5}
                  cursor="pointer"
                  _hover={{ bg: hoverColor }}
                >
                  <Td minW="100px">
                    {device.device_types?.image && (
                      <Image src={device.device_types?.image} />
                    )}
                  </Td>
                  <Td>{device.title}</Td>
                  <Td>{device.venues?.title}</Td>
                  <Td>
                    {device.employees?.full_name
                      ? device.employees?.full_name
                      : "No user"}
                  </Td>
                  <Td>
                    <Center>
                      {device.is_active ? (
                        <FiCheckSquare />
                      ) : (
                        <ImCheckboxUnchecked />
                      )}
                    </Center>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
      <DeviceDrawer
        activeDeviceId={activeDevice}
        isOpen={activeDevice !== ""}
        venues={venues}
        onClose={() => {
          setActiveDevice("");
        }}
        deviceUpdated={deviceUpdatedHandler}
      />
    </AdminLayout>
  );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const supabase = createServerSupabaseClient(ctx);
  const { data } = await supabase.auth.getSession();

  const redirectObj = {
    redirect: {
      destination: "/admin/login",
      permanent: false,
    },
  };

  if (!data.session?.user) {
    return redirectObj;
  }

  const props: { user: User | null; devices: Nfc[]; venues: Venue[] } = {
    user: null,
    venues: [],
    devices: [],
  };

  const { data: ownerData, error } = await supabase
    .from("owners")
    .select()
    .match({ id: data.session.user.id })
    .single();
  if (!error && ownerData) {
    props.user = ownerData;
  }

  const { data: devices, error: devicesError } = await supabase
    .from("nfcs")
    .select(
      "*, device_types(id, image), venues(id,title,logo), employees(id, full_name)"
    )
    .match({ owner_id: data.session.user.id })
    .order("created_at");
  if (!devicesError && devices) {
    props.devices = devices;
  }

  const { data: venues, error: venuesError } = await supabase
    .from("venues")
    .select()
    .match({ owner_id: data.session.user.id })
    .order("created_at", { ascending: true });
  if (!venuesError && venues) {
    props.venues = venues;
  }

  return {
    props,
  };
};
