import { NextRequest, NextResponse } from "next/server";
import { isDemoMode } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, password, fullName, role } = body as {
    email?: string;
    password?: string;
    fullName?: string;
    role?: "producer" | "advisor";
  };

  if (!email || !password) {
    return NextResponse.json({ error: "E-posta ve şifre gerekli" }, { status: 400 });
  }

  if (isDemoMode()) {
    const res = NextResponse.json({
      demo: true,
      email,
      fullName: fullName || email.split("@")[0],
      role: role || "producer",
    });
    return res;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName || email, role: role || "producer" },
      },
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ user: data.user });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Kayıt başarısız";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
