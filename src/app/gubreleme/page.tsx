"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { AppProviders } from "@/components/app-providers";
import { useFarm } from "@/components/farm-provider";
import { fertilizers } from "@/data/agri-data";
import { buildProgramSnapshot } from "@/lib/program";
import {
  addApplication,
  getApplications,
  getDemoSession,
  subscribeStore,
} from "@/lib/demo-store";
import type { AppItemType } from "@/lib/types";
import { format, parseISO } from "date-fns";
import { tr } from "date-fns/locale";
import { ArrowRight, History, Sprout } from "lucide-react";
import { CompatibilityChecker } from "@/components/compatibility-checker";

const CROPS = ["Genel", "Domates", "Zeytin", "Asma", "Buğday", "Elma", "Biber"];

function GubrelemeContent() {
  const { activeFarm } = useFarm();
  const [crop, setCrop] = useState("Genel");
  const [apps, setApps] = useState(getApplications());
  const [itemId, setItemId] = useState("");
  const [quantity, setQuantity] = useState("10");
  const [unit, setUnit] = useState("kg");
  const [notes, setNotes] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!activeFarm) return;
    const load = () => setApps(getApplications(activeFarm.id));
    load();
    return subscribeStore(load);
  }, [activeFarm]);

  const snapshot = useMemo(
    () => buildProgramSnapshot(apps, "GÜBRE", crop),
    [apps, crop]
  );

  const catalog = useMemo(() => {
    const q = search.toLowerCase();
    return fertilizers().filter(
      (i) =>
        !q ||
        i.name.toLowerCase().includes(q) ||
        (i.content || "").toLowerCase().includes(q) ||
        (i.nutrientRole || "").toLowerCase().includes(q)
    );
  }, [search]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const session = getDemoSession();
    if (!activeFarm || !session || !itemId) return;
    const item = fertilizers().find((i) => i.id === itemId);
    if (!item) return;
    addApplication({
      farm_id: activeFarm.id,
      parcel_id: null,
      user_id: session.userId,
      item_id: item.id,
      item_name: item.name,
      active_ingredient: item.content || null,
      type: "GÜBRE" as AppItemType,
      quantity: Number(quantity) || 0,
      unit,
      scheduled_at: null,
      applied_at: new Date().toISOString(),
      notes: notes || `Ürün: ${crop}`,
    });
    setNotes("");
  };

  const giveRecommended = (id: string) => {
    setItemId(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <p className="max-w-2xl text-sm text-slate-400">{snapshot.summary}</p>
        <label className="text-sm">
          <span className="mb-1 block text-xs text-slate-500">Ürün</span>
          <select
            className="rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white"
            value={crop}
            onChange={(e) => setCrop(e.target.value)}
          >
            {CROPS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-6">
          <div className="mb-4 flex items-center gap-2">
            <History className="h-5 w-5 text-amber-400" />
            <h2 className="font-bold text-white">Önce ne verdik?</h2>
          </div>
          {snapshot.lastGiven.length === 0 ? (
            <p className="text-sm text-slate-500">Kayıt yok.</p>
          ) : (
            <ul className="space-y-3">
              {snapshot.lastGiven.map((a) => (
                <li key={a.id} className="rounded-xl border border-white/5 bg-white/5 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-white">{a.item_name}</p>
                    <span className="text-[10px] text-slate-500">
                      {format(parseISO(a.applied_at || a.created_at), "d MMM yyyy", { locale: tr })}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-400">
                    {a.quantity != null ? `${a.quantity} ${a.unit || ""}` : ""}
                    {a.notes ? ` · ${a.notes}` : ""}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-6">
          <div className="mb-4 flex items-center gap-2">
            <ArrowRight className="h-5 w-5 text-emerald-400" />
            <h2 className="font-bold text-white">Şimdi ne vermeliyiz?</h2>
          </div>
          {snapshot.recommendations.length === 0 ? (
            <p className="text-sm text-slate-400">Şimdilik ek gübre gerekmiyor; aralık dolunca öneriler gelir.</p>
          ) : (
            <ul className="space-y-3">
              {snapshot.recommendations.map((r) => (
                <li key={r.item.id} className="rounded-xl border border-emerald-500/20 bg-slate-950/50 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-white">{r.item.name}</p>
                      <p className="text-xs text-emerald-300/80">{r.item.content} · {r.item.dosage}</p>
                      <p className="mt-2 text-xs text-slate-400">{r.reason}</p>
                      <p className="mt-1 text-[10px] uppercase tracking-wide text-slate-500">
                        {r.priority} öncelik · {r.dueLabel}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => giveRecommended(r.item.id)}
                      className="shrink-0 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white"
                    >
                      Seç
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <form onSubmit={onSubmit} className="space-y-3 rounded-3xl border border-white/10 bg-slate-900/60 p-6">
          <h2 className="flex items-center gap-2 font-bold text-white">
            <Sprout className="h-5 w-5 text-emerald-400" /> Uygulama kaydet
          </h2>
          <input
            className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white"
            placeholder="Kütüphanede ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white"
            value={itemId}
            onChange={(e) => setItemId(e.target.value)}
            required
          >
            <option value="">Gübre seçin ({catalog.length})</option>
            {catalog.map((i) => (
              <option key={i.id} value={i.id}>
                {i.name} {i.content ? `(${i.content})` : ""}
              </option>
            ))}
          </select>
          <div className="grid grid-cols-2 gap-2">
            <input className="rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
            <input className="rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white" value={unit} onChange={(e) => setUnit(e.target.value)} />
          </div>
          <textarea className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white" rows={2} placeholder="Not" value={notes} onChange={(e) => setNotes(e.target.value)} />
          <button className="w-full rounded-xl bg-emerald-600 py-2 font-semibold text-white">Kaydet</button>
        </form>

        <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-6 lg:col-span-2">
          <h2 className="mb-3 font-bold text-white">Gübre kütüphanesi ({fertilizers().length})</h2>
          <div className="grid max-h-96 gap-2 overflow-y-auto sm:grid-cols-2">
            {catalog.map((i) => (
              <button
                key={i.id}
                type="button"
                onClick={() => setItemId(i.id)}
                className={`rounded-xl border p-3 text-left text-sm transition ${
                  itemId === i.id ? "border-emerald-500/50 bg-emerald-500/10" : "border-white/5 bg-white/5 hover:border-white/20"
                }`}
              >
                <p className="font-semibold text-white">{i.name}</p>
                <p className="text-xs text-slate-400">{i.content} · {i.stage}</p>
                <p className="mt-1 text-[11px] text-slate-500">{i.dosage}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      <CompatibilityChecker filter="GÜBRE" compact />
    </div>
  );
}

export default function GubrelemePage() {
  return (
    <AppProviders title="Gübreleme Programı">
      <GubrelemeContent />
    </AppProviders>
  );
}
