"use client";

import { useEffect, useState } from "react";
import { getApplications } from "@/lib/demo-store";
import type { ApplicationRecord } from "@/lib/types";
import { Calendar, Clock } from "lucide-react";
import { getActiveFarmId, subscribeStore } from "@/lib/demo-store";

export function ApplicationTimeline() {
  const [history, setHistory] = useState<ApplicationRecord[]>([]);

  useEffect(() => {
    const refresh = () => setHistory(getApplications(getActiveFarmId() || undefined));
    refresh();
    return subscribeStore(refresh);
  }, []);

  const formatDate = (isoString: string) =>
    new Date(isoString).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    });

  if (history.length === 0) {
    return (
      <div className="rounded-3xl border border-white/5 bg-slate-900/40 p-8 text-center backdrop-blur-md">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/5">
          <Calendar className="h-8 w-8 text-slate-500" />
        </div>
        <h3 className="mb-2 text-lg font-bold text-white">Henüz Uygulama Yok</h3>
        <p className="text-sm text-slate-400">Takvimden ilaç/gübre kaydı ekleyin.</p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-xl backdrop-blur-md">
      <div className="mb-6 flex items-center gap-3">
        <Clock className="h-6 w-6 text-emerald-400" />
        <h3 className="text-xl font-bold text-white">Uygulama Geçmişi</h3>
      </div>
      <div className="relative space-y-6 before:absolute before:left-4 before:top-2 before:h-full before:w-0.5 before:bg-slate-800">
        {history.slice(0, 5).map((record) => (
          <div key={record.id} className="relative pl-10">
            <div className="absolute left-[11px] top-1 h-3 w-3 rounded-full bg-emerald-500 ring-4 ring-slate-900" />
            <div className="rounded-xl border border-white/5 bg-white/5 p-4 transition hover:border-emerald-500/30">
              <div className="mb-1 flex items-start justify-between">
                <span className="font-mono text-xs text-emerald-400">
                  {formatDate(record.applied_at || record.scheduled_at || record.created_at)}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    record.type === "GÜBRE" ? "bg-green-500/20 text-green-400" : "bg-amber-500/20 text-amber-400"
                  }`}
                >
                  {record.type}
                </span>
              </div>
              <h4 className="mb-1 font-bold text-white">{record.item_name}</h4>
              {record.notes && <p className="text-xs text-slate-400">{record.notes}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
