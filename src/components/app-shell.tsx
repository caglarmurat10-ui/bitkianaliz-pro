"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Sprout,
  LayoutDashboard,
  CalendarDays,
  Package,
  BookOpen,
  Bug,
  Bell,
  LogOut,
  Camera,
  CloudSun,
  MoreHorizontal,
  X,
  FlaskConical,
} from "lucide-react";
import { isDemoMode } from "@/lib/config";
import { setDemoSession } from "@/lib/demo-store";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "Özet", icon: LayoutDashboard },
  { href: "/analyze", label: "Teşhis", icon: Camera },
  { href: "/gubreleme", label: "Gübreleme", icon: Sprout },
  { href: "/ilaclama", label: "İlaçlama", icon: FlaskConical },
  { href: "/sera", label: "Sera", icon: CloudSun },
  { href: "/calendar", label: "Takvim", icon: CalendarDays },
  { href: "/inventory", label: "Stok", icon: Package },
  { href: "/diseases", label: "Hastalıklar", icon: Bug },
  { href: "/rehber", label: "Rehber", icon: BookOpen },
  { href: "/notifications", label: "Bildirimler", icon: Bell },
];

/** Mobil alt çubuk — en sık kullanılan 4 + Daha */
const MOBILE_PRIMARY = ["/dashboard", "/analyze", "/diseases", "/sera"];

export function AppShell({
  children,
  title,
  farmName,
}: {
  children: React.ReactNode;
  title?: string;
  farmName?: string | null;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [moreOpen, setMoreOpen] = useState(false);

  const signOut = async () => {
    if (isDemoMode()) {
      setDemoSession(null);
      await fetch("/api/auth/logout", { method: "POST" });
    } else {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      await supabase.auth.signOut();
    }
    router.push("/login");
    router.refresh();
  };

  const mobileTabs = [
    ...NAV.filter((n) => MOBILE_PRIMARY.includes(n.href)),
    { href: "__more__", label: "Daha", icon: MoreHorizontal },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-emerald-900/15 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-teal-900/10 blur-[100px]" />
      </div>

      <div className="relative z-10 flex min-h-screen">
        <aside className="hidden w-64 flex-col border-r border-white/10 bg-slate-950/80 p-4 backdrop-blur-xl md:flex">
          <div className="mb-8 flex items-center gap-3 px-2">
            <div className="rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 p-2.5">
              <Sprout className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="font-bold leading-tight text-white">BitkiAnaliz Pro</p>
              <p className="max-w-[140px] truncate text-[11px] text-slate-400">
                {farmName || "Profesyonel Tarım"}
              </p>
            </div>
          </div>

          <nav className="flex-1 space-y-1">
            {NAV.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-emerald-500/15 text-emerald-300"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <button
            onClick={signOut}
            className="mt-4 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-400 hover:bg-white/5 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Çıkış
          </button>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center justify-between border-b border-white/10 px-4 py-3 md:px-8 md:py-4">
            <div className="min-w-0">
              <h1 className="truncate text-lg font-bold text-white md:text-xl">{title || "Panel"}</h1>
              {farmName && <p className="truncate text-xs text-slate-500 md:hidden">{farmName}</p>}
            </div>
            <div className="flex items-center gap-2 md:hidden">
              <Link href="/notifications" className="rounded-lg border border-white/10 p-2">
                <Bell className="h-4 w-4" />
              </Link>
            </div>
          </header>

          <main className="flex-1 p-4 pb-24 md:p-8 md:pb-8">{children}</main>
        </div>
      </div>

      {/* Mobil alt navigasyon */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-slate-950/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden">
        <div className="grid grid-cols-5 gap-0.5 px-1 py-1.5">
          {mobileTabs.map((item) => {
            if (item.href === "__more__") {
              return (
                <button
                  key="more"
                  type="button"
                  onClick={() => setMoreOpen(true)}
                  className={cn(
                    "flex flex-col items-center gap-0.5 rounded-lg px-1 py-1.5 text-[10px] font-semibold",
                    moreOpen ? "text-emerald-300" : "text-slate-400"
                  )}
                >
                  <MoreHorizontal className="h-5 w-5" />
                  Daha
                </button>
              );
            }
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-0.5 rounded-lg px-1 py-1.5 text-[10px] font-semibold",
                  active ? "text-emerald-300" : "text-slate-400"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {moreOpen && (
        <div className="fixed inset-0 z-50 md:hidden" onClick={() => setMoreOpen(false)}>
          <div className="absolute inset-0 bg-black/60" />
          <div
            className="absolute inset-x-0 bottom-0 rounded-t-3xl border border-white/10 bg-slate-950 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="font-bold text-white">Menü</p>
              <button type="button" onClick={() => setMoreOpen(false)} className="rounded-lg p-2 text-slate-400">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {NAV.map((item) => {
                const active = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMoreOpen(false)}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-2xl border p-3 text-xs font-semibold",
                      active
                        ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
                        : "border-white/10 bg-white/5 text-slate-300"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                );
              })}
              <button
                type="button"
                onClick={() => {
                  setMoreOpen(false);
                  void signOut();
                }}
                className="flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-3 text-xs font-semibold text-rose-300"
              >
                <LogOut className="h-5 w-5" />
                Çıkış
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
