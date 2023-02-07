import { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../libs/session";

export default withIronSessionApiRoute(setSessionRoute, sessionOptions);

async function setSessionRoute(req: NextApiRequest, res: NextApiResponse) {
  if (!req.session.customer) {
    //set session
    req.session.customer = +new Date();
    await req.session.save();
    res.json({
      error: false,
      message: "Session set",
    });
  } else {
    res.json({
      error: true,
      message: "Session already exists",
    });
  }
}
