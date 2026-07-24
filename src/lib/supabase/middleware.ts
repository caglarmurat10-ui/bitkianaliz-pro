import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { hasSupabaseConfig, isDemoMode } from "@/lib/config";

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/analyze",
  "/parcels",
  "/calendar",
  "/inventory",
  "/diseases",
  "/rehber",
  "/notifications",
  "/api/analyze",
];

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });
  const path = request.nextUrl.pathname;

  const isAuthPage = path.startsWith("/login") || path.startsWith("/register");
  const isPublicAsset =
    path.startsWith("/_next") ||
    path.startsWith("/auth/callback") ||
    path.startsWith("/api/health") ||
    path.startsWith("/api/auth") ||
    path === "/sw.js" ||
    path === "/manifest.json" ||
    path === "/favicon.ico" ||
    path.endsWith(".png") ||
    path.endsWith(".svg");

  const needsAuth = PROTECTED_PREFIXES.some(
    (p) => path === p || path.startsWith(p + "/")
  );

  // Demo mode: cookie session
  if (isDemoMode() || !hasSupabaseConfig()) {
    const demoId = request.cookies.get("bitki_demo_session")?.value;
    if (needsAuth && !demoId && !isPublicAsset && !isAuthPage) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", path);
      return NextResponse.redirect(url);
    }
    if (demoId && isAuthPage) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
    return supabaseResponse;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && needsAuth && !isPublicAsset) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }

  if (user && isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
