import { NextRequest, NextResponse } from "next/server";
import { analyzePlantImage } from "@/lib/ai";
import { requireAuthUserId } from "@/lib/auth";
import type { WeatherData } from "@/lib/weather";

export async function POST(req: NextRequest) {
  try {
    const userId = await requireAuthUserId();
    if (!userId) {
      return NextResponse.json({ error: "Oturum gerekli" }, { status: 401 });
    }

    const body = await req.json();
    const { image, weather, cropHint } = body as {
      image?: string;
      weather?: WeatherData | null;
      cropHint?: string | null;
    };

    if (!image) {
      return NextResponse.json({ error: "Resim gerekli" }, { status: 400 });
    }

    const result = await analyzePlantImage(image, weather ?? null, cropHint ?? null);
    return NextResponse.json({ ...result, userId });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Analiz işlemi başarısız oldu.";
    console.error("API Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
