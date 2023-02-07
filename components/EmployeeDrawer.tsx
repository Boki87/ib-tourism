import { useEffect, useState, SyntheticEvent, ChangeEvent } from "react";
import supabase from "../libs/supabase-browser";
import { useUser } from "@supabase/auth-helpers-react";
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
} from "@chakra-ui/react";
import { Link } from "../types/Link";
import { BsTrash } from "react-icons/bs";
import { Venue } from "../types/Venue";
import { Employee } from "../types/Employee";
import { userAgent } from "next/server";

const EmployeeDrawer = ({
  activeEmployeeId,
  venues,
  isOpen,
  onClose,
  employeeUpdated,
}: {
  activeEmployeeId: string;
  venues: Venue[];
  isOpen: boolean;
  onClose: () => void;
  employeeUpdated: () => void;
}) => {
  const user = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [employeeData, setEmployeeData] = useState<Employee>();

  async function fetchEmployeeData(id: string) {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("employees")
        .select()
        .match({ id })
        .single();
      if (error) throw Error(error.message);
      setEmployeeData(data);
      setIsLoading(false);
    } catch (e) {
      console.log(e);
      setIsLoading(false);
    }
  }

  function venueChangeHandler(e: SyntheticEvent) {
    const select = e.target as HTMLSelectElement;
    console.log(select.value);
    setEmployeeData((old) => ({ ...old, venue_id: select.value }));
  }

  function updateEmployeeDataHandler(e: SyntheticEvent) {
    if (!employeeData) return;
    const input = e.target as HTMLInputElement;
    setEmployeeData({ ...employeeData, [input.name]: input.value });
  }

  async function submitHandler(e: SyntheticEvent) {
    e.preventDefault();
    if (!employeeData) return;
    try {
      setIsUpdating(true);
      const { data, error } = await supabase
        .from("employees")
        .update({
          full_name: employeeData.full_name,
          phone: employeeData.phone,
          email: employeeData.email,
          pin: employeeData.pin,
          is_active: employeeData.is_active,
          venue_id: employeeData.venue_id,
        })
        .match({ id: employeeData.id })
        .select()
        .single();
      if (error) throw Error(error.message);
      employeeUpdated();
      setIsUpdating(false);
    } catch (e) {
      console.log(e);
      setIsUpdating(false);
    }
  }

  useEffect(() => {
    if (isOpen && activeEmployeeId !== "") {
      fetchEmployeeData(activeEmployeeId);
    } else {
    }
  }, [activeEmployeeId, isOpen, venues]);

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
                <FormLabel>Full Name</FormLabel>
                <Input
                  name="full_name"
                  type="text"
                  placeholder="Employee Name"
                  variant="filled"
                  value={employeeData?.full_name || ""}
                  onInput={updateEmployeeDataHandler}
                />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Belongs to venue</FormLabel>
                <Select
                  value={employeeData?.venue_id || ""}
                  onChange={venueChangeHandler}
                >
                  <option value="">Not assigned</option>
                  {venues.map((venue) => (
                    <option value={venue.id} key={venue.id}>
                      {venue.title}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl isRequired mb={4}>
                <FormLabel>Phone</FormLabel>
                <Input
                  name="phone"
                  type="text"
                  placeholder="000 000 000"
                  variant="filled"
                  value={employeeData?.phone || ""}
                  onInput={updateEmployeeDataHandler}
                />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Email</FormLabel>
                <Input
                  name="email"
                  type="email"
                  placeholder="john.doe@email.com"
                  variant="filled"
                  value={employeeData?.email || ""}
                  onInput={updateEmployeeDataHandler}
                />
              </FormControl>
              <FormControl isRequired mb={4}>
                <FormLabel>PIN</FormLabel>
                <Input
                  name="pin"
                  type="text"
                  placeholder="00000"
                  variant="filled"
                  value={employeeData?.pin || ""}
                  onInput={updateEmployeeDataHandler}
                />
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
                    setEmployeeData({ ...employeeData, is_active: !toggle });
                  }}
                  isChecked={employeeData?.is_active}
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

export default EmployeeDrawer;
