"use client";

import { useMemo, useState } from "react";
import {
  AGRI_ITEMS,
  checkTankMix,
  CompatibilityStatus,
  fertilizers,
  pesticides,
} from "@/data/agri-data";
import { FlaskConical, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

type Filter = "ALL" | "GÜBRE" | "İLAÇ";

export function CompatibilityChecker({
  filter = "ALL",
  compact = false,
}: {
  filter?: Filter;
  compact?: boolean;
}) {
  const catalog = useMemo(() => {
    if (filter === "GÜBRE") return fertilizers();
    if (filter === "İLAÇ") return pesticides();
    return AGRI_ITEMS;
  }, [filter]);

  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [c, setC] = useState("");
  const [result, setResult] = useState<ReturnType<typeof checkTankMix> | null>(null);

  const run = () => {
    setResult(checkTankMix([a, b, c].filter(Boolean)));
  };

  const tone = (status: CompatibilityStatus) => {
    switch (status) {
      case "UYGUN":
        return "border-emerald-500/30 bg-emerald-500/10 text-emerald-200";
      case "RİSKLİ":
        return "border-amber-500/30 bg-amber-500/10 text-amber-200";
      case "YASAK":
        return "border-rose-500/30 bg-rose-500/10 text-rose-200";
    }
  };

  return (
    <div className={`overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 shadow-lg ${compact ? "" : ""}`}>
      <div className={`bg-gradient-to-r from-teal-700 to-emerald-800 text-white ${compact ? "p-4" : "p-6"}`}>
        <div className="flex items-center gap-3">
          <FlaskConical className={compact ? "h-6 w-6" : "h-8 w-8"} />
          <div>
            <h2 className={`font-bold ${compact ? "text-lg" : "text-xl"}`}>Karışabilirlik</h2>
            <p className="text-sm text-emerald-100">
              {filter === "GÜBRE" ? "Gübre tank karışımı" : filter === "İLAÇ" ? "İlaç tank karışımı" : "Gübre + ilaç uyumu"}
            </p>
          </div>
        </div>
      </div>

      <div className={`space-y-4 ${compact ? "p-4" : "p-6"}`}>
        <div className="grid gap-3 md:grid-cols-3">
          {[
            { v: a, s: setA, label: "1. Ürün" },
            { v: b, s: setB, label: "2. Ürün" },
            { v: c, s: setC, label: "3. Ürün (ops.)" },
          ].map((field) => (
            <div key={field.label}>
              <label className="mb-1 block text-xs text-slate-400">{field.label}</label>
              <select
                className="w-full rounded-lg border border-white/10 bg-slate-950 p-2.5 text-sm text-white"
                value={field.v}
                onChange={(e) => {
                  field.s(e.target.value);
                  setResult(null);
                }}
              >
                <option value="">Seçiniz...</option>
                {catalog.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <button
          onClick={run}
          disabled={!a || !b}
          className="w-full rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white disabled:opacity-40"
        >
          KARIŞIMI KONTROL ET
        </button>

        {result && (
          <div className={`space-y-3 rounded-xl border-2 p-4 ${tone(result.status)}`}>
            <div className="flex items-start gap-3">
              {result.status === "UYGUN" && <CheckCircle2 className="h-5 w-5 shrink-0" />}
              {result.status === "RİSKLİ" && <AlertTriangle className="h-5 w-5 shrink-0" />}
              {result.status === "YASAK" && <XCircle className="h-5 w-5 shrink-0" />}
              <div>
                <p className="font-bold">{result.status}</p>
                <p className="text-sm opacity-90">{result.note}</p>
              </div>
            </div>
            {result.pairs.length > 0 && (
              <ul className="space-y-2 border-t border-white/10 pt-3">
                {result.pairs.map((p, i) => (
                  <li key={i} className="text-xs opacity-90">
                    <span className="font-semibold">{p.a}</span> × <span className="font-semibold">{p.b}</span>
                    {" — "}
                    <span className="font-bold">{p.status}</span>: {p.note}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
