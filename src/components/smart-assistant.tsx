"use client";

import { useEffect, useState } from "react";
import { Lightbulb } from "lucide-react";
import { isDemoMode } from "@/lib/config";
import {
  getAnalyses,
  getApplications,
  getInventory,
} from "@/lib/demo-store";

export function SmartAssistant({ farmId }: { farmId?: string }) {
  const [tips, setTips] = useState<string[]>([]);

  useEffect(() => {
    if (!farmId) return;

    const loadDemo = () => {
      const apps = getApplications(farmId);
      const inv = getInventory(farmId);
      const analyses = getAnalyses(farmId);
      const next: string[] = [];
      if (apps.length > 0) next.push(`Takvimde ${apps.length} uygulama kaydı var.`);
      const low = inv.filter((i) => Number(i.quantity) <= Number(i.min_threshold));
      if (low.length > 0) next.push(`Düşük stok: ${low.map((i) => i.name).join(", ")}.`);
      const last = analyses[0];
      if (last?.severity && last.severity !== "low") {
        next.push(
          `Son teşhis (${last.diagnosis}) — ${last.spray_timing_note || "koşullara göre ilaçlama"}.`
        );
      }
      if (next.length === 0) next.push("Sistem hazır. Gübreleme/İlaçlama programına başlayın.");
      setTips(next);
    };

    if (isDemoMode()) {
      loadDemo();
      return;
    }

    (async () => {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const [apps, inv, analyses] = await Promise.all([
        supabase.from("applications").select("*").eq("farm_id", farmId).eq("status", "planned").limit(5),
        supabase.from("inventory_items").select("*").eq("farm_id", farmId),
        supabase
          .from("analyses")
          .select("*")
          .eq("farm_id", farmId)
          .order("created_at", { ascending: false })
          .limit(3),
      ]);
      const next: string[] = [];
      if ((apps.data || []).length > 0) {
        next.push(`Bu hafta ${apps.data!.length} planlı uygulama var.`);
      }
      const low = (inv.data || []).filter((i) => Number(i.quantity) <= Number(i.min_threshold));
      if (low.length > 0) next.push(`Düşük stok: ${low.map((i) => i.name).join(", ")}.`);
      const last = analyses.data?.[0];
      if (last && last.severity && last.severity !== "low") {
        next.push(
          `Son teşhis (${last.diagnosis}) — ${last.spray_timing || "koşullara göre"}.`
        );
      }
      if (next.length === 0) next.push("Sistem hazır. Gübreleme/İlaçlama programına başlayın.");
      setTips(next);
    })();
  }, [farmId]);

  return (
    <div className="rounded-3xl border border-teal-500/20 bg-gradient-to-br from-teal-900/40 to-slate-900/60 p-6">
      <div className="mb-3 flex items-center gap-2">
        <Lightbulb className="h-5 w-5 text-teal-300" />
        <h3 className="font-bold text-white">Akıllı Asistan</h3>
      </div>
      <ul className="space-y-2">
        {tips.map((t, i) => (
          <li key={i} className="text-sm leading-relaxed text-teal-100/90">
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}
