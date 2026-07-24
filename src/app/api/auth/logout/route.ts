import { NextResponse } from "next/server";
import { isDemoMode } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  if (isDemoMode()) {
    const res = NextResponse.json({ ok: true });
    res.cookies.set("bitki_demo_session", "", { path: "/", maxAge: 0 });
    return res;
  }

  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
