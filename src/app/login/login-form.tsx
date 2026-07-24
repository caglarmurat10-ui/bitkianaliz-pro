"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { isDemoMode } from "@/lib/config";
import { demoLogin } from "@/lib/demo-store";
import type { UserRole } from "@/lib/types";
import { Sprout, Loader2 } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/dashboard";
  const [email, setEmail] = useState("uretici@demo.local");
  const [password, setPassword] = useState("demo1234");
  const [role, setRole] = useState<UserRole>("producer");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isDemoMode()) {
        demoLogin(email, email.split("@")[0], role);
        window.location.assign(next);
        return;
      }
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) {
        setError(authError.message);
        return;
      }
      router.push(next);
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Giriş başarısız");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/70 p-8 shadow-2xl">
        <div className="mb-8 flex items-center gap-3">
          <div className="rounded-2xl bg-emerald-600 p-3">
            <Sprout className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">BitkiAnaliz Pro</h1>
            <p className="text-sm text-slate-400">
              {isDemoMode() ? "Demo giriş" : "Profesyonel giriş"}
            </p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">E-posta</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Şifre</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-500"
            />
          </div>
          {isDemoMode() && (
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Rol</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white"
              >
                <option value="producer">Üretici</option>
                <option value="advisor">Ziraat danışmanı</option>
              </select>
            </div>
          )}
          {error && <p className="text-sm text-rose-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 font-semibold text-white hover:bg-emerald-500"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Giriş Yap
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Hesabınız yok mu?{" "}
          <Link href="/register" className="font-semibold text-emerald-400 hover:underline">
            Kayıt ol
          </Link>
        </p>
      </div>
    </div>
  );
}
