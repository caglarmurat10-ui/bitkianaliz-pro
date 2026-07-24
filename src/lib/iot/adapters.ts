import type { SensorDevice, SensorReading, SensorVendor } from "@/lib/types";
import { createId } from "@/lib/utils";

export type NormalizedIngest = {
  vendor: SensorVendor;
  externalId: string;
  deviceName?: string;
  kindHint?: SensorDevice["kind"];
  reading: Omit<SensorReading, "id" | "device_id" | "farm_id">;
};

/** Ecowitt / WS90 custom server POST (form or JSON) */
export function parseEcowittWs90(body: Record<string, unknown>): NormalizedIngest {
  const outdoor = (body.outdoor as Record<string, unknown> | undefined) || undefined;
  const temp =
    num(body.tempf) != null
      ? ((num(body.tempf)! - 32) * 5) / 9
      : num(body.temp) ?? num(body.tempc) ?? num(outdoor?.temp);
  const humidity = num(body.humidity) ?? num(body.humidityin) ?? num(outdoor?.humidity);
  const wind =
    num(body.windspeedmph) != null
      ? num(body.windspeedmph)! * 1.60934
      : num(body.windspeedkmh) ?? num(body.wind_speed);
  const rain = num(body.rainratein) != null ? num(body.rainratein)! * 25.4 : num(body.rain) ?? num(body.rainrate);
  const pressure = num(body.baromrelin) != null ? num(body.baromrelin)! * 33.8639 : num(body.pressure);

  return {
    vendor: "ecowitt_ws90",
    externalId: String(body.PASSKEY || body.stationtype || body.mac || "ws90-main"),
    deviceName: "Ecowitt WS90",
    kindHint: "outdoor_weather",
    reading: {
      recorded_at: new Date().toISOString(),
      temperature_c: temp ?? null,
      humidity_pct: humidity ?? null,
      wind_kmh: wind ?? null,
      rain_mm: rain ?? null,
      pressure_hpa: pressure ?? null,
      raw: body,
    },
  };
}

/** ESP32 JSON: { deviceId, temp, humidity, soilMoisture, soilTemp, co2, location } */
export function parseEsp32(body: Record<string, unknown>): NormalizedIngest {
  const kind =
    body.soilMoisture != null || body.soil_moisture != null
      ? "soil_moisture"
      : body.co2 != null
        ? "greenhouse_climate"
        : "greenhouse_climate";

  return {
    vendor: "esp32",
    externalId: String(body.deviceId || body.device_id || body.id || "esp32-unknown"),
    deviceName: String(body.name || "ESP32 Sensor"),
    kindHint: kind,
    reading: {
      recorded_at: String(body.ts || body.recorded_at || new Date().toISOString()),
      temperature_c: num(body.temp) ?? num(body.temperature) ?? num(body.temperature_c),
      humidity_pct: num(body.humidity) ?? num(body.humidity_pct),
      soil_moisture_pct: num(body.soilMoisture) ?? num(body.soil_moisture) ?? num(body.soil_moisture_pct),
      soil_temp_c: num(body.soilTemp) ?? num(body.soil_temp),
      co2_ppm: num(body.co2) ?? num(body.co2_ppm),
      leaf_wetness_pct: num(body.leafWetness) ?? num(body.leaf_wetness),
      vpd_kpa: num(body.vpd) ?? num(body.vpd_kpa),
      raw: body,
    },
  };
}

/** Sonoff / eWeLink style TH payload */
export function parseSonoff(body: Record<string, unknown>): NormalizedIngest {
  const params = (body.params as Record<string, unknown>) || body;
  return {
    vendor: "sonoff",
    externalId: String(body.deviceid || body.deviceId || body.id || "sonoff-th"),
    deviceName: String(body.name || "Sonoff TH"),
    kindHint: "greenhouse_climate",
    reading: {
      recorded_at: new Date().toISOString(),
      temperature_c: num(params.currentTemperature) ?? num(params.temperature) ?? num(params.temp),
      humidity_pct: num(params.currentHumidity) ?? num(params.humidity),
      raw: body,
    },
  };
}

/** Zigbee2MQTT JSON */
export function parseZigbee(body: Record<string, unknown>): NormalizedIngest {
  const device = (body.device as Record<string, unknown> | undefined) || undefined;
  const soil = num(body.soil_moisture) ?? num(body.moisture) ?? num(body.soilMoisture);
  return {
    vendor: "zigbee",
    externalId: String(device?.ieee_address || body.ieee_address || body.friendly_name || body.id || "zb-sensor"),
    deviceName: String(body.friendly_name || body.name || "Zigbee Sensor"),
    kindHint: soil != null ? "soil_moisture" : "greenhouse_climate",
    reading: {
      recorded_at: new Date().toISOString(),
      temperature_c: num(body.temperature) ?? num(body.temp),
      humidity_pct: num(body.humidity),
      soil_moisture_pct: soil,
      soil_temp_c: num(body.soil_temperature) ?? num(body.soil_temp),
      pressure_hpa: num(body.pressure),
      raw: body,
    },
  };
}

export function parseByVendor(vendor: string, body: Record<string, unknown>): NormalizedIngest {
  switch (vendor) {
    case "ecowitt":
    case "ecowitt_ws90":
    case "ws90":
      return parseEcowittWs90(body);
    case "esp32":
      return parseEsp32(body);
    case "sonoff":
      return parseSonoff(body);
    case "zigbee":
    case "z2m":
      return parseZigbee(body);
    default:
      return parseEsp32({ ...body, deviceId: body.deviceId || vendor });
  }
}

export function computeVpd(tempC: number, humidityPct: number): number {
  const svp = 0.6108 * Math.exp((17.27 * tempC) / (tempC + 237.3));
  return Math.round((svp * (1 - humidityPct / 100)) * 100) / 100;
}

export function climateAdvice(reading: Partial<SensorReading>): string[] {
  const tips: string[] = [];
  if (reading.temperature_c != null) {
    if (reading.temperature_c < 12) tips.push("Sera sıcaklığı düşük — ısıtma / havalandırma kontrol edin.");
    if (reading.temperature_c > 32) tips.push("Sera sıcaklığı yüksek — gölgeleme / fan önerilir.");
  }
  if (reading.humidity_pct != null) {
    if (reading.humidity_pct > 85) tips.push("Nem çok yüksek — mantar riski; havalandırın.");
    if (reading.humidity_pct < 40) tips.push("Nem düşük — sisleme / sulama planlayın.");
  }
  if (reading.soil_moisture_pct != null) {
    if (reading.soil_moisture_pct < 25) tips.push("Toprak nemi kritik düşük — sulama zamanı.");
    if (reading.soil_moisture_pct > 75) tips.push("Toprak çok ıslak — kök çürüklüğü riski.");
  }
  if (reading.vpd_kpa != null) {
    if (reading.vpd_kpa < 0.4) tips.push("VPD düşük — yaprak ıslaklığı / hastalık riski.");
    if (reading.vpd_kpa > 1.6) tips.push("VPD yüksek — bitki stresli; nem artırın.");
  }
  if (reading.wind_kmh != null && reading.wind_kmh > 10) {
    tips.push("Dış rüzgar ilaçlama için yüksek (>10 km/s).");
  }
  if (tips.length === 0) tips.push("Ölçümler hedef aralıkta görünüyor.");
  return tips;
}

function num(v: unknown): number | null {
  if (v == null || v === "") return null;
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : null;
}

export function newReadingId() {
  return createId();
}
