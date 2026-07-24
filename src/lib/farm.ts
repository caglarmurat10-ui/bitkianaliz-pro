import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

type Farm = Database["public"]["Tables"]["farms"]["Row"];

export async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { supabase, user: null, profile: null };
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  return { supabase, user, profile };
}

export async function getUserFarms(userId: string): Promise<Farm[]> {
  const supabase = await createClient();
  const { data: owned } = await supabase.from("farms").select("*").eq("owner_id", userId);
  const { data: memberships } = await supabase
    .from("farm_members")
    .select("farm_id, farms(*)")
    .eq("user_id", userId);

  const map = new Map<string, Farm>();
  (owned || []).forEach((f) => map.set(f.id, f));
  (memberships || []).forEach((m) => {
    const farm = m.farms as unknown as Farm | null;
    if (farm) map.set(farm.id, farm);
  });
  return Array.from(map.values());
}

export const ACTIVE_FARM_COOKIE = "bitki_active_farm";
