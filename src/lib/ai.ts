import { GoogleGenerativeAI } from "@google/generative-ai";
import type { SeverityLevel } from "@/lib/types";
import { diseaseCatalogForPrompt, matchDisease, DISEASES } from "@/data/diseases";

const apiKey = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(apiKey || "");

export interface DiagnosisAlternative {
  name: string;
  diagnosis?: string;
  confidence: number;
  disease_id?: string | null;
}

export interface AnalysisResult {
  plantName: string;
  diagnosis: string;
  confidence: number;
  severity: SeverityLevel;
  alternatives: DiagnosisAlternative[];
  treatment: string[];
  fertilizer: string[];
  diseaseId: string | null;
  sprayTiming: string;
  /** Alias for older UI fields */
  sprayTimingNote?: string;
}

export interface WeatherContext {
  temp: number;
  humidity: number;
  windSpeed: number;
  description: string;
  isSuitableForSpraying: boolean;
  sprayingWarning: string;
}

const DISEASE_CATALOG = diseaseCatalogForPrompt();

function mapSeverity(raw: unknown): SeverityLevel {
  const s = String(raw || "").toLowerCase();
  if (["low", "düşük", "dusuk", "yok", "none"].includes(s)) return "low";
  if (["high", "yüksek", "yuksek"].includes(s)) return "high";
  if (["critical", "kritik"].includes(s)) return "critical";
  return "medium";
}

function normalizeResult(parsed: Record<string, unknown>): AnalysisResult {
  let diseaseId = (parsed.diseaseId as string | null) ?? null;
  if (diseaseId === "null" || diseaseId === "") diseaseId = null;

  const alternativesRaw = Array.isArray(parsed.alternatives) ? parsed.alternatives : [];
  const alternatives: DiagnosisAlternative[] = alternativesRaw.map((a) => {
    const item = a as Record<string, unknown>;
    return {
      name: String(item.name || item.diagnosis || "Alternatif"),
      diagnosis: String(item.diagnosis || item.name || "Alternatif"),
      confidence: Number(item.confidence) || 0,
      disease_id: (item.disease_id as string | null) ?? null,
    };
  });

  const sprayTiming =
    String(parsed.sprayTiming || parsed.sprayTimingNote || "Koşullar uygun olduğunda uygulayın.");

  return {
    plantName: String(parsed.plantName || "Bilinmeyen bitki"),
    diagnosis: String(parsed.diagnosis || "Belirsiz"),
    confidence: Number(parsed.confidence) || 0,
    severity: mapSeverity(parsed.severity),
    alternatives,
    treatment: Array.isArray(parsed.treatment) ? (parsed.treatment as string[]) : [],
    fertilizer: Array.isArray(parsed.fertilizer) ? (parsed.fertilizer as string[]) : [],
    diseaseId,
    sprayTiming,
    sprayTimingNote: sprayTiming,
  };
}

export async function analyzePlantImage(
  base64Image: string,
  weather?: WeatherContext | null,
  cropHint?: string | null
): Promise<AnalysisResult> {
  if (!apiKey) {
    return demoAnalyze(cropHint, weather);
  }

  const base64Data = base64Image.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, "");
  const mimeMatch = base64Image.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,/);
  const mimeType = mimeMatch?.[1] || "image/jpeg";

  const weatherBlock = weather
    ? `Hava bağlamı: ${weather.temp}°C, nem %${weather.humidity}, rüzgar ${weather.windSpeed} km/s, ${weather.description}. İlaçlama uygunluğu: ${weather.isSuitableForSpraying ? "uygun" : "uygun değil"} (${weather.sprayingWarning}).`
    : "Hava bağlamı yok.";

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
    },
  });

  const prompt = `Sen uzman bir ziraat mühendisisin. Bitki görüntüsünü analiz et.
${cropHint ? `Parsel ürün ipucu: ${cropHint}.` : ""}
${weatherBlock}

Bilinen hastalık kütüphanesi (diseaseId|bitki|ad):
${DISEASE_CATALOG}

Sadece şu JSON şemasını döndür:
{
  "plantName": string,
  "diagnosis": string,
  "confidence": number (0-100),
  "severity": "low"|"medium"|"high"|"critical",
  "alternatives": [{"name": string, "confidence": number}],
  "treatment": string[],
  "fertilizer": string[],
  "diseaseId": string|null,
  "sprayTiming": string
}

Kurallar:
- alternatives en fazla 3
- treatment ve fertilizer dizilerinde dozaj belirt
- sprayTiming hava bağlamına göre Türkçe kısa cümle`;

  try {
    const result = await model.generateContent([
      prompt,
      { inlineData: { data: base64Data, mimeType } },
    ]);

    const text = result.response.text();
    const clean = text.replace(/```json/gi, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(clean) as Record<string, unknown>;
    const normalized = normalizeResult(parsed);
    if (!normalized.diseaseId) {
      const matched = matchDisease(normalized.plantName, normalized.diagnosis);
      if (matched) normalized.diseaseId = matched.id;
    }
    return normalized;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Gemini Analysis Error:", message);
    // Anahtar hatalıysa veya kota doluysa demo ile devam et
    if (/API_KEY|api key|403|429|quota|invalid/i.test(message)) {
      return demoAnalyze(cropHint, weather);
    }
    throw new Error(`Analiz hatası: ${message}`);
  }
}

/** API anahtarı yokken katalogdan ürün ipucuna göre örnek teşhis */
function demoAnalyze(
  cropHint?: string | null,
  weather?: WeatherContext | null
): AnalysisResult {
  const hint = (cropHint || "").toLowerCase();
  const pool = DISEASES.filter((d) => d.id !== "generic-healthy");
  const byCrop =
    pool.find((d) => hint && d.plant.toLowerCase().includes(hint)) ||
    pool.find((d) => hint && hint.includes(d.plant.toLowerCase())) ||
    pool[0];

  const spray =
    weather && !weather.isSuitableForSpraying
      ? `Şu an ilaçlama önerilmez: ${weather.sprayingWarning}`
      : weather
        ? "Hava koşulları ilaçlama için uygun görünüyor."
        : "Koşullar uygun olduğunda uygulayın. (Demo mod — Gemini anahtarı yok)";

  return {
    plantName: byCrop.plant === "Genel" ? "Bitki" : byCrop.plant,
    diagnosis: `${byCrop.name} (demo teşhis)`,
    confidence: 72,
    severity: byCrop.severity_hint,
    alternatives: pool
      .filter((d) => d.id !== byCrop.id)
      .slice(0, 2)
      .map((d) => ({
        name: d.name,
        diagnosis: d.name,
        confidence: 40,
        disease_id: d.id,
      })),
    treatment: byCrop.chemical_measures.length
      ? byCrop.chemical_measures
      : byCrop.cultural_measures,
    fertilizer: ["Dengeli NPK — etiket dozu", "Mikro element yaprak gübresi — düşük doz"],
    diseaseId: byCrop.id,
    sprayTiming: spray,
    sprayTimingNote: spray,
  };
}
