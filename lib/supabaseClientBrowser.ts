"use client";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

if (!url || !anonKey) {
  // No throw here to avoid breaking dev tools when env isn't set yet
  console.warn("Missing NEXT_PUBLIC_SUPABASE_* env vars for browser client");
}

export const supabaseBrowser = createClient(url, anonKey);

export default supabaseBrowser;
