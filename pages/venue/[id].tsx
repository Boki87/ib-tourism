import { GetServerSidePropsContext } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { Box } from "@chakra-ui/react";
import VenueLanding from "../../components/venueLanding";
import { Venue } from "../../types/Venue";
import { Link } from "../../types/Link";
import { ExternalOffer } from "../../types/ExternalOffer";
import { CallToAction } from "../../types/CallToAction";

interface IVenueLanding {
  venueData: Venue;
  links: Link[];
  externalOffers: ExternalOffer[];
  callToActions: CallToAction[];
}

export default function VenueFrontPage({
  venueData,
  links,
  externalOffers,
  callToActions,
}: IVenueLanding) {
  if (!venueData) {
    return <Box>Error</Box>;
  }

  return (
    <Box w="full" h="full">
      <VenueLanding
        venueData={venueData}
        links={links}
        externalOffers={externalOffers}
        callToActions={callToActions}
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
    callToActions: CallToAction[];
  } = {
    venueData: null,
    links: [],
    externalOffers: [],
    callToActions: [],
  };

  const { data: venueData, error: venueError } = await supabase
    .from("venues")
    .select()
    .eq("id", id)
    .single();
  if (!venueError) {
    props.venueData = venueData;
  }

  try {
    const [links, externalOffers, callToActions] = await Promise.all([
      supabase
        .from("venue_links")
        .select()
        .match({ venue_id: venueData?.id })
        .order("order_index"),
      supabase
        .from("external_offers")
        .select()
        .order("order_index", { ascending: true })
        .match({ venue_id: (venueData as Venue)?.id }),
      supabase
        .from("call_to_actions")
        .select()
        .match({ venue_id: (venueData as Venue)?.id })
        .order("created_at"),
    ]);

    props.links = links.data as Link[];
    props.externalOffers = externalOffers.data as Partial<ExternalOffer>[];
    props.callToActions = callToActions.data as CallToAction[];
  } catch (e) {
    console.error(e);
  }

  return {
    props,
  };
};
