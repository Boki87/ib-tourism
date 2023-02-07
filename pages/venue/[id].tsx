import { useEffect } from "react";
import { GetServerSidePropsContext } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { Box } from "@chakra-ui/react";
import { useRouter } from "next/router";
import VenueLanding from "../../components/venueLanding";
import { Venue } from "../../types/Venue";
import { Link } from "../../types/Link";

interface IVenueLanding {
  venueData: Venue;
  links: Link[];
}

export default function VenueFrontPage({ venueData, links }: IVenueLanding) {
  const router = useRouter();

  if (!venueData) {
    return <Box>Error</Box>;
  }

  return (
    <Box w="full" h="full">
      <VenueLanding venueData={venueData} links={links} />
    </Box>
  );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const supabase = createServerSupabaseClient(ctx);
  const { id } = ctx.query;

  const props: { venueData: Venue | null; links: Link[] } = {
    venueData: null,
    links: [],
  };

  const { data: venueData, error: venueError } = await supabase
    .from("venues")
    .select()
    .match({ id })
    .single();
  if (!venueError) {
    props.venueData = venueData;
  }
  const { data: links, error: linksError } = await supabase
    .from("venue_links")
    .select()
    .match({ venue_id: id })
    .order("order_index");
  if (!linksError) {
    props.links = links;
  }

  return {
    props,
  };
};
