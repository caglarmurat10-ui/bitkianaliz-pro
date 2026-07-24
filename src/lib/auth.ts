import { cookies } from "next/headers";
import { isDemoMode } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";

export async function requireAuthUserId(): Promise<string | null> {
  if (isDemoMode()) {
    const cookieStore = await cookies();
    return cookieStore.get("bitki_demo_session")?.value ?? null;
  }

  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    return data.user?.id ?? null;
  } catch {
    return null;
  }
}
