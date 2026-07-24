import { NextRequest, NextResponse } from "next/server";
import { getEnrichedCatalog, searchOnlineCatalog } from "@/lib/wiki-catalog";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/** Online katalog: Wikipedia + Openverse görselleri */
export async function GET(req: NextRequest) {
  try {
    const q = req.nextUrl.searchParams.get("q")?.trim() || "";
    const data = q ? await searchOnlineCatalog(q) : await getEnrichedCatalog();
    return NextResponse.json({
      ok: true,
      source: "wikipedia+openverse",
      count: data.length,
      onlineCount: data.filter((d) => d.online).length,
      items: data,
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Katalog yüklenemedi";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
