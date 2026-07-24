"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { AppProviders } from "@/components/app-providers";
import { useFarm } from "@/components/farm-provider";
import { pesticides } from "@/data/agri-data";
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
import { ArrowRight, Bug, History } from "lucide-react";
import { CompatibilityChecker } from "@/components/compatibility-checker";

const CROPS = ["Genel", "Domates", "Zeytin", "Asma", "Buğday", "Elma", "Biber"];

function IlaclamaContent() {
  const { activeFarm } = useFarm();
  const [crop, setCrop] = useState("Genel");
  const [apps, setApps] = useState(getApplications());
  const [itemId, setItemId] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [unit, setUnit] = useState("L");
  const [notes, setNotes] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!activeFarm) return;
    const load = () => setApps(getApplications(activeFarm.id));
    load();
    return subscribeStore(load);
  }, [activeFarm]);

  const snapshot = useMemo(
    () => buildProgramSnapshot(apps, "İLAÇ", crop),
    [apps, crop]
  );

  const catalog = useMemo(() => {
    const q = search.toLowerCase();
    return pesticides().filter(
      (i) =>
        !q ||
        i.name.toLowerCase().includes(q) ||
        (i.activeIngredient || "").toLowerCase().includes(q) ||
        (i.pestClass || "").toLowerCase().includes(q) ||
        (i.rotationGroup || "").toLowerCase().includes(q)
    );
  }, [search]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const session = getDemoSession();
    if (!activeFarm || !session || !itemId) return;
    const item = pesticides().find((i) => i.id === itemId);
    if (!item) return;
    addApplication({
      farm_id: activeFarm.id,
      parcel_id: null,
      user_id: session.userId,
      item_id: item.id,
      item_name: item.name,
      active_ingredient: item.activeIngredient || null,
      type: "İLAÇ" as AppItemType,
      quantity: Number(quantity) || 0,
      unit,
      scheduled_at: null,
      applied_at: new Date().toISOString(),
      notes: notes || `Ürün: ${crop}`,
    });
    setNotes("");
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
            <h2 className="font-bold text-white">Önce ne ilaçladık?</h2>
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
                    {a.active_ingredient ? `Etken: ${a.active_ingredient}` : ""}
                    {a.quantity != null ? ` · ${a.quantity} ${a.unit || ""}` : ""}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-3xl border border-sky-500/20 bg-sky-500/5 p-6">
          <div className="mb-4 flex items-center gap-2">
            <ArrowRight className="h-5 w-5 text-sky-400" />
            <h2 className="font-bold text-white">Şimdi ne ilaçlamalıyız?</h2>
          </div>
          {snapshot.recommendations.length === 0 ? (
            <p className="text-sm text-slate-400">Bekleme süresi dolmadı veya kayıt yeterli.</p>
          ) : (
            <ul className="space-y-3">
              {snapshot.recommendations.map((r) => (
                <li key={r.item.id} className="rounded-xl border border-sky-500/20 bg-slate-950/50 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-white">{r.item.name}</p>
                      <p className="text-xs text-sky-300/80">
                        {r.item.activeIngredient} · grup {r.item.rotationGroup} · {r.item.dosage}
                      </p>
                      <p className="mt-2 text-xs text-slate-400">{r.reason}</p>
                      <p className="mt-1 text-[10px] uppercase tracking-wide text-slate-500">
                        {r.priority} · {r.dueLabel}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setItemId(r.item.id)}
                      className="shrink-0 rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-bold text-white"
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
            <Bug className="h-5 w-5 text-amber-400" /> Uygulama kaydet
          </h2>
          <input
            className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white"
            placeholder="İlaç / etken / grup ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white"
            value={itemId}
            onChange={(e) => setItemId(e.target.value)}
            required
          >
            <option value="">İlaç seçin ({catalog.length})</option>
            {catalog.map((i) => (
              <option key={i.id} value={i.id}>
                {i.name} ({i.activeIngredient})
              </option>
            ))}
          </select>
          <div className="grid grid-cols-2 gap-2">
            <input className="rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white" type="number" step="0.01" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
            <input className="rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white" value={unit} onChange={(e) => setUnit(e.target.value)} />
          </div>
          <textarea className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white" rows={2} placeholder="Not" value={notes} onChange={(e) => setNotes(e.target.value)} />
          <button className="w-full rounded-xl bg-sky-600 py-2 font-semibold text-white">Kaydet</button>
        </form>

        <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-6 lg:col-span-2">
          <h2 className="mb-3 font-bold text-white">İlaç kütüphanesi ({pesticides().length})</h2>
          <div className="grid max-h-96 gap-2 overflow-y-auto sm:grid-cols-2">
            {catalog.map((i) => (
              <button
                key={i.id}
                type="button"
                onClick={() => setItemId(i.id)}
                className={`rounded-xl border p-3 text-left text-sm transition ${
                  itemId === i.id ? "border-sky-500/50 bg-sky-500/10" : "border-white/5 bg-white/5 hover:border-white/20"
                }`}
              >
                <p className="font-semibold text-white">{i.name}</p>
                <p className="text-xs text-slate-400">
                  {i.pestClass} · grup {i.rotationGroup}
                </p>
                <p className="mt-1 text-[11px] text-slate-500">{i.dosage}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      <CompatibilityChecker filter="İLAÇ" compact />
    </div>
  );
}

export default function IlaclamaPage() {
  return (
    <AppProviders title="İlaçlama Programı">
      <IlaclamaContent />
    </AppProviders>
  );
}
