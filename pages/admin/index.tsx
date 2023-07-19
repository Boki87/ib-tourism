import { useState } from "react";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSidePropsContext } from "next";
import supabase from "../../libs/supabase-browser";
import { Owner } from "../../types/Owner";
import Button from "../../components/Button";
import { useRouter } from "next/router";
import AdminLayout from "../../components/AdminLayout";
import DateRange from "../../components/DateRange";
import { Venue } from "../../types/Venue";
import { Box, Select, Text, Center, Stack } from "@chakra-ui/react";
import { SyntheticEvent } from "react";
import { useStatsData } from "../../hooks/useStatsData";
import BarChart from "../../components/BarChart";
import DeviceChart from "../../components/DeviceChart";
import { StatsTable } from "../../components/StatsTable";

export default function AdminHome({
  user,
  venues,
}: {
  user: Owner;
  venues: Venue[];
}) {
  const router = useRouter();
  const [selectedVenue, setSelectedVenue] = useState(venues[0]?.id);
  const [dateRange, setDateRange] = useState({
    from: "",
    to: "",
    fromTimestamp: 0,
    toTimestamp: 0,
  });
  const { venuesStats, deviceStats, socialStats, tableStats, isLoading } =
    useStatsData(selectedVenue, dateRange);
  // console.log({ venuesStats });

  if (!venues || venues.length === 0) {
    return (
      <AdminLayout>
        <Center mt="20px">
          <Text>No venues yet.</Text>
        </Center>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Center
        position={{ base: "fixed", sm: "relative" }}
        bottom={{ base: "60px", sm: "0px" }}
        width={{ base: "calc(100% - 40px)", sm: "100%" }}
        zIndex={10}
      >
        <DateRange
          range="week"
          isLoading={isLoading}
          onDateChange={(obj) => {
            setDateRange({
              from: obj.dateFromISO,
              to: obj.dateToISO,
              fromTimestamp: obj.dateFrom,
              toTimestamp: obj.dateTo,
            });
          }}
        />
      </Center>
      <Box w="full" mt="20px">
        <Select
          mx="auto"
          maxW="md"
          mb="20px"
          value={selectedVenue}
          onChange={(e: SyntheticEvent) => {
            const select = e.target as HTMLSelectElement;
            setSelectedVenue(select.value);
          }}
        >
          {venues.map((venue) => (
            <option key={venue.id} value={venue.id}>
              {venue.title}
            </option>
          ))}
        </Select>
        <Box>
          {venuesStats && (
            <BarChart
              data={venuesStats}
              title={venues?.find((venue) => venue.id === selectedVenue)?.title}
              isLoading={isLoading}
            />
          )}
          <StatsTable data={tableStats} />
        </Box>
        {/* <Box display="flex" flexWrap="wrap" w="full" justifyContent="center">
          {venuesStats && (
            <BarChart
              data={venuesStats}
              title={venues?.find((venue) => venue.id === selectedVenue)?.title}
              isLoading={isLoading}
            />
          )}
          {deviceStats && (
            <DeviceChart data={deviceStats} isLoading={isLoading} />
          )}
          {socialStats && (
            <BarChart
              data={socialStats}
              title="Links Clicks"
              isLoading={isLoading}
            />
          )}
        </Box> */}
      </Box>
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

  const props: {
    user: Owner | null;
    venues: Venue[];
  } = {
    user: null,
    venues: [],
  };

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
    .match({ owner_id: ownerData.id })
    .order("created_at", { ascending: true });

  if (!venuesError) {
    props.venues = venues;
  }

  return {
    props,
  };
};
