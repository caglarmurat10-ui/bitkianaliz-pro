"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { AppProviders } from "@/components/app-providers";
import { DISEASES, plantsInCatalog } from "@/data/diseases";
import type { Disease } from "@/lib/types";
import { Leaf, Search, X, AlertTriangle } from "lucide-react";

const SEV: Record<string, string> = {
  low: "Düşük",
  medium: "Orta",
  high: "Yüksek",
  critical: "Kritik",
};

const SEV_TONE: Record<string, string> = {
  low: "bg-emerald-500/20 text-emerald-300",
  medium: "bg-amber-500/20 text-amber-200",
  high: "bg-orange-500/20 text-orange-200",
  critical: "bg-rose-500/20 text-rose-200",
};

function DiseaseCard({
  d,
  focused,
  onOpen,
}: {
  d: Disease;
  focused: boolean;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      id={d.id}
      onClick={onOpen}
      className={`overflow-hidden rounded-2xl border text-left transition ${
        focused
          ? "border-emerald-500/60 bg-emerald-500/10 ring-2 ring-emerald-500/30"
          : "border-white/10 bg-slate-900/60 hover:border-white/25"
      }`}
    >
      <div className="relative aspect-[16/10] w-full bg-slate-950">
        <Image src={d.image} alt={d.name} fill className="object-cover" unoptimized priority={focused} />
        <span className={`absolute right-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-bold ${SEV_TONE[d.severity_hint]}`}>
          {SEV[d.severity_hint]}
        </span>
      </div>
      <div className="p-3 sm:p-4">
        <div className="mb-1 flex items-start gap-2">
          <Leaf className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
          <div className="min-w-0">
            <h2 className="truncate text-sm font-bold text-white sm:text-base">{d.name}</h2>
            <p className="truncate text-[11px] text-slate-400 sm:text-xs">
              {d.plant}
              {d.pathogen ? ` · ${d.pathogen}` : ""}
            </p>
          </div>
        </div>
        <p className="line-clamp-2 text-xs text-slate-300">{d.symptoms[0]}</p>
      </div>
    </button>
  );
}

function DiseaseDetail({ d, onClose }: { d: Disease; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 sm:items-center sm:p-4" onClick={onClose}>
      <div
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-white/10 bg-slate-950 sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-[16/10] w-full">
          <Image src={d.image} alt={d.name} fill className="object-cover" unoptimized />
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 rounded-full bg-black/60 p-2 text-white"
            aria-label="Kapat"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-4 p-4 pb-8 sm:p-6">
          <div>
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold text-white">{d.name}</h2>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${SEV_TONE[d.severity_hint]}`}>
                {SEV[d.severity_hint]}
              </span>
            </div>
            <p className="text-sm text-slate-400">
              {d.plant}
              {d.pathogen ? ` · ${d.pathogen}` : ""}
            </p>
          </div>

          <section>
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">Belirtiler</h3>
            <ul className="space-y-1.5 text-sm text-slate-200">
              {d.symptoms.map((s) => (
                <li key={s} className="flex gap-2">
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400" />
                  {s}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">Kültürel önlem</h3>
            <ul className="list-inside list-disc text-sm text-slate-300">
              {d.cultural_measures.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </section>

          {d.chemical_measures.length > 0 && (
            <section>
              <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">Kimyasal öneri</h3>
              <ul className="list-inside list-disc text-sm text-emerald-200/90">
                {d.chemical_measures.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

function DiseasesContent() {
  const params = useSearchParams();
  const focusId = params.get("id");
  const [q, setQ] = useState("");
  const [plant, setPlant] = useState("Tümü");
  const [openId, setOpenId] = useState<string | null>(focusId);

  useEffect(() => {
    if (focusId) {
      setOpenId(focusId);
      const el = document.getElementById(focusId);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [focusId]);

  const plants = useMemo(() => ["Tümü", ...plantsInCatalog()], []);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return DISEASES.filter((d) => {
      if (plant !== "Tümü" && d.plant !== plant) return false;
      if (!query) return true;
      return (
        d.name.toLowerCase().includes(query) ||
        d.plant.toLowerCase().includes(query) ||
        (d.pathogen || "").toLowerCase().includes(query) ||
        d.symptoms.some((s) => s.toLowerCase().includes(query))
      );
    });
  }, [q, plant]);

  const open = DISEASES.find((d) => d.id === openId) || null;

  return (
    <div className="space-y-4 pb-20 md:pb-0">
      <div className="sticky top-0 z-20 -mx-4 space-y-3 border-b border-white/5 bg-slate-950/95 px-4 py-3 backdrop-blur md:static md:mx-0 md:border-0 md:bg-transparent md:px-0 md:py-0">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Hastalık, bitki veya belirti ara..."
            className="w-full rounded-xl border border-white/10 bg-slate-900 py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-slate-500"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {plants.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPlant(p)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${
                plant === p ? "bg-emerald-600 text-white" : "bg-white/5 text-slate-300"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-500">{filtered.length} hastalık</p>
      </div>

      <div className="grid grid-cols-1 gap-3 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((d) => (
          <DiseaseCard key={d.id} d={d} focused={focusId === d.id} onOpen={() => setOpenId(d.id)} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="rounded-2xl border border-white/10 bg-slate-900/50 p-6 text-center text-sm text-slate-400">
          Eşleşen hastalık yok. Aramayı veya bitki filtresini değiştirin.
        </p>
      )}

      {open && <DiseaseDetail d={open} onClose={() => setOpenId(null)} />}
    </div>
  );
}

export default function DiseasesPage() {
  return (
    <AppProviders title="Hastalık Kütüphanesi">
      <Suspense fallback={<p className="text-slate-400">Yükleniyor…</p>}>
        <DiseasesContent />
      </Suspense>
    </AppProviders>
  );
}
