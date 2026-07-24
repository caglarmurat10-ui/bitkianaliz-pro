"use client";

import { useState } from "react";
import { AGRI_ITEMS } from "@/data/agri-data";
import { Search, Info, Sprout, Bug, Droplet } from "lucide-react";
import { AppProviders } from "@/components/app-providers";

function GuideContent() {
  const [search, setSearch] = useState("");
  const filteredItems = AGRI_ITEMS.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase()) ||
      (item.activeIngredient || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="mb-2 flex items-center gap-3 text-2xl font-bold text-white">
            <Info className="h-6 w-6 text-blue-400" />
            Zirai Bilgi Bankası
          </h2>
          <p className="text-slate-400">{filteredItems.length} kayıt</p>
        </div>
        <div className="relative w-full max-w-xl">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Gübre, ilaç, etken madde..."
            className="w-full rounded-2xl border border-white/10 bg-slate-900 py-3 pl-12 pr-4 text-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item) => (
          <div key={item.id} className="rounded-3xl border border-white/5 bg-slate-900 p-6">
            <div className="mb-4 flex items-start justify-between">
              <span
                className={`rounded-full px-4 py-1.5 text-xs font-bold ${
                  item.category === "GÜBRE"
                    ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                    : "border border-amber-500/20 bg-amber-500/10 text-amber-400"
                }`}
              >
                {item.category}
              </span>
              {item.category === "İLAÇ" ? <Bug className="h-6 w-6 text-slate-500" /> : <Sprout className="h-6 w-6 text-slate-500" />}
            </div>
            <h3 className="mb-2 text-xl font-bold text-white">{item.name}</h3>
            <p className="mb-6 line-clamp-2 text-sm text-slate-400">{item.description}</p>
            <div className="space-y-3 border-t border-white/5 pt-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase text-slate-500">
                  {item.category === "GÜBRE" ? "İçerik" : "Etken"}
                </p>
                <p className="rounded-lg bg-white/5 px-2 py-1 font-mono text-sm text-white">
                  {item.category === "GÜBRE" ? item.content : item.activeIngredient}
                </p>
              </div>
              {item.dosage && (
                <div className="flex items-start gap-3 rounded-xl bg-blue-900/20 p-3">
                  <Droplet className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
                  <p className="text-sm text-blue-100">{item.dosage}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default function GuidePage() {
  return (
    <AppProviders title="Rehber">
      <GuideContent />
    </AppProviders>
  );
}
