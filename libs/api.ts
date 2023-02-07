import { supabase } from "./supabase";

async function fetchVenuesForOwner(id: string) {
  const { data, error } = await supabase
    .from("venues")
    .select()
    .match({ owner_id: id })
    .order("created_at", { ascending: true });
  return { data, error };
}

export { fetchVenuesForOwner };
