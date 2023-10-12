import { GetServerSidePropsContext } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { Box } from "@chakra-ui/react";
import { useRouter } from "next/router";
import VenueLanding from "../../components/venueLanding";
import { Venue } from "../../types/Venue";
import { Link } from "../../types/Link";
import { ExternalOffer } from "../../types/ExternalOffer";

interface IVenueLanding {
  venueData: Venue;
  links: Link[];
  externalOffers: ExternalOffer[];
}

export default function VenueFrontPage({
  venueData,
  links,
  externalOffers,
}: IVenueLanding) {
  const router = useRouter();

  if (!venueData) {
    return <Box>Error</Box>;
  }

  return (
    <Box w="full" h="full">
      <VenueLanding
        venueData={venueData}
        links={links}
        externalOffers={externalOffers}
      />
    </Box>
  );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const supabase = createServerSupabaseClient(ctx);
  const { id } = ctx.query;

  const props: {
    venueData: Venue | null;
    links: Link[];
    externalOffers: Partial<ExternalOffer>[];
  } = {
    venueData: null,
    links: [],
    externalOffers: [],
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

  const { data: externalOffers, error: externalOffersError } = await supabase
    .from("external_offers")
    .select()
    .order("order_index", { ascending: true })
    .match({ venue_id: venueData?.id });

  if (!externalOffersError) {
    props.externalOffers = externalOffers;
  }

  return {
    props,
  };
};
