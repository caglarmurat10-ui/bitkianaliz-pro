"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppProviders } from "@/components/app-providers";
import { useFarm } from "@/components/farm-provider";
import { AssistantPanel } from "@/components/assistant-panel";
import { PushOptIn } from "@/components/push-opt-in";
import { isDemoMode } from "@/lib/config";
import {
  getAnalyses,
  getApplications,
  getInventory,
  getNotifications,
  subscribeStore,
} from "@/lib/demo-store";
import { AlertTriangle, Package, Camera, Sprout, Bug } from "lucide-react";
import { format, startOfWeek, endOfWeek, isWithinInterval, parseISO } from "date-fns";
import { tr } from "date-fns/locale";
import type { WeatherData } from "@/lib/weather";
import { getWeatherAction } from "@/app/actions";

function DashboardContent() {
  const { activeFarm, loading } = useFarm();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [stats, setStats] = useState({
    fertApps: 0,
    sprayApps: 0,
    lowStock: 0,
    weekApps: 0,
    unread: 0,
    recentAnalyses: [] as Array<{ id: string; diagnosis: string; plant_name: string; confidence: number; created_at: string }>,
    alerts: [] as Array<{ id: string; title: string; body: string }>,
  });

  useEffect(() => {
    if (!activeFarm) return;

    const loadDemo = () => {
      const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
      const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });
      const inventory = getInventory(activeFarm.id);
      const apps = getApplications(activeFarm.id);
      const notifications = getNotifications().filter((n) => !n.read);
      const analyses = getAnalyses(activeFarm.id).slice(0, 5);
      const weekApps = apps.filter((a) => {
        const d = a.scheduled_at || a.applied_at;
        if (!d) return false;
        return isWithinInterval(parseISO(d), { start: weekStart, end: weekEnd });
      }).length;

      setStats({
        fertApps: apps.filter((a) => a.type === "GÜBRE").length,
        sprayApps: apps.filter((a) => a.type === "İLAÇ").length,
        lowStock: inventory.filter((i) => i.quantity <= i.min_threshold).length,
        weekApps,
        unread: notifications.length,
        recentAnalyses: analyses.map((a) => ({
          id: a.id,
          diagnosis: a.diagnosis,
          plant_name: a.plant_name,
          confidence: a.confidence,
          created_at: a.created_at,
        })),
        alerts: notifications.slice(0, 5).map((n) => ({ id: n.id, title: n.title, body: n.body })),
      });
    };

    if (isDemoMode()) {
      loadDemo();
      return subscribeStore(loadDemo);
    }

    let cleanup = () => {};
    (async () => {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const load = async () => {
        const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
        const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });
        const [parcels, inventory, apps, notifications, analyses] = await Promise.all([
          supabase.from("parcels").select("id", { count: "exact" }).eq("farm_id", activeFarm.id),
          supabase.from("inventory_items").select("*").eq("farm_id", activeFarm.id),
          supabase.from("applications").select("*").eq("farm_id", activeFarm.id),
          supabase.from("notifications").select("*").eq("read", false).order("created_at", { ascending: false }).limit(5),
          supabase.from("analyses").select("id, diagnosis, plant_name, confidence, created_at").eq("farm_id", activeFarm.id).order("created_at", { ascending: false }).limit(5),
        ]);
        const lowStock = ((inventory.data || []) as Array<{ quantity: number; min_threshold: number }>).filter(
          (i) => Number(i.quantity) <= Number(i.min_threshold)
        ).length;
        const appRows = (apps.data || []) as Array<{
          type?: string;
          scheduled_at?: string | null;
          applied_at?: string | null;
        }>;
        const weekApps = appRows.filter((a) => {
          const d = a.scheduled_at || a.applied_at;
          if (!d) return false;
          return isWithinInterval(parseISO(d), { start: weekStart, end: weekEnd });
        }).length;
        setStats({
          fertApps: appRows.filter((a) => a.type === "GÜBRE" || a.type === "GUBRE").length,
          sprayApps: appRows.filter((a) => a.type === "İLAÇ" || a.type === "ILAC").length,
          lowStock,
          weekApps,
          unread: notifications.data?.length || 0,
          recentAnalyses: (analyses.data || []) as Array<{
            id: string;
            diagnosis: string;
            plant_name: string;
            confidence: number;
            created_at: string;
          }>,
          alerts: ((notifications.data || []) as Array<{ id: string; title: string; body: string }>).map((n) => ({
            id: n.id,
            title: n.title,
            body: n.body,
          })),
        });
        void parcels;
      };
      await load();
      const channel = supabase
        .channel(`dashboard-${activeFarm.id}`)
        .on("postgres_changes", { event: "*", schema: "public", table: "applications" }, load)
        .on("postgres_changes", { event: "*", schema: "public", table: "inventory_items" }, load)
        .on("postgres_changes", { event: "*", schema: "public", table: "notifications" }, load)
        .on("postgres_changes", { event: "*", schema: "public", table: "analyses" }, load)
        .subscribe();
      cleanup = () => {
        supabase.removeChannel(channel);
      };
    })();
    return () => cleanup();
  }, [activeFarm]);

  useEffect(() => {
    if (!("geolocation" in navigator)) return;
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const result = await getWeatherAction(pos.coords.latitude, pos.coords.longitude);
      if (result.data) setWeather(result.data);
    });
  }, []);

  if (loading) return <p className="text-slate-400">Yükleniyor...</p>;

  if (!activeFarm) {
    return (
      <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-8 text-center">
        <p className="mb-2 font-bold text-white">Henüz işletme yok</p>
        <Link href="/gubreleme" className="inline-flex rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white">
          Gübreleme Programına Git
        </Link>
      </div>
    );
  }

  const cards = [
    { label: "Gübre kaydı", value: stats.fertApps, icon: Sprout, href: "/gubreleme", color: "text-emerald-400" },
    { label: "İlaç kaydı", value: stats.sprayApps, icon: Bug, href: "/ilaclama", color: "text-amber-400" },
    { label: "Düşük Stok", value: stats.lowStock, icon: Package, href: "/inventory", color: "text-sky-400" },
    { label: "Okunmamış", value: stats.unread, icon: AlertTriangle, href: "/notifications", color: "text-rose-400" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <PushOptIn />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 hover:border-emerald-500/30">
            <div className="mb-3 flex items-center justify-between">
              <c.icon className={`h-5 w-5 ${c.color}`} />
              <span className="text-2xl font-bold text-white">{c.value}</span>
            </div>
            <p className="text-sm text-slate-400">{c.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-white">Bekleyen Alarmlar</h2>
            <Link href="/notifications" className="text-xs text-emerald-400">
              Tümü
            </Link>
          </div>
          {stats.alerts.length === 0 ? (
            <p className="text-sm text-slate-500">Aktif alarm yok.</p>
          ) : (
            <ul className="space-y-3">
              {stats.alerts.map((a) => (
                <li key={a.id} className="rounded-xl border border-white/5 bg-white/5 p-3">
                  <p className="text-sm font-semibold text-white">{a.title}</p>
                  <p className="mt-1 text-xs text-slate-400">{a.body}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-white">Son Teşhisler</h2>
            <Link href="/analyze" className="inline-flex items-center gap-1 text-xs text-emerald-400">
              <Camera className="h-3 w-3" /> Yeni
            </Link>
          </div>
          {stats.recentAnalyses.length === 0 ? (
            <p className="text-sm text-slate-500">Henüz analiz yok.</p>
          ) : (
            <ul className="space-y-3">
              {stats.recentAnalyses.map((a) => (
                <li key={a.id} className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-white/5 p-3">
                  <div>
                    <p className="text-sm font-semibold text-white">{a.plant_name}</p>
                    <p className="text-xs text-slate-400">{a.diagnosis}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-emerald-400">%{Math.round(Number(a.confidence))}</p>
                    <p className="text-[10px] text-slate-500">{format(parseISO(a.created_at), "d MMM", { locale: tr })}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <AssistantPanel weather={weather} />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AppProviders title="İşletme Özeti">
      <DashboardContent />
    </AppProviders>
  );
}
