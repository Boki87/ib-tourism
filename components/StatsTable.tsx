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
} from "@chakra-ui/react";
import { venue_links } from "../libs/utils";

export const StatsTable = ({
  data,
}: {
  data: {
    venue: { totalVisitsTimeRange: number; totalVisits: number };
    devices: {
      nfc_id: string;
      title: string;
      totalVisitsTimeRange: number;
      links: { title: string; clicks: number }[];
    }[];
  };
}) => {
  const borderColor = useColorModeValue("gray.200", "gray.600");
  return (
    <Box border="1px" borderColor={borderColor} borderRadius="lg">
      <TableContainer>
        <Table variant="simple">
          <TableCaption>
            <Box>Total venue visits to date: {data?.venue?.totalVisits}</Box>
            <Box>
              Total link clicks in selected date range:{" "}
              {data?.venue?.totalVisitsTimeRange}
            </Box>
          </TableCaption>
          <Thead>
            <Tr>
              <Th>Device</Th>
              {venue_links.map((link) => {
                return (
                  <Th key={link.name} textAlign="center">
                    <img
                      src={link.icon}
                      width="40px"
                      height="40px"
                      style={{
                        minWidth: "40px",
                        minHeight: "40px",
                        margin: "0px auto",
                      }}
                    />
                  </Th>
                );
              })}
            </Tr>
          </Thead>
          <Tbody>
            {data?.devices?.map((device) => {
              return (
                <Tr key={device.nfc_id}>
                  <Td>{device.title}</Td>
                  {device.links.map((link) => (
                    <Td
                      textAlign="center"
                      key={`${device.nfc_id}${link.title}`}
                    >
                      {link.clicks}
                    </Td>
                  ))}
                </Tr>
              );
            })}
          </Tbody>
          <Tfoot></Tfoot>
        </Table>
      </TableContainer>
    </Box>
  );
};
