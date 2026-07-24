"use client";

import { useEffect } from "react";
import { hasSupabaseConfig } from "@/lib/config";

/** Subscribes to farm-scoped realtime changes when Supabase is configured. */
export function RealtimeSync({ farmId, onChange }: { farmId?: string | null; onChange?: () => void }) {
  useEffect(() => {
    if (!farmId || !hasSupabaseConfig()) return;

    let channel: { unsubscribe: () => void } | null = null;

    (async () => {
      try {
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        channel = supabase
          .channel(`farm-${farmId}`)
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "applications", filter: `farm_id=eq.${farmId}` },
            () => onChange?.()
          )
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "inventory_items", filter: `farm_id=eq.${farmId}` },
            () => onChange?.()
          )
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "analyses", filter: `farm_id=eq.${farmId}` },
            () => onChange?.()
          )
          .subscribe();
      } catch (e) {
        console.warn("Realtime unavailable", e);
      }
    })();

    return () => {
      channel?.unsubscribe();
    };
  }, [farmId, onChange]);

  return null;
}
