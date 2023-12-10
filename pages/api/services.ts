import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../libs/supabase";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { venueId, type } = req.body;

  const { data: services, error: servicesError } = await supabase
    .from("external_offers")
    .select("*")
    .match({ venue_id: venueId, type });

  res.json({
    error: false,
    data: services,
  });
}
