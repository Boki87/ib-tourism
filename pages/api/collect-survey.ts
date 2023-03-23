import { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../libs/session";
import { supabase } from "../../libs/supabase";
import { ReviewEntry } from "../../types/ReviewEntry";

export default withIronSessionApiRoute(collectSurvey, sessionOptions);

async function collectSurvey(req: NextApiRequest, res: NextApiResponse) {
  const { entries, email } = req.body;
  console.log("venue visit", req.session.customer);
  if (!req.session.customerSurvey) {
    recordSurveyEntry({ entries, email }, res);
    req.session.customerSurvey = +new Date();
    await req.session.save();
  } else {
    const oneDayTimespan = 60 * 1000 * 60 * 24;
    // const oneDayTimespan = 60 * 1000;

    if (+new Date() - req.session.customerSurvey > oneDayTimespan) {
      req.session.customerSurvey = undefined;
      req.session.save();
      //reset survey cookie
    }
    res.status(401).json({
      error: true,
      message: "Customer survey already recorded",
    });
  }
}

async function recordSurveyEntry(
  {
    entries,
    email,
  }: {
    entries: ReviewEntry[];
    email: string;
  },
  res: NextApiResponse
) {
  const { data: entriesData, error: entriesError } = await supabase
    .from("review_entries")
    .insert(entries);

  if (entriesError) {
    return res.status(400).json({
      error: true,
      message: "Could not record survey",
    });
  }

  if (email !== "") {
    const { data, error } = await supabase
      .from("customer_emails")
      .insert([
        { email, venue_id: entries[0].venue_id, nfc_id: entries[0].nfc_id },
      ]);

    if (error) {
      return res.status(400).json({
        error: true,
        message: "Could not collect email",
      });
    }
  }

  res.json({
    error: false,
    message: "Successful entry",
    data: entriesData,
  });
  // return res.status(404).json({
  //   error: true,
  //   message: "Nfc device not found",
  // });
  //   res.json({
  //     error: false,
  //     message: "Venue visit recorded",
  //   });
}
