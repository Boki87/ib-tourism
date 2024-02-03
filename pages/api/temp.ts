import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../libs/supabase";

const types = {
  house_rules: "FaHome",
  sos: "FaPhoneVolume",
  transport: "FaTaxi",
  restaurants: "FaHamburger",
  menu: "FaClipboardList",
  tours: "FaShip",
  services: "FaStore",
  attractions: "FaMapMarkedAlt",
  offers: "FaTags",
  info: "FaInfo",
  info2: "FaInfoCircle",
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { data, error } = await supabase
    .from("external_offers")
    .select("venue_id, id, category_id, type, venues(id, owner_id)");

  if (!data) {
    return res.status(404).json({ message: "No data", data });
  }

  for (let offer of data) {
    if (!offer.category_id && offer.type !== "_") {
      const { venues, venue_id, type } = offer;
      // @ts-ignore
      const { owner_id } = venues;

      const icon = types[type as keyof typeof types];
      //check if category with title and venu_id and owner_id exists
      const { data: categoryCheck, error: categoryCheckError } = await supabase
        .from("service_categories")
        .select()
        .match({
          venue_id,
          title: type,
        });

      const title = type.split("_").join(" ").toLowerCase();
      if (categoryCheck?.length && categoryCheck?.length > 0) continue;

      // if no category create one with the title of the offer type prop
      const { data: newCategory, error: categoryError } = await supabase
        .from("service_categories")
        .insert({
          icon,
          title,
          venue_id,
          owner_id,
        })
        .select()
        .single();

      if (!newCategory) continue;

      const { error } = await supabase
        .from("external_offers")
        .update({ category_id: newCategory.id })
        .match({
          id: offer.id,
        });

      if (error) {
        console.error(error);
      }

      console.log(
        "Updated offer: ",
        offer,
        "and created category: ",
        newCategory,
      );
    }
  }

  return res.status(200).json({ message: "All done" });
}
