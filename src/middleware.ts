import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { isDemoMode } from "@/lib/config";

export async function middleware(request: NextRequest) {
  if (isDemoMode()) {
    // Demo: giriş formu yok — otomatik misafir çerezi
    const res = NextResponse.next();
    if (!request.cookies.get("bitki_demo_session")?.value) {
      res.cookies.set("bitki_demo_session", "demo-guest", {
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
        sameSite: "lax",
      });
    }
    // /login ve /register -> panele
    const { pathname } = request.nextUrl;
    if (pathname === "/login" || pathname === "/register") {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      const redirect = NextResponse.redirect(url);
      if (!request.cookies.get("bitki_demo_session")?.value) {
        redirect.cookies.set("bitki_demo_session", "demo-guest", {
          path: "/",
          maxAge: 60 * 60 * 24 * 30,
          sameSite: "lax",
        });
      }
      return redirect;
    }
    return res;
  }

  return updateSession(request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
