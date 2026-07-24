"use client";

import { useEffect, useState } from "react";
import { Activity, AlertTriangle, CloudRain, Package } from "lucide-react";
import {
  getActiveFarmId,
  getAnalyses,
  getApplications,
  getInventory,
  subscribeStore,
} from "@/lib/demo-store";
import type { WeatherData } from "@/lib/weather";

export function AssistantPanel({ weather }: { weather?: WeatherData | null }) {
  const [tips, setTips] = useState<string[]>([]);

  useEffect(() => {
    const build = () => {
      const farmId = getActiveFarmId() || undefined;
      const apps = getApplications(farmId);
      const inv = getInventory(farmId);
      const analyses = getAnalyses(farmId);
      const next: string[] = [];

      const fert = apps.filter((a) => a.type === "GÜBRE");
      const spray = apps.filter((a) => a.type === "İLAÇ");
      next.push(
        fert[0]
          ? `Son gübre: ${fert[0].item_name}. Program için Gübreleme menüsüne bakın.`
          : "Henüz gübre kaydı yok — Gübreleme programından başlayın."
      );
      next.push(
        spray[0]
          ? `Son ilaç: ${spray[0].item_name}. Rotasyon için İlaçlama menüsünü açın.`
          : "Henüz ilaç kaydı yok — İlaçlama programını kullanın."
      );

      const lowStock = inv.filter((i) => i.quantity <= i.min_threshold);
      if (lowStock.length) next.push(`Düşük stok: ${lowStock.map((i) => i.name).join(", ")}.`);

      const last = analyses[0];
      if (last) next.push(`Son teşhis: ${last.plant_name} — ${last.diagnosis}.`);

      if (weather && !weather.isSuitableForSpraying) {
        next.push(`İlaçlama ertelemesi: ${weather.sprayingWarning}`);
      } else if (weather?.isSuitableForSpraying) {
        next.push("Hava ilaçlama için uygun görünüyor.");
      }

      setTips(next);
    };

    build();
    return subscribeStore(build);
  }, [weather]);

  return (
    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-teal-950/80 to-slate-900/80 p-6 backdrop-blur-md">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-full bg-teal-500/20 p-3">
          <Activity className="h-6 w-6 text-teal-300" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Akıllı Asistan</h3>
          <p className="text-xs text-teal-200/70">Gübre / ilaç geçmişi ve sonraki adımlar</p>
        </div>
      </div>
      <ul className="space-y-3">
        {tips.map((tip, i) => (
          <li key={i} className="flex gap-3 rounded-xl bg-white/5 p-3 text-sm text-slate-200">
            {tip.includes("Düşük") ? (
              <Package className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
            ) : tip.includes("İlaçlama") || tip.includes("Hava") ? (
              <CloudRain className="mt-0.5 h-4 w-4 shrink-0 text-sky-400" />
            ) : (
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
            )}
            <span>{tip}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
