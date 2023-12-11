import { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../libs/session";
import { supabase } from "../../libs/supabase";

export default withIronSessionApiRoute(collectClickRoute, sessionOptions);

async function collectClickRoute(req: NextApiRequest, res: NextApiResponse) {
  const { id, venueId, nfcId } = req.body;
  console.log(5555555);
  let timeToFinish = 30 * 60 * 1000;

  if (req.session.customer) {
    if (+new Date() - req.session.customer < timeToFinish) {
      //if a customer is for the first time on the front page
      //give the customer 30 mins to finish the reviews
      console.log(1);
      await addEntryToDb(id, venueId, nfcId, res);
    } else {
      //after 30 mins dont collect any more data
      //preventing so multiple reviews by the same customer
      console.log(3);
      res.json({
        error: true,
        message: "Data on this device collected already",
      });
    }
  } else {
    //if there is no customer session
    //record the link click
    console.log(4);
    await addEntryToDb(id, venueId, nfcId, res);
  }
}

async function addEntryToDb(
  id: string,
  venueId: string,
  nfcId: string,
  res: NextApiResponse
) {
  console.log("add to db");

  //get active_employee_id that is currently handling the nfc device
  const { data: nfc, error: nfcError } = await supabase
    .from("nfcs")
    .select("id, active_employee_id")
    .match({ id: nfcId })
    .single();
  console.log("nfc", nfc);
  const activeEmployeeId = nfc?.active_employee_id;
  console.log({ nfcError });
  //insert record into the db that a link has been visited
  const { error } = await supabase.from("venue_links_clicks").insert({
    nfc_id: nfc?.id,
    venue_id: venueId,
    venue_link_id: id,
    active_employee_id: activeEmployeeId,
  });
  console.log(6, error);
  res.json({
    error: false,
    message: "Link click is collected",
  });
}
