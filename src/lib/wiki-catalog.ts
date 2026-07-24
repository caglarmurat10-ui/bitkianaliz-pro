import { CATALOG_SEEDS, type CatalogSeed } from "@/data/diseases";
import type { Disease } from "@/lib/types";

const UA = "BitkiAnalizPro/3.0 (https://bitkianaliz-pro.vercel.app; agricultural-education)";

export type EnrichedCatalogItem = Disease & {
  wikiExtract?: string | null;
  wikiUrl?: string | null;
  wikiDescription?: string | null;
  imageSource?: "openverse" | "wikipedia" | "local";
  online: boolean;
};

type WikiSummary = {
  title?: string;
  description?: string;
  extract?: string;
  content_urls?: { desktop?: { page?: string } };
  thumbnail?: { source?: string };
  originalimage?: { source?: string };
  type?: string;
};

type OpenverseHit = {
  title?: string;
  url?: string;
  thumbnail?: string;
};

const memory = new Map<string, { at: number; data: EnrichedCatalogItem[] }>();
const TTL_MS = 1000 * 60 * 60 * 12; // 12 saat

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA, Accept: "application/json" },
      next: { revalidate: 43200 },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

async function wikiSummary(lang: "en" | "tr", title: string): Promise<WikiSummary | null> {
  const encoded = encodeURIComponent(title);
  const data = await fetchJson<WikiSummary>(
    `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encoded}`
  );
  if (!data || data.type === "disambiguation" || data.type === "notfound") return null;
  return data;
}

async function openverseImage(query: string): Promise<string | null> {
  const q = encodeURIComponent(query);
  const data = await fetchJson<{ results?: OpenverseHit[] }>(
    `https://api.openverse.org/v1/images/?q=${q}&page_size=5&license=cc0,pdm,by,by-sa`
  );
  const hit = data?.results?.find((r) => r.thumbnail || r.url);
  return hit?.thumbnail || hit?.url || null;
}

async function enrichOne(seed: CatalogSeed): Promise<EnrichedCatalogItem> {
  const local = `/catalog/${seed.id}.svg`;
  let image = seed.image || local;
  let imageSource: EnrichedCatalogItem["imageSource"] = "local";
  let wikiExtract: string | null = null;
  let wikiUrl: string | null = null;
  let wikiDescription: string | null = null;

  // 1) Wikipedia (TR sonra EN) — metin + olası görsel
  const wikiOrder: Array<{ lang: "tr" | "en"; title?: string }> = [
    { lang: "tr", title: seed.wiki?.tr },
    { lang: "en", title: seed.wiki?.en },
  ];

  for (const w of wikiOrder) {
    if (!w.title) continue;
    const summary = await wikiSummary(w.lang, w.title);
    if (!summary) continue;
    if (!wikiExtract && summary.extract) wikiExtract = summary.extract;
    if (!wikiDescription && summary.description) wikiDescription = summary.description;
    if (!wikiUrl) wikiUrl = summary.content_urls?.desktop?.page || null;
    const thumb = summary.originalimage?.source || summary.thumbnail?.source;
    if (thumb && imageSource === "local") {
      image = thumb;
      imageSource = "wikipedia";
    }
    if (wikiExtract && imageSource !== "local") break;
  }

  // 2) Openverse — daha iyi foto yoksa / yerel kaldıysa
  if (imageSource === "local" && seed.openverseQuery) {
    const ov = await openverseImage(seed.openverseQuery);
    if (ov) {
      image = ov;
      imageSource = "openverse";
    }
  }

  // 3) Pathogen adı ile Openverse son deneme
  if (imageSource === "local" && seed.pathogen) {
    const ov = await openverseImage(seed.pathogen);
    if (ov) {
      image = ov;
      imageSource = "openverse";
    }
  }

  return {
    id: seed.id,
    kind: seed.kind,
    plant: seed.plant,
    name: seed.name,
    pathogen: seed.pathogen,
    symptoms: seed.symptoms,
    cultural_measures: seed.cultural_measures,
    biological_measures: seed.biological_measures || [],
    chemical_measures: seed.chemical_measures,
    severity_hint: seed.severity_hint,
    image,
    wikiExtract,
    wikiUrl,
    wikiDescription,
    imageSource,
    online: imageSource !== "local",
  };
}

export async function getEnrichedCatalog(): Promise<EnrichedCatalogItem[]> {
  const cached = memory.get("all");
  if (cached && Date.now() - cached.at < TTL_MS) return cached.data;

  // Paralel ama nazik: küçük gruplar
  const out: EnrichedCatalogItem[] = [];
  const chunk = 4;
  for (let i = 0; i < CATALOG_SEEDS.length; i += chunk) {
    const slice = CATALOG_SEEDS.slice(i, i + chunk);
    const part = await Promise.all(slice.map(enrichOne));
    out.push(...part);
  }

  memory.set("all", { at: Date.now(), data: out });
  return out;
}

export async function searchOnlineCatalog(query: string): Promise<EnrichedCatalogItem[]> {
  const q = query.trim();
  if (!q) return getEnrichedCatalog();

  const base = await getEnrichedCatalog();
  const localHits = base.filter((d) => {
    const blob = `${d.name} ${d.plant} ${d.pathogen || ""} ${d.symptoms.join(" ")}`.toLowerCase();
    return blob.includes(q.toLowerCase());
  });

  // Wikipedia arama ile ek sonuçlar
  const search = await fetchJson<{
    query?: { search?: Array<{ title: string; snippet: string }> };
  }>(
    `https://tr.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
      q + " bitki hastalık OR zararlı"
    )}&srlimit=6&format=json&origin=*`
  );

  const extras: EnrichedCatalogItem[] = [];
  for (const hit of search?.query?.search || []) {
    if (localHits.some((l) => l.name === hit.title) || extras.some((e) => e.name === hit.title)) {
      continue;
    }
    const summary = await wikiSummary("tr", hit.title.replace(/ /g, "_"));
    if (!summary?.extract) continue;
    const id = `wiki-${hit.title
        .toLowerCase()
        .replace(/[^a-z0-9ğüşıöç]+/gi, "-")
        .slice(0, 40)}`;
    extras.push({
      id,
      kind: /böcek|sinek|bit|trips|güve|sineği|zararlı/i.test(hit.title + hit.snippet)
        ? "pest"
        : "disease",
      plant: "Genel",
      name: summary.title || hit.title,
      pathogen: summary.description || undefined,
      symptoms: [summary.extract.slice(0, 180) + (summary.extract.length > 180 ? "…" : "")],
      cultural_measures: ["Kaynak: Wikipedia — uzman/etiket doğrulaması yapın"],
      biological_measures: [],
      chemical_measures: [],
      severity_hint: "medium",
      image: summary.originalimage?.source || summary.thumbnail?.source || "/catalog/generic-healthy.svg",
      wikiExtract: summary.extract,
      wikiUrl: summary.content_urls?.desktop?.page || null,
      wikiDescription: summary.description || null,
      imageSource: summary.thumbnail ? "wikipedia" : "local",
      online: true,
    });
  }

  return [...localHits, ...extras];
}
