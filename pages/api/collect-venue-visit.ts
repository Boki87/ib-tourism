import { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../libs/session";
import { supabase } from "../../libs/supabase";

export default withIronSessionApiRoute(collectVenueVisit, sessionOptions);

async function collectVenueVisit(req: NextApiRequest, res: NextApiResponse) {
  const { id: nfcId } = req.body;
  if (!req.session.customer) {
    recordVenueVisit(nfcId, res);
  } else {
    const oneDayTimespan = 60 * 1000 * 60 * 24;
    // const oneDayTimespan = 60 * 1000;

    if (+new Date() - req.session.customer > oneDayTimespan) {
      req.session.destroy();
      console.log("Destroy session");
    }

    res.status(401).json({
      error: true,
      message: "Customer visit already recorded",
    });
  }
}

async function recordVenueVisit(id: string, res: NextApiResponse) {
  const { data: nfcData, error: nfcError } = await supabase
    .from("nfcs")
    .select()
    .match({ id })
    .single();

  if (nfcError) {
    return res.status(404).json({
      error: true,
      message: "Nfc device not found",
    });
  }

  const { data: venueData, error: venueError } = await supabase
    .from("venues")
    .select()
    .match({ id: nfcData.venue_id })
    .single();

  if (venueError) {
    return res.status(404).json({
      error: true,
      message: "Venue not found",
    });
  }
  const { error } = await supabase.from("venue_visits").insert({
    venue_id: venueData.id,
    active_employee_id: nfcData.active_employee_id,
    nfc_id: nfcData.id,
  });
  if (error) {
    return res.status(500).json({
      error: true,
      message: "Error inserting record",
    });
  }

  res.json({
    error: false,
    message: "Venue visit recorded",
  });
}
