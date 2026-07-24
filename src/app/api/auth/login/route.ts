import { NextRequest, NextResponse } from "next/server";
import { isDemoMode } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, password } = body as { email?: string; password?: string };

  if (!email || !password) {
    return NextResponse.json({ error: "E-posta ve şifre gerekli" }, { status: 400 });
  }

  if (isDemoMode()) {
    return NextResponse.json({
      demo: true,
      email,
      fullName: email.split("@")[0],
      role: "producer",
    });
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return NextResponse.json({ error: error.message }, { status: 401 });
    return NextResponse.json({ user: data.user });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Giriş başarısız";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
