"use client";

import { FarmProvider, useFarm } from "@/components/farm-provider";
import { AppShell } from "@/components/app-shell";
import { ServiceWorkerRegister } from "@/components/sw-register";

function ShellInner({ children, title }: { children: React.ReactNode; title?: string }) {
  const { activeFarm, farms, setActiveFarmId } = useFarm();

  return (
    <AppShell title={title} farmName={activeFarm?.name}>
      {farms.length > 1 && (
        <div className="mb-6">
          <label className="text-xs text-slate-500 font-semibold uppercase">Aktif İşletme</label>
          <select
            value={activeFarm?.id || ""}
            onChange={(e) => setActiveFarmId(e.target.value)}
            className="mt-1 w-full md:w-80 rounded-xl bg-slate-900 border border-white/10 px-4 py-2.5 text-white"
          >
            {farms.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>
      )}
      {children}
    </AppShell>
  );
}

export function AppProviders({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <FarmProvider>
      <ServiceWorkerRegister />
      <ShellInner title={title}>{children}</ShellInner>
    </FarmProvider>
  );
}
