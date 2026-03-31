import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

let browserClient: SupabaseClient<Database> | undefined;

/**
 * Browser-only client. Returns null during SSR/static generation or when env is missing
 * so `next build` does not throw when Vercel env is not yet applied at compile time.
 */
export function getSupabaseBrowserClient(): SupabaseClient<Database> | null {
  if (typeof window === "undefined") {
    return null;
  }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return null;
  }
  if (!browserClient) {
    browserClient = createBrowserClient(url, key) as SupabaseClient<Database>;
  }
  return browserClient;
}

export function createClient() {
  return getSupabaseBrowserClient();
}
