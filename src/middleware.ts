import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { isDemoMode } from "@/lib/config";

const PUBLIC = ["/login", "/register", "/", "/sw.js", "/manifest.json", "/api/health", "/api/auth"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isDemoMode()) {
    const isPublic =
      PUBLIC.some((p) => pathname === p || pathname.startsWith(p + "/")) ||
      pathname.startsWith("/api/auth");
    const demoSession = request.cookies.get("bitki_demo_session")?.value;
    const needsAuth =
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/calendar") ||
      pathname.startsWith("/inventory") ||
      pathname.startsWith("/diseases") ||
      pathname.startsWith("/analyze") ||
      pathname.startsWith("/gubreleme") ||
      pathname.startsWith("/ilaclama") ||
      pathname.startsWith("/sera") ||
      pathname.startsWith("/rehber") ||
      pathname.startsWith("/notifications") ||
      pathname.startsWith("/api/analyze");

    if (needsAuth && !demoSession && !isPublic) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  return updateSession(request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
