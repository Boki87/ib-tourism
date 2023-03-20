import { useState, useEffect, SyntheticEvent } from "react";
import { GetServerSidePropsContext } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { Owner } from "../../types/Owner";
import AdminLayout from "../../components/AdminLayout";
import {
  InputGroup,
  InputRightElement,
  Input,
  Text,
  HStack,
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
  Button,
} from "@chakra-ui/react";
import { Venue } from "../../types/Venue";
import { Employee } from "../../types/Employee";
import { ImCheckboxUnchecked } from "react-icons/im";
import { FiCheckSquare } from "react-icons/fi";
import EmployeeDrawer from "../../components/EmployeeDrawer";
import { supabase } from "../../libs/supabase";
import { BsSearch } from "react-icons/bs";
import { VscAdd } from "react-icons/vsc";

type EmployeeExtra = {
  venues: {
    id?: string;
    title?: string;
    logo?: string;
  };
};

type EmployeeExtended = Employee & EmployeeExtra;

export default function Employees({
  user,
  venues,
  employees,
}: {
  user: Owner;
  venues: Venue[];
  employees: EmployeeExtended[];
}) {
  const [cachedEmployees, setCachedEmployees] = useState(employees);
  const [filteredEmployees, setFilteredEmpoloyees] = useState(employees);
  const [activeEmployee, setActiveEmployee] = useState("");
  const [selectedVenue, setSelectedVenue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [addingNewEmp, setAddingNewEmp] = useState(false);

  async function employeesUpdatedHandler() {
    const { data, error } = await supabase
      .from("employees")
      .select("*, venues(id,title,logo)")
      .match({ owner_id: user.id })
      .order("created_at");
    if (error) {
      //TODO: implement toast
      window.alert("Could not fetch employees");
      return;
    }

    setCachedEmployees(data);
    setFilteredEmpoloyees(data);
    setActiveEmployee("");
  }

  function selectChangeHandler(e: SyntheticEvent) {
    const select = e.target as HTMLSelectElement;
    setSelectedVenue(select.value);
  }

  async function addNewEmployee() {
    setAddingNewEmp(true);
    const { data, error } = await supabase.from("employees").insert({
      full_name: "CHANGE ME",
      owner_id: user?.id,
    });
    if (error) {
      //TODO: implement toast message
      console.log(error.message);
      window.alert("Error creating new employee...");
      setAddingNewEmp(false);
    }

    await employeesUpdatedHandler();

    setAddingNewEmp(false);
  }

  useEffect(() => {
    const newFilteredEmployees = cachedEmployees
      .filter((emp) => {
        if (selectedVenue === "") {
          return emp;
        } else {
          if (emp.venue_id === selectedVenue) {
            return emp;
          }
        }
      })
      .filter((emp) =>
        emp.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    setFilteredEmpoloyees(newFilteredEmployees);
  }, [selectedVenue, searchQuery]);

  const borderColor = useColorModeValue("gray.200", "gray.700");
  const hoverColor = useColorModeValue("gray.200", "gray.600");
  return (
    <AdminLayout>
      <Box mx="auto" maxW="2xl" w="full" my="30px">
        <HStack mb="10px">
          <Select value={selectedVenue} onChange={selectChangeHandler}>
            <option value="">All Venues</option>
            {venues.map((venue) => (
              <option value={venue.id} key={venue.id}>
                {venue.title}
              </option>
            ))}
          </Select>
          <InputGroup>
            <Input
              onInput={(e: SyntheticEvent) => {
                const input = e.target as HTMLInputElement;
                setSearchQuery(input.value);
              }}
              placeholder="Search by name"
              type="search"
            />
            <InputRightElement children={<BsSearch />} />
          </InputGroup>
          <Button
            onClick={addNewEmployee}
            isLoading={addingNewEmp}
            fontSize="2rem"
          >
            <VscAdd />
          </Button>
        </HStack>

        <TableContainer
          border="1px"
          borderColor={borderColor}
          borderRadius="md"
        >
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Belongs to</Th>
                <Th>Phone</Th>
                <Th>Is Active</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredEmployees.map((emp) => (
                <Tr
                  key={emp.id}
                  onClick={() => {
                    if (!emp.id) return;
                    setActiveEmployee(emp.id);
                  }}
                  opacity={emp.is_active ? 1 : 0.5}
                  cursor="pointer"
                  _hover={{ bg: hoverColor }}
                >
                  <Td>{emp.full_name}</Td>
                  <Td>{emp.venues?.title}</Td>
                  <Td>{emp.phone}</Td>
                  <Td>
                    <Center>
                      {emp.is_active ? (
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
      <EmployeeDrawer
        activeEmployeeId={activeEmployee}
        isOpen={activeEmployee !== ""}
        venues={venues}
        employeeUpdated={employeesUpdatedHandler}
        onClose={() => setActiveEmployee("")}
        onDelete={async (id: string) => {
          console.log(id);
          const r = window.confirm("Sure you want to delete this employee??");
          if (!r) return;
          const { error } = await supabase
            .from("employees")
            .delete()
            .match({ id });
          if (error) {
            window.alert("Could not delete employee. Please try again.");
            return;
          }
          employeesUpdatedHandler();
        }}
      />
    </AdminLayout>
  );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const supabase = createServerSupabaseClient(ctx);
  const { data } = await supabase.auth.getSession();

  const props: {
    user: Owner | null;
    employees: Employee[];
    venues: Venue[];
  } = {
    user: null,
    employees: [],
    venues: [],
  };

  const redirectObj = {
    redirect: {
      destination: "/admin/login",
      permanent: false,
    },
  };

  if (!data.session?.user) {
    return redirectObj;
  }

  const { data: ownerData, error } = await supabase
    .from("owners")
    .select()
    .match({ id: data.session.user.id })
    .single();

  if (error) return redirectObj;

  props.user = ownerData;

  const { data: venues, error: venuesError } = await supabase
    .from("venues")
    .select()
    .match({ owner_id: data.session.user.id })
    .order("created_at", { ascending: true });
  if (!venuesError && venues) {
    props.venues = venues;
  }

  const { data: employees, error: employeesError } = await supabase
    .from("employees")
    .select("*, venues(id,title,logo)")
    .match({ owner_id: data.session.user.id })
    .order("created_at");
  if (!employeesError && employees) {
    props.employees = employees;
  }

  return {
    props,
  };
};
