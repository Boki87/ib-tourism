import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../libs/supabase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { email } = req.body;
  console.log({ email });
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo:
      process.env.NODE_ENV === "development"
        ? "localhost:3002/admin/reset-password"
        : "https://ib-tourism.vercel.app/admin/reset-password",
  });

  console.log({ data, error });

  if (error) {
    return res.status(500).json({ error: true, message: "server_error" });
  }

  return res.status(200).json({ error: false, message: "email_sent" });
}
