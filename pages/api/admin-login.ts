import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../libs/supabase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email } = req.body;

  const { data, error } = await supabase
    .from("owners")
    .select("*")
    .match({
      email,
    })
    .single();

  if (error) {
    return res.status(404).json({ error: true, message: "no_user" });
  }

  if (!data.is_setup) {
    return res.status(401).json({ error: true, message: "needs_setup" });
  }

  return res.status(200).json({ error: false, message: "ok" });
}
