import { NextRequest, NextResponse } from "next/server";
import { climateAdvice, computeVpd, parseByVendor } from "@/lib/iot/adapters";
import { isDemoMode } from "@/lib/config";

/**
 * IoT ingest endpoint.
 * POST /api/sensors/ingest?vendor=esp32|ecowitt_ws90|sonoff|zigbee&farmId=...
 * Header: x-bitki-token (optional shared secret SENSOR_INGEST_TOKEN)
 *
 * Demo mode: returns normalized payload + advice (client can persist via local store).
 * Production: wire to Supabase sensor_readings table.
 */
export async function POST(req: NextRequest) {
  try {
    const token = process.env.SENSOR_INGEST_TOKEN;
    if (token) {
      const got = req.headers.get("x-bitki-token");
      if (got !== token) {
        return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
      }
    }

    const vendor = req.nextUrl.searchParams.get("vendor") || "esp32";
    const farmId = req.nextUrl.searchParams.get("farmId") || "demo";

    const contentType = req.headers.get("content-type") || "";
    let body: Record<string, unknown> = {};

    if (contentType.includes("application/json")) {
      body = (await req.json()) as Record<string, unknown>;
    } else {
      const text = await req.text();
      try {
        body = Object.fromEntries(new URLSearchParams(text));
      } catch {
        body = { raw: text };
      }
    }

    const normalized = parseByVendor(vendor, body);
    if (
      normalized.reading.temperature_c != null &&
      normalized.reading.humidity_pct != null &&
      normalized.reading.vpd_kpa == null
    ) {
      normalized.reading.vpd_kpa = computeVpd(
        normalized.reading.temperature_c,
        normalized.reading.humidity_pct
      );
    }

    const advice = climateAdvice(normalized.reading);

    return NextResponse.json({
      ok: true,
      demo: isDemoMode(),
      farmId,
      device: {
        vendor: normalized.vendor,
        externalId: normalized.externalId,
        name: normalized.deviceName,
        kind: normalized.kindHint,
      },
      reading: normalized.reading,
      advice,
      tip: isDemoMode()
        ? "Demo: istemci bu okumayı localStorage'a yazabilir. Canlıda Supabase'e kaydedin."
        : undefined,
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Ingest hatası";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json({
    endpoints: {
      esp32: "POST /api/sensors/ingest?vendor=esp32&farmId=YOUR_FARM",
      ecowitt_ws90: "POST /api/sensors/ingest?vendor=ecowitt_ws90&farmId=YOUR_FARM",
      sonoff: "POST /api/sensors/ingest?vendor=sonoff&farmId=YOUR_FARM",
      zigbee: "POST /api/sensors/ingest?vendor=zigbee&farmId=YOUR_FARM",
    },
    auth: "Optional header x-bitki-token: SENSOR_INGEST_TOKEN",
  });
}
