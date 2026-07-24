import Link from "next/link";
import { AnalysisResult } from "@/lib/ai";
import { findDiseaseById } from "@/data/diseases";
import { CheckCircle2, AlertTriangle, Sprout, FlaskConical, Clock, BookOpen } from "lucide-react";

interface AnalysisResultCardProps {
  result: AnalysisResult;
}

const SEVERITY_TR: Record<string, string> = {
  low: "düşük",
  medium: "orta",
  high: "yüksek",
  critical: "kritik",
};

export function AnalysisResultCard({ result }: AnalysisResultCardProps) {
  const isHealthy = result.diagnosis.toLowerCase().includes("sağlıklı");
  const alternatives = result.alternatives || [];
  const spray = result.sprayTiming || result.sprayTimingNote;
  const disease = findDiseaseById(result.diseaseId);

  return (
    <div className="mx-auto mt-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/80 shadow-xl">
        {disease?.image && (
          <div className="relative aspect-[16/9] w-full border-b border-white/5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={disease.image} alt={disease.name} className="h-full w-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 to-transparent p-4 pt-12">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">Katalog eşleşmesi</p>
              <p className="text-sm font-bold text-white">{disease.name}</p>
            </div>
          </div>
        )}

        <div className={`p-4 sm:p-6 ${isHealthy ? "bg-emerald-500/10" : "bg-rose-500/10"}`}>
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h2 className="mb-1 text-xl font-bold text-white sm:text-2xl">{result.plantName}</h2>
              <div className="flex items-center gap-2">
                {isHealthy ? (
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
                ) : (
                  <AlertTriangle className="h-5 w-5 shrink-0 text-rose-400" />
                )}
                <span className={`font-semibold ${isHealthy ? "text-emerald-300" : "text-rose-300"}`}>
                  {result.diagnosis}
                </span>
              </div>
              {result.severity && (
                <p className="mt-2 text-xs uppercase tracking-wide text-slate-400">
                  Şiddet: {SEVERITY_TR[result.severity] || result.severity}
                </p>
              )}
            </div>
            <div className="shrink-0 rounded-full bg-white/10 px-3 py-1 text-sm font-bold text-white">
              %{Math.round(result.confidence)}
            </div>
          </div>
        </div>

        <div className="space-y-6 p-4 sm:p-6">
          {disease && (
            <Link
              href={`/diseases?id=${disease.id}`}
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm font-semibold text-emerald-200"
            >
              <BookOpen className="h-4 w-4" />
              Hastalık kartını aç (resimli)
            </Link>
          )}

          {spray && (
            <div className="flex items-start gap-3 rounded-xl border border-sky-500/20 bg-sky-500/10 p-4">
              <Clock className="mt-0.5 h-5 w-5 text-sky-400" />
              <div>
                <p className="text-sm font-semibold text-sky-300">İlaçlama Zamanlaması</p>
                <p className="mt-1 text-sm text-slate-300">{spray}</p>
              </div>
            </div>
          )}

          {alternatives.length > 0 && (
            <div>
              <h3 className="mb-2 font-semibold text-white">Alternatif Teşhisler</h3>
              <div className="flex flex-wrap gap-2">
                {alternatives.map((alt, i) => (
                  <span
                    key={i}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300"
                  >
                    {alt.name || alt.diagnosis} (%{Math.round(alt.confidence)})
                  </span>
                ))}
              </div>
            </div>
          )}

          {!isHealthy && result.treatment?.length > 0 && (
            <div>
              <div className="mb-3 flex items-center gap-2 text-amber-400">
                <FlaskConical className="h-5 w-5" />
                <h3 className="text-lg font-semibold text-white">Önerilen Tedavi</h3>
              </div>
              <ul className="space-y-2">
                {result.treatment.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 rounded-lg border border-amber-500/10 bg-amber-500/5 p-3 text-slate-300"
                  >
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-xs font-bold text-amber-300">
                      {index + 1}
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.fertilizer?.length > 0 && (
            <div>
              <div className="mb-3 flex items-center gap-2 text-emerald-400">
                <Sprout className="h-5 w-5" />
                <h3 className="text-lg font-semibold text-white">Gübreleme</h3>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {result.fertilizer.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-lg border border-emerald-500/10 bg-emerald-500/5 p-3 text-sm font-medium text-emerald-200"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
