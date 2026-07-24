"use client";

import { useEffect, useMemo, useState } from "react";
import { AppProviders } from "@/components/app-providers";
import { useFarm } from "@/components/farm-provider";
import {
  ensureSensorsForFarm,
  getSensorDevices,
  latestReadingForDevice,
  simulateLiveReadings,
  subscribeStore,
  upsertSensorReading,
  addSensorDevice,
} from "@/lib/demo-store";
import { climateAdvice } from "@/lib/iot/adapters";
import type { SensorDevice, SensorReading } from "@/lib/types";
import {
  CloudSun,
  Cpu,
  Droplets,
  Leaf,
  Radio,
  RefreshCw,
  Thermometer,
  Wind,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { tr } from "date-fns/locale";

const VENDOR_LABEL: Record<string, string> = {
  esp32: "ESP32",
  ecowitt_ws90: "Ecowitt WS90",
  sonoff: "Sonoff",
  zigbee: "Zigbee",
  openweather: "OpenWeather",
  manual: "Manuel",
};

function Metric({
  label,
  value,
  unit,
  icon: Icon,
}: {
  label: string;
  value: string | number | null | undefined;
  unit?: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
      <div className="mb-2 flex items-center gap-2 text-slate-400">
        <Icon className="h-4 w-4" />
        <span className="text-xs font-semibold uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-2xl font-bold text-white">
        {value == null || value === "" ? "—" : value}
        {value != null && value !== "" && unit ? (
          <span className="ml-1 text-sm font-medium text-slate-400">{unit}</span>
        ) : null}
      </p>
    </div>
  );
}

function SeraContent() {
  const { activeFarm } = useFarm();
  const [devices, setDevices] = useState<SensorDevice[]>([]);
  const [tick, setTick] = useState(0);
  const [ingestLog, setIngestLog] = useState<string>("");

  useEffect(() => {
    if (!activeFarm) return;
    const load = () => {
      ensureSensorsForFarm(activeFarm.id);
      setDevices(getSensorDevices(activeFarm.id));
      setTick((t) => t + 1);
    };
    load();
    return subscribeStore(load);
  }, [activeFarm]);

  const readings = useMemo(() => {
    const map = new Map<string, SensorReading | null>();
    for (const d of devices) map.set(d.id, latestReadingForDevice(d.id));
    return map;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [devices, tick]);

  const outdoor = devices.find((d) => d.kind === "outdoor_weather");
  const greenhouse = devices.filter((d) => d.kind === "greenhouse_climate");
  const soil = devices.filter((d) => d.kind === "soil_moisture");

  const outdoorR = outdoor ? readings.get(outdoor.id) : null;
  const ghR = greenhouse.map((d) => readings.get(d.id)).find(Boolean) || null;
  const soilR = soil.map((d) => readings.get(d.id)).find(Boolean) || null;

  const advice = climateAdvice({
    temperature_c: ghR?.temperature_c ?? outdoorR?.temperature_c,
    humidity_pct: ghR?.humidity_pct ?? outdoorR?.humidity_pct,
    soil_moisture_pct: soilR?.soil_moisture_pct,
    vpd_kpa: ghR?.vpd_kpa,
    wind_kmh: outdoorR?.wind_kmh,
  });

  const refresh = () => {
    if (!activeFarm) return;
    simulateLiveReadings(activeFarm.id);
  };

  const testIngest = async (vendor: string) => {
    if (!activeFarm) return;
    const sample =
      vendor === "esp32"
        ? { deviceId: "esp32-sera-a", temp: 26.2, humidity: 71, co2: 640, name: "ESP32 — Sera İklim" }
        : vendor === "ecowitt_ws90"
          ? { PASSKEY: "ws90-main", tempc: 19.4, humidity: 52, windspeedkmh: 9, pressure: 1013 }
          : vendor === "sonoff"
            ? { deviceid: "sonoff-th-01", params: { currentTemperature: 23.1, currentHumidity: 66 } }
            : { friendly_name: "zb-soil-03", temperature: 18.2, soil_moisture: 38 };

    const res = await fetch(`/api/sensors/ingest?vendor=${vendor}&farmId=${activeFarm.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sample),
    });
    const data = await res.json();
    setIngestLog(JSON.stringify(data, null, 2));

    if (data.ok && data.device) {
      let existing = getSensorDevices(activeFarm.id).find(
        (d) => d.external_id === data.device.externalId
      );
      if (!existing) {
        existing = addSensorDevice({
          farm_id: activeFarm.id,
          name: data.device.name || vendor,
          vendor: data.device.vendor,
          kind: data.device.kind || "greenhouse_climate",
          location_label: "Ingest",
          external_id: data.device.externalId,
          online: true,
          last_seen_at: new Date().toISOString(),
        });
      }

      upsertSensorReading({
        device_id: existing.id,
        farm_id: activeFarm.id,
        ...data.reading,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-2xl text-sm text-slate-400">
          Dış hava (WS90), sera içi nem/ısı (ESP32 / Sonoff) ve toprak nemi (Zigbee) tek panelde.
          Cihazlar <code className="text-emerald-400">/api/sensors/ingest</code> üzerinden veri gönderir.
        </p>
        <button
          onClick={refresh}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
        >
          <RefreshCw className="h-4 w-4" /> Canlı simüle et
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Metric label="Dış sıcaklık" value={outdoorR?.temperature_c?.toFixed?.(1) ?? outdoorR?.temperature_c} unit="°C" icon={CloudSun} />
        <Metric label="Sera sıcaklık" value={ghR?.temperature_c?.toFixed?.(1) ?? ghR?.temperature_c} unit="°C" icon={Thermometer} />
        <Metric label="Sera nem" value={ghR?.humidity_pct?.toFixed?.(0) ?? ghR?.humidity_pct} unit="%" icon={Droplets} />
        <Metric label="Toprak nemi" value={soilR?.soil_moisture_pct?.toFixed?.(0) ?? soilR?.soil_moisture_pct} unit="%" icon={Leaf} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Metric label="Rüzgar" value={outdoorR?.wind_kmh?.toFixed?.(0) ?? outdoorR?.wind_kmh} unit="km/s" icon={Wind} />
        <Metric label="VPD" value={ghR?.vpd_kpa?.toFixed?.(2) ?? ghR?.vpd_kpa} unit="kPa" icon={Radio} />
        <Metric label="CO₂" value={ghR?.co2_ppm?.toFixed?.(0) ?? ghR?.co2_ppm} unit="ppm" icon={Cpu} />
      </div>

      <section className="rounded-3xl border border-amber-500/20 bg-amber-500/5 p-5">
        <h2 className="mb-3 font-bold text-white">İklim önerileri</h2>
        <ul className="space-y-2">
          {advice.map((t, i) => (
            <li key={i} className="text-sm text-amber-100/90">
              • {t}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-5">
        <h2 className="mb-4 font-bold text-white">Bağlı cihazlar ({devices.length})</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {devices.map((d) => {
            const r = readings.get(d.id);
            return (
              <div key={d.id} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="font-semibold text-white">{d.name}</p>
                  <span className={`text-[10px] font-bold uppercase ${d.online ? "text-emerald-400" : "text-rose-400"}`}>
                    {d.online ? "online" : "offline"}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  {VENDOR_LABEL[d.vendor] || d.vendor} · {d.location_label || "—"}
                </p>
                {r && (
                  <p className="mt-2 text-xs text-slate-500">
                    Son: {format(parseISO(r.recorded_at), "d MMM HH:mm:ss", { locale: tr })}
                    {r.temperature_c != null ? ` · ${r.temperature_c.toFixed(1)}°C` : ""}
                    {r.humidity_pct != null ? ` · %${Math.round(r.humidity_pct)}` : ""}
                    {r.soil_moisture_pct != null ? ` · toprak %${Math.round(r.soil_moisture_pct)}` : ""}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-slate-900/40 p-5">
        <h2 className="mb-3 font-bold text-white">Ingest testi</h2>
        <div className="mb-3 flex flex-wrap gap-2">
          {["esp32", "ecowitt_ws90", "sonoff", "zigbee"].map((v) => (
            <button
              key={v}
              onClick={() => testIngest(v)}
              className="rounded-lg border border-white/10 bg-slate-950 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:border-emerald-500/40"
            >
              {VENDOR_LABEL[v] || v} gönder
            </button>
          ))}
        </div>
        <pre className="max-h-48 overflow-auto rounded-xl bg-black/40 p-3 text-[11px] text-emerald-200/80">
          {ingestLog || "Örnek POST yanıtı burada görünür."}
        </pre>
        <p className="mt-3 text-xs text-slate-500">
          ESP32 örnek: <code>POST /api/sensors/ingest?vendor=esp32&amp;farmId=...</code> body{" "}
          <code>{`{"deviceId":"esp32-1","temp":25,"humidity":70}`}</code>
        </p>
      </section>
    </div>
  );
}

export default function SeraPage() {
  return (
    <AppProviders title="Sera & Sensörler">
      <SeraContent />
    </AppProviders>
  );
}
