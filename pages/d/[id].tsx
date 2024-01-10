import { useEffect } from "react";
import { GetServerSidePropsContext } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { Box } from "@chakra-ui/react";
import VenueLanding from "../../components/venueLanding";
import { Venue } from "../../types/Venue";
import { Link } from "../../types/Link";
import { Nfc } from "../../types/Nfc";
import { ExternalOffer } from "../../types/ExternalOffer";
import { CallToAction } from "../../types/CallToAction";

interface IVenueLanding {
  venueData: Venue;
  nfcData: Nfc;
  links: Link[];
  externalOffers: ExternalOffer[];
  callToActions: CallToAction[];
}

export default function VenueFrontPage({
  venueData,
  nfcData,
  links,
  externalOffers,
  callToActions,
}: IVenueLanding) {
  if (!venueData || !nfcData) {
    return <Box>Error</Box>;
  }

  useEffect(() => {
    fetch(`/api/collect-venue-visit`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        id: nfcData.id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <Box w="full" h="full">
      <VenueLanding
        venueData={venueData}
        links={links}
        externalOffers={externalOffers}
        callToActions={callToActions}
        nfcId={nfcData.id}
      />
    </Box>
  );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const supabase = createServerSupabaseClient(ctx);
  const { id } = ctx.query;

  const props: {
    venueData: Venue | null;
    nfcData: Nfc | null;
    links: Link[];
    externalOffers: Partial<ExternalOffer>[];
    callToActions: CallToAction[];
  } = {
    venueData: null,
    nfcData: null,
    links: [],
    externalOffers: [],
    callToActions: [],
  };

  const { data: nfcData, error: nfcError } = await supabase
    .from("nfcs")
    .select()
    .match({ id })
    .single();

  const venueId = nfcData?.venue_id;
  if (!nfcError) {
    props.nfcData = nfcData;
  } else {
    return {
      props,
    };
  }

  const { data: venueData, error: venueError } = await supabase
    .from("venues")
    .select()
    .match({ id: venueId })
    .single();
  if (!venueError) {
    props.venueData = venueData;
  }
  const { data: links, error: linksError } = await supabase
    .from("venue_links")
    .select()
    .match({ venue_id: venueId })
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

  const { data: callToActions, error: callToActionsError } = await supabase
    .from("call_to_actions")
    .select()
    .match({ venue_id: venueData?.id })
    .order("created_at");

  if (!callToActionsError) {
    props.callToActions = callToActions as CallToAction[];
  }

  return {
    props,
  };
};
