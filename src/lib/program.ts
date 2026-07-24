import { AGRI_ITEMS, fertilizers, pesticides, type AgriculturalItem } from "@/data/agri-data";
import type { ApplicationRecord } from "@/lib/types";
import { differenceInDays, parseISO } from "date-fns";

export type ProgramKind = "GÜBRE" | "İLAÇ";

export interface ProgramRecommendation {
  item: AgriculturalItem;
  reason: string;
  priority: "yüksek" | "orta" | "düşük";
  dueLabel: string;
}

export interface ProgramSnapshot {
  lastGiven: ApplicationRecord[];
  recommendations: ProgramRecommendation[];
  summary: string;
}

const FERT_SEQUENCE: Record<string, string[]> = {
  genel: ["g11", "g1", "g6", "g8", "g4", "g10"],
  domates: ["g30", "g25", "g6", "g4", "g24", "g17"],
  zeytin: ["g11", "g3", "g5", "g10", "g16"],
  asma: ["g2", "g1", "g8", "g4", "g23"],
  bugday: ["g14", "g1", "g13", "g5"],
  elma: ["g11", "g1", "g8", "g4", "g18"],
  biber: ["g30", "g12", "g4", "g24", "g17"],
};

const SPRAY_SEQUENCE: Record<string, string[]> = {
  genel: ["i29", "i6", "i7", "i2", "i30"],
  domates: ["i6", "i12", "i7", "i3", "i18"],
  zeytin: ["i29", "i28", "i10", "i5"],
  asma: ["i2", "i8", "i7", "i3"],
  bugday: ["i14", "i8", "i9"],
  elma: ["i16", "i13", "i10", "i3"],
  biber: ["i6", "i32", "i25", "i20"],
};

function cropKey(crop?: string | null) {
  const c = (crop || "genel").toLowerCase();
  if (c.includes("domat")) return "domates";
  if (c.includes("zeytin")) return "zeytin";
  if (c.includes("üzüm") || c.includes("asma")) return "asma";
  if (c.includes("buğday") || c.includes("bugday")) return "bugday";
  if (c.includes("elma")) return "elma";
  if (c.includes("biber")) return "biber";
  return "genel";
}

function appDate(a: ApplicationRecord) {
  return parseISO(a.applied_at || a.scheduled_at || a.created_at);
}

export function filterAppsByKind(apps: ApplicationRecord[], kind: ProgramKind) {
  return apps
    .filter((a) => a.type === kind)
    .sort((a, b) => appDate(b).getTime() - appDate(a).getTime());
}

export function buildProgramSnapshot(
  apps: ApplicationRecord[],
  kind: ProgramKind,
  crop?: string | null
): ProgramSnapshot {
  const lastGiven = filterAppsByKind(apps, kind).slice(0, 8);
  const key = cropKey(crop);
  const sequenceIds = kind === "GÜBRE" ? FERT_SEQUENCE[key] : SPRAY_SEQUENCE[key];
  const catalog = kind === "GÜBRE" ? fertilizers() : pesticides();

  const usedGroups = new Set(
    lastGiven
      .map((a) => {
        const item = AGRI_ITEMS.find((i) => i.id === a.item_id || i.name === a.item_name);
        return item?.rotationGroup || item?.nutrientRole || item?.activeIngredient;
      })
      .filter(Boolean) as string[]
  );

  const lastByRole = new Map<string, ApplicationRecord>();
  for (const a of lastGiven) {
    const item = AGRI_ITEMS.find((i) => i.id === a.item_id || i.name === a.item_name);
    const role = item?.nutrientRole || item?.pestClass || item?.rotationGroup || a.item_name;
    if (!lastByRole.has(role)) lastByRole.set(role, a);
  }

  const recommendations: ProgramRecommendation[] = [];

  for (const id of sequenceIds) {
    const item = catalog.find((i) => i.id === id);
    if (!item) continue;

    const role = item.nutrientRole || item.pestClass || item.rotationGroup || item.id;
    const last = lastByRole.get(role) || lastGiven.find((a) => a.item_id === item.id || a.item_name === item.name);
    const interval = item.intervalDays ?? 14;

    if (!last) {
      recommendations.push({
        item,
        reason: `Programda sıradaki adım (${item.stage || "genel"}). Henüz bu gruptan uygulama yok.`,
        priority: "yüksek",
        dueLabel: "Şimdi verilebilir",
      });
      continue;
    }

    const days = differenceInDays(new Date(), appDate(last));
    if (days >= interval) {
      const sameGroup = item.rotationGroup && usedGroups.has(item.rotationGroup);
      recommendations.push({
        item,
        reason: last
          ? `Son ${last.item_name} ${days} gün önce. Önerilen aralık ~${interval} gün.${sameGroup && kind === "İLAÇ" ? " Mümkünse farklı rotasyon grubuna geçin." : ""}`
          : "Zamanı geldi.",
        priority: days >= interval * 1.5 ? "yüksek" : "orta",
        dueLabel: `${days} gündür bekliyor`,
      });
    }
  }

  // Fill with alternatives avoiding same rotation group recently
  if (recommendations.length < 3) {
    for (const item of catalog) {
      if (recommendations.some((r) => r.item.id === item.id)) continue;
      if (item.rotationGroup && usedGroups.has(item.rotationGroup) && kind === "İLAÇ") continue;
      const last = lastGiven.find((a) => a.item_id === item.id || a.item_name === item.name);
      const days = last ? differenceInDays(new Date(), appDate(last)) : 999;
      const interval = item.intervalDays ?? 21;
      if (days < interval) continue;
      recommendations.push({
        item,
        reason: kind === "GÜBRE"
          ? `Eksik/rotasyon: ${item.nutrientRole || "besin"} ihtiyacı için alternatif.`
          : `Farklı etki grubu (${item.rotationGroup || item.pestClass}) ile direnç riskini azaltın.`,
        priority: "düşük",
        dueLabel: last ? `${days} gün ara` : "Yedek öneri",
      });
      if (recommendations.length >= 5) break;
    }
  }

  const summary =
    lastGiven.length === 0
      ? kind === "GÜBRE"
        ? "Henüz gübre kaydı yok. Aşağıdaki programla başlayın."
        : "Henüz ilaç kaydı yok. Koruyucu programla başlayın."
      : kind === "GÜBRE"
        ? `Son gübre: ${lastGiven[0].item_name}. Şimdi sıradaki besin adımlarına bakın.`
        : `Son ilaç: ${lastGiven[0].item_name}. Rotasyonlu sonraki uygulamayı seçin.`;

  return {
    lastGiven,
    recommendations: recommendations.slice(0, 6),
    summary,
  };
}
