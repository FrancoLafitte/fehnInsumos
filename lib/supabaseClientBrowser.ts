"use client";
import { createBrowserClient } from "@supabase/ssr";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

if (!url || !anonKey) {
  console.warn("Missing NEXT_PUBLIC_SUPABASE_* env vars for browser client");
}

export const supabaseBrowser = createBrowserClient(url, anonKey);

export default supabaseBrowser;
