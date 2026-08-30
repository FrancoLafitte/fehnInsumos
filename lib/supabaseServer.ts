import { createClient } from "@supabase/supabase-js";

const url = (process.env.SUPABASE_URL ?? "") as string;
const serviceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY ?? "") as string;

if (!url || !serviceKey) {
  console.warn("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY for server client");
}

export const supabaseServer = url && serviceKey
  ? createClient(url, serviceKey, {
      auth: { persistSession: false },
    })
  : null;

export default supabaseServer;
