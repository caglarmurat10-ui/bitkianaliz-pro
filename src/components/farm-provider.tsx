"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { isDemoMode } from "@/lib/config";
import {
  getActiveFarmId,
  getFarms,
  setActiveFarmId as demoSetActiveFarm,
  subscribeStore,
} from "@/lib/demo-store";
import type { Farm } from "@/lib/types";

type FarmContextValue = {
  farms: Farm[];
  activeFarm: Farm | null;
  setActiveFarmId: (id: string) => void;
  loading: boolean;
  refresh: () => Promise<void>;
};

const FarmContext = createContext<FarmContextValue | null>(null);
const STORAGE_KEY = "bitki_active_farm";

export function FarmProvider({ children }: { children: React.ReactNode }) {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [activeFarmId, setActiveFarmIdState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (isDemoMode()) {
      const list = getFarms();
      setFarms(list);
      const saved = getActiveFarmId() || list[0]?.id || null;
      setActiveFarmIdState(saved);
      setLoading(false);
      return;
    }

    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setFarms([]);
        setLoading(false);
        return;
      }

      const { data: owned } = await supabase.from("farms").select("*").eq("owner_id", user.id);
      const { data: memberships } = await supabase
        .from("farm_members")
        .select("farm_id, farms(*)")
        .eq("user_id", user.id);

      const map = new Map<string, Farm>();
      (owned || []).forEach((f) => map.set(f.id, f as Farm));
      (memberships || []).forEach((m) => {
        const farm = m.farms as unknown as Farm | null;
        if (farm) map.set(farm.id, farm);
      });
      const list = Array.from(map.values());
      setFarms(list);

      const saved = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
      if (saved && list.some((f) => f.id === saved)) setActiveFarmIdState(saved);
      else if (list[0]) {
        setActiveFarmIdState(list[0].id);
        localStorage.setItem(STORAGE_KEY, list[0].id);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    if (isDemoMode()) return subscribeStore(() => refresh());

    let cleanup = () => {};
    (async () => {
      try {
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        const channel = supabase
          .channel("farms-realtime")
          .on("postgres_changes", { event: "*", schema: "public", table: "farms" }, () => refresh())
          .on("postgres_changes", { event: "*", schema: "public", table: "farm_members" }, () => refresh())
          .subscribe();
        cleanup = () => {
          supabase.removeChannel(channel);
        };
      } catch {
        /* demo / missing config */
      }
    })();
    return () => cleanup();
  }, [refresh]);

  const setActiveFarmId = (id: string) => {
    setActiveFarmIdState(id);
    if (isDemoMode()) demoSetActiveFarm(id);
    else localStorage.setItem(STORAGE_KEY, id);
  };

  const value = useMemo(
    () => ({
      farms,
      activeFarm: farms.find((f) => f.id === activeFarmId) || farms[0] || null,
      setActiveFarmId,
      loading,
      refresh,
    }),
    [farms, activeFarmId, loading, refresh]
  );

  return <FarmContext.Provider value={value}>{children}</FarmContext.Provider>;
}

export function useFarm() {
  const ctx = useContext(FarmContext);
  if (!ctx) throw new Error("useFarm must be used within FarmProvider");
  return ctx;
}
