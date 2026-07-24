"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AppProviders } from "@/components/app-providers";
import { DISEASES } from "@/data/diseases";
import type { Disease } from "@/lib/types";
import type { EnrichedCatalogItem } from "@/lib/wiki-catalog";
import {
  Bug,
  Leaf,
  Search,
  Shield,
  Sprout,
  X,
  AlertTriangle,
  FlaskConical,
  ExternalLink,
  RefreshCw,
  Globe,
} from "lucide-react";

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

type Tab = "all" | "disease" | "pest";

function CatalogImage({ src, alt }: { src: string; alt: string }) {
  const [err, setErr] = useState(false);
  if (err || !src) {
    return <div className="flex h-full w-full items-center justify-center bg-slate-900 text-xs text-slate-500">Görsel yok</div>;
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className="h-full w-full object-cover"
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setErr(true)}
    />
  );
}

function DiseaseCard({
  d,
  focused,
  onOpen,
}: {
  d: EnrichedCatalogItem;
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
        <CatalogImage src={d.image} alt={d.name} />
        <div className="absolute left-2 top-2 flex gap-1">
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
              d.kind === "pest" ? "bg-rose-500/80 text-white" : "bg-emerald-600/80 text-white"
            }`}
          >
            {d.kind === "pest" ? "Zararlı" : "Hastalık"}
          </span>
          {d.online && (
            <span className="rounded-full bg-sky-600/80 px-2 py-0.5 text-[10px] font-bold text-white">Online</span>
          )}
        </div>
        <span className={`absolute right-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-bold ${SEV_TONE[d.severity_hint]}`}>
          {SEV[d.severity_hint]}
        </span>
      </div>
      <div className="p-3 sm:p-4">
        <div className="mb-1 flex items-start gap-2">
          {d.kind === "pest" ? (
            <Bug className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
          ) : (
            <Leaf className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
          )}
          <div className="min-w-0">
            <h2 className="truncate text-sm font-bold text-white sm:text-base">{d.name}</h2>
            <p className="truncate text-[11px] text-slate-400 sm:text-xs">
              {d.plant}
              {d.pathogen ? ` · ${d.pathogen}` : ""}
            </p>
          </div>
        </div>
        <p className="line-clamp-2 text-xs text-slate-300">{d.wikiExtract || d.symptoms[0]}</p>
      </div>
    </button>
  );
}

function MeasureList({
  title,
  items,
  icon: Icon,
  tone,
}: {
  title: string;
  items: string[];
  icon: React.ComponentType<{ className?: string }>;
  tone: string;
}) {
  if (!items.length) return null;
  return (
    <section>
      <h3 className={`mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide ${tone}`}>
        <Icon className="h-3.5 w-3.5" />
        {title}
      </h3>
      <ul className="space-y-1.5 text-sm text-slate-200">
        {items.map((s) => (
          <li key={s} className="flex gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-60" />
            {s}
          </li>
        ))}
      </ul>
    </section>
  );
}

function DiseaseDetail({ d, onClose }: { d: EnrichedCatalogItem; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 sm:items-center sm:p-4" onClick={onClose}>
      <div
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-white/10 bg-slate-950 sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-[16/10] w-full">
          <CatalogImage src={d.image} alt={d.name} />
          <button type="button" onClick={onClose} className="absolute right-3 top-3 rounded-full bg-black/60 p-2 text-white" aria-label="Kapat">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-5 p-4 pb-8 sm:p-6">
          <div>
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold text-white">{d.name}</h2>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  d.kind === "pest" ? "bg-rose-500/20 text-rose-300" : "bg-emerald-500/20 text-emerald-300"
                }`}
              >
                {d.kind === "pest" ? "Zararlı" : "Hastalık"}
              </span>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${SEV_TONE[d.severity_hint]}`}>
                {SEV[d.severity_hint]}
              </span>
            </div>
            <p className="text-sm text-slate-400">
              {d.plant}
              {d.pathogen ? ` · ${d.pathogen}` : ""}
              {d.wikiDescription ? ` · ${d.wikiDescription}` : ""}
            </p>
          </div>

          {d.wikiExtract && (
            <section className="rounded-2xl border border-sky-500/20 bg-sky-500/5 p-4">
              <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-sky-300">
                <Globe className="h-3.5 w-3.5" /> Wikipedia özeti
              </p>
              <p className="text-sm leading-relaxed text-slate-200">{d.wikiExtract}</p>
              {d.wikiUrl && (
                <a
                  href={d.wikiUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-sky-300 hover:underline"
                >
                  Kaynağı aç <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </section>
          )}

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

          <div className="space-y-4 rounded-2xl border border-white/10 bg-slate-900/60 p-4">
            <p className="text-sm font-semibold text-white">Nasıl mücadele edilir?</p>
            <MeasureList title="Kültürel" items={d.cultural_measures} icon={Sprout} tone="text-emerald-400" />
            <MeasureList title="Biyolojik / doğal" items={d.biological_measures} icon={Shield} tone="text-sky-400" />
            <MeasureList title="Kimyasal" items={d.chemical_measures} icon={FlaskConical} tone="text-amber-400" />
          </div>
        </div>
      </div>
    </div>
  );
}

function toEnriched(d: Disease): EnrichedCatalogItem {
  return { ...d, online: false, imageSource: "local", biological_measures: d.biological_measures || [] };
}

function DiseasesContent() {
  const params = useSearchParams();
  const focusId = params.get("id");
  const [q, setQ] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [plant, setPlant] = useState("Tümü");
  const [tab, setTab] = useState<Tab>("all");
  const [openId, setOpenId] = useState<string | null>(focusId);
  const [items, setItems] = useState<EnrichedCatalogItem[]>(() => DISEASES.map(toEnriched));
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({ onlineCount: 0, count: DISEASES.length });
  const [error, setError] = useState<string | null>(null);

  const load = async (query = "") => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/catalog${query ? `?q=${encodeURIComponent(query)}` : ""}`);
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Yüklenemedi");
      setItems(data.items);
      setMeta({ onlineCount: data.onlineCount, count: data.count });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Online katalog alınamadı");
      setItems(DISEASES.map(toEnriched));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  useEffect(() => {
    if (focusId) {
      setOpenId(focusId);
      document.getElementById(focusId)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [focusId, items]);

  const plants = useMemo(() => ["Tümü", ...new Set(items.map((d) => d.plant))], [items]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return items.filter((d) => {
      if (tab !== "all" && d.kind !== tab) return false;
      if (plant !== "Tümü" && d.plant !== plant) return false;
      if (!query) return true;
      return (
        d.name.toLowerCase().includes(query) ||
        d.plant.toLowerCase().includes(query) ||
        (d.pathogen || "").toLowerCase().includes(query) ||
        (d.wikiExtract || "").toLowerCase().includes(query) ||
        d.symptoms.some((s) => s.toLowerCase().includes(query))
      );
    });
  }, [q, plant, tab, items]);

  const open = items.find((d) => d.id === openId) || null;

  return (
    <div className="space-y-4 pb-20 md:pb-0">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-sky-500/20 bg-sky-500/5 px-4 py-3 text-sm text-sky-100">
        <p className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          Görseller ve özetler Wikipedia + Openverse üzerinden online çekilir.
          {meta.onlineCount > 0 ? ` (${meta.onlineCount}/${meta.count} online)` : ""}
        </p>
        <button
          type="button"
          onClick={() => load(searchInput)}
          className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-2 py-1 text-xs font-semibold hover:bg-white/5"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Yenile
        </button>
      </div>

      <div className="sticky top-0 z-20 -mx-4 space-y-3 border-b border-white/5 bg-slate-950/95 px-4 py-3 backdrop-blur md:static md:mx-0 md:border-0 md:bg-transparent md:px-0 md:py-0">
        <div className="grid grid-cols-3 gap-1 rounded-xl bg-white/5 p-1">
          {(
            [
              { id: "all", label: "Tümü" },
              { id: "disease", label: "Hastalık" },
              { id: "pest", label: "Zararlı" },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`rounded-lg py-2 text-xs font-bold ${tab === t.id ? "bg-emerald-600 text-white" : "text-slate-400"}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            setQ(searchInput);
            void load(searchInput);
          }}
        >
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Online ara: mildiyö, beyazsine, zeytin sineği..."
              className="w-full rounded-xl border border-white/10 bg-slate-900 py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-slate-500"
            />
          </div>
          <button type="submit" className="rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white">
            Ara
          </button>
        </form>

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
        <p className="text-xs text-slate-500">
          {loading ? "Online kütüphane yükleniyor…" : `${filtered.length} kayıt`}
          {error ? ` · ${error}` : ""}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((d) => (
          <DiseaseCard key={d.id} d={d} focused={focusId === d.id} onOpen={() => setOpenId(d.id)} />
        ))}
      </div>

      {!loading && filtered.length === 0 && (
        <p className="rounded-2xl border border-white/10 bg-slate-900/50 p-6 text-center text-sm text-slate-400">Eşleşen kayıt yok.</p>
      )}

      {open && <DiseaseDetail d={open} onClose={() => setOpenId(null)} />}
    </div>
  );
}

export default function DiseasesPage() {
  return (
    <AppProviders title="Hastalık & Zararlılar">
      <Suspense fallback={<p className="text-slate-400">Yükleniyor…</p>}>
        <DiseasesContent />
      </Suspense>
    </AppProviders>
  );
}
