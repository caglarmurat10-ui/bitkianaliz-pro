"use client";

import { useEffect, useState } from "react";
import { AppProviders } from "@/components/app-providers";
import { useFarm } from "@/components/farm-provider";
import { AssistantPanel } from "@/components/assistant-panel";
import { ImageUpload } from "@/components/image-upload";
import { AnalysisResultCard } from "@/components/analysis-result";
import { CompatibilityChecker } from "@/components/compatibility-checker";
import { AnalysisResult } from "@/lib/ai";
import { WeatherData } from "@/lib/weather";
import { getWeatherAction } from "@/app/actions";
import {
  addAnalysis,
  getAnalyses,
  getDemoSession,
  subscribeStore,
} from "@/lib/demo-store";
import type { AnalysisRecord } from "@/lib/types";
import { format, parseISO } from "date-fns";
import { tr } from "date-fns/locale";
import { isDemoMode } from "@/lib/config";

function AnalyzeContent() {
  const { activeFarm } = useFarm();
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [history, setHistory] = useState<AnalysisRecord[]>([]);
  const [filterPlant, setFilterPlant] = useState("");
  const [crop, setCrop] = useState("Genel");

  useEffect(() => {
    if (!activeFarm) return;
    const load = () => setHistory(getAnalyses(activeFarm.id));
    load();
    return subscribeStore(load);
  }, [activeFarm]);

  useEffect(() => {
    if (!("geolocation" in navigator)) return;
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const result = await getWeatherAction(pos.coords.latitude, pos.coords.longitude);
      if (result.data) setWeather(result.data);
    });
  }, []);

  const handleImageSelected = async (base64Image: string) => {
    setIsLoading(true);
    setAnalysis(null);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64Image, weather, cropHint: crop }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Analiz başarısız");
      }
      const data = (await response.json()) as AnalysisResult;
      setAnalysis(data);
      const session = getDemoSession();
      if (session && activeFarm) {
        addAnalysis({
          user_id: session.userId,
          farm_id: activeFarm.id,
          parcel_id: null,
          image_path: base64Image.slice(0, 64),
          plant_name: data.plantName,
          diagnosis: data.diagnosis,
          confidence: data.confidence,
          severity: data.severity,
          disease_id: data.diseaseId,
          alternatives: (data.alternatives || []).map((a) => ({
            diagnosis: a.diagnosis || a.name,
            confidence: a.confidence,
            disease_id: a.disease_id,
          })),
          treatment: data.treatment,
          fertilizer: data.fertilizer,
          weather_snapshot: weather ? { ...weather } : null,
          spray_timing_note: data.sprayTimingNote || data.sprayTiming || null,
        });
      }
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : "Analiz hatası");
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = history.filter((h) =>
    filterPlant ? h.plant_name.toLowerCase().includes(filterPlant.toLowerCase()) : true
  );

  return (
    <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
      <div className="space-y-5 lg:col-span-8">
        {isDemoMode() && (
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
            <strong className="font-semibold">Demo teşhis aktif.</strong> Gemini API anahtarı yoksa ürün
            ipucuna göre katalogdan örnek sonuç üretilir. Gerçek AI için{" "}
            <code className="text-amber-50">.env.local</code> içine{" "}
            <code className="text-amber-50">GEMINI_API_KEY</code> ekleyin.
          </div>
        )}
        <div className="max-w-sm">
          <label className="mb-1 block text-xs text-slate-400">Ürün (ipucu)</label>
          <select
            className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2.5 text-white"
            value={crop}
            onChange={(e) => setCrop(e.target.value)}
          >
            {["Genel", "Domates", "Zeytin", "Asma", "Buğday", "Elma", "Biber", "Turunçgil"].map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 sm:rounded-[2rem] sm:p-8">
          <ImageUpload onImageSelected={handleImageSelected} isLoading={isLoading} />
          {analysis && <AnalysisResultCard result={analysis} />}
        </div>
        <CompatibilityChecker compact />
      </div>
      <div className="space-y-6 lg:col-span-4">
        <AssistantPanel weather={weather} />
        <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-5">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h3 className="font-bold text-white">Analiz geçmişi</h3>
            <input
              className="w-28 rounded-lg border border-white/10 bg-slate-950 px-2 py-1 text-xs text-white"
              placeholder="Filtre"
              value={filterPlant}
              onChange={(e) => setFilterPlant(e.target.value)}
            />
          </div>
          <div className="max-h-80 space-y-2 overflow-y-auto">
            {filtered.map((h) => (
              <div key={h.id} className="rounded-xl bg-white/5 p-3 text-sm">
                <p className="font-semibold text-white">{h.plant_name}</p>
                <p className="text-xs text-emerald-300">
                  {h.diagnosis} · %{h.confidence}
                </p>
                <p className="text-[10px] text-slate-500">
                  {format(parseISO(h.created_at), "d MMM HH:mm", { locale: tr })}
                </p>
              </div>
            ))}
            {filtered.length === 0 && <p className="text-xs text-slate-500">Kayıt yok</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AnalyzePage() {
  return (
    <AppProviders title="Yapay Zeka Teşhis">
      <AnalyzeContent />
    </AppProviders>
  );
}
