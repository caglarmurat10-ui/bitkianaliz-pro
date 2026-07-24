"use client";

import { FormEvent, useEffect, useState } from "react";
import { AppProviders } from "@/components/app-providers";
import { useFarm } from "@/components/farm-provider";
import { AGRI_ITEMS } from "@/data/agri-data";
import { isDemoMode } from "@/lib/config";
import {
  addApplication,
  checkRotation,
  getApplications,
  getDemoSession,
  subscribeStore,
} from "@/lib/demo-store";
import type { ApplicationRecord, AppItemType } from "@/lib/types";
import { format, parseISO } from "date-fns";
import { tr } from "date-fns/locale";
import { AlertTriangle } from "lucide-react";

function CalendarContent() {
  const { activeFarm } = useFarm();
  const [apps, setApps] = useState<ApplicationRecord[]>([]);
  const [itemId, setItemId] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [unit, setUnit] = useState("kg");
  const [scheduledAt, setScheduledAt] = useState("");
  const [notes, setNotes] = useState("");
  const [rotationWarn, setRotationWarn] = useState<string | null>(null);

  useEffect(() => {
    if (!activeFarm) return;
    if (isDemoMode()) {
      const load = () => setApps(getApplications(activeFarm.id));
      load();
      return subscribeStore(load);
    }
  }, [activeFarm]);

  const onItemChange = (id: string) => {
    setItemId(id);
    const item = AGRI_ITEMS.find((i) => i.id === id);
    if (item && activeFarm && isDemoMode()) {
      const hit = checkRotation(activeFarm.id, null, item.activeIngredient, item.name);
      setRotationWarn(
        hit
          ? `Rotasyon uyarısı: ${item.activeIngredient || item.name} son 15 günde kullanılmış.`
          : null
      );
    } else setRotationWarn(null);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!activeFarm || !isDemoMode()) return;
    const session = getDemoSession();
    const item = AGRI_ITEMS.find((i) => i.id === itemId);
    if (!session || !item) return;

    addApplication({
      farm_id: activeFarm.id,
      parcel_id: null,
      user_id: session.userId,
      item_id: item.id,
      item_name: item.name,
      active_ingredient: item.activeIngredient || item.content || null,
      type: item.category as AppItemType,
      quantity: Number(quantity) || 0,
      unit,
      scheduled_at: scheduledAt ? new Date(scheduledAt).toISOString() : null,
      applied_at: scheduledAt ? null : new Date().toISOString(),
      notes: notes || null,
    });
    setNotes("");
    setQuantity("1");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <form onSubmit={onSubmit} className="space-y-3 rounded-3xl border border-white/10 bg-slate-900/60 p-6 lg:col-span-2">
        <h2 className="font-bold text-white">Hızlı kayıt</h2>
        <p className="text-xs text-slate-500">Detaylı program için Gübreleme / İlaçlama menüsünü kullanın.</p>
        <select className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white" value={itemId} onChange={(e) => onItemChange(e.target.value)} required>
          <option value="">Ürün seçin</option>
          {AGRI_ITEMS.map((i) => (
            <option key={i.id} value={i.id}>{i.category}: {i.name}</option>
          ))}
        </select>
        <div className="grid grid-cols-2 gap-2">
          <input className="rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
          <input className="rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white" value={unit} onChange={(e) => setUnit(e.target.value)} />
        </div>
        <input className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white" type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} />
        <textarea className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Not" />
        {rotationWarn && (
          <div className="flex gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-100">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            {rotationWarn}
          </div>
        )}
        <button className="w-full rounded-xl bg-emerald-600 py-2 font-semibold text-white">Kaydet</button>
      </form>
      <div className="space-y-3 lg:col-span-3">
        {apps.map((a) => (
          <div key={a.id} className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="font-semibold text-white">{a.item_name}</p>
              <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-bold text-slate-300">{a.type}</span>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              {format(parseISO(a.scheduled_at || a.applied_at || a.created_at), "d MMMM yyyy HH:mm", { locale: tr })}
              {a.quantity != null ? ` · ${a.quantity} ${a.unit || ""}` : ""}
            </p>
          </div>
        ))}
        {apps.length === 0 && <p className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-slate-500">Kayıt yok</p>}
      </div>
    </div>
  );
}

export default function CalendarPage() {
  return (
    <AppProviders title="Takvim">
      <CalendarContent />
    </AppProviders>
  );
}
