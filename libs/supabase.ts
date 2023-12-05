import { createClient } from "@supabase/supabase-js";

const APP_URL =
  process.env.NODE_ENV === process.env.NEXT_PUBLIC_VERCEL_URL
    ? "http://localhost:3000"
    : "";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export { supabase, APP_URL };
