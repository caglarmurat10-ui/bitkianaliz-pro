"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { isDemoMode } from "@/lib/config";
import { demoLogin } from "@/lib/demo-store";
import type { UserRole } from "@/lib/types";
import { Sprout, Loader2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("producer");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isDemoMode()) {
        demoLogin(email, fullName || email.split("@")[0], role);
        window.location.assign("/dashboard");
        return;
      }
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName, role } },
      });
      if (authError) {
        setError(authError.message);
        return;
      }
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Kayıt başarısız");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
      <form onSubmit={onSubmit} className="w-full max-w-md space-y-4 rounded-3xl border border-white/10 bg-slate-900/70 p-8">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-2xl bg-emerald-600 p-3">
            <Sprout className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white">Hesap Oluştur</h1>
        </div>
        <input className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white" placeholder="Ad Soyad" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        <input className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white" type="email" placeholder="E-posta" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white" type="password" placeholder="Şifre" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
        <select className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white" value={role} onChange={(e) => setRole(e.target.value as UserRole)}>
          <option value="producer">Üretici</option>
          <option value="advisor">Ziraat danışmanı</option>
        </select>
        {error && <p className="text-sm text-rose-400">{error}</p>}
        <button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 font-semibold text-white">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Kayıt Ol
        </button>
        <p className="text-center text-sm text-slate-400">
          Zaten hesabınız var mı?{" "}
          <Link href="/login" className="text-emerald-400">
            Giriş
          </Link>
        </p>
      </form>
    </div>
  );
}
