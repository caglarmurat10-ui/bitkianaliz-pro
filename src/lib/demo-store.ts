import type {
  AnalysisRecord,
  ApplicationRecord,
  DemoSession,
  Farm,
  InventoryItem,
  NotificationItem,
  Parcel,
  Profile,
  SensorDevice,
  SensorReading,
  UserRole,
} from "@/lib/types";
import { createId } from "@/lib/utils";

const KEYS = {
  session: "bitki_demo_session",
  profile: "bitki_demo_profile",
  farms: "bitki_demo_farms",
  parcels: "bitki_demo_parcels",
  applications: "bitki_demo_applications",
  inventory: "bitki_demo_inventory",
  notifications: "bitki_demo_notifications",
  analyses: "bitki_demo_analyses",
  activeFarm: "bitki_demo_active_farm",
  sensorDevices: "bitki_demo_sensor_devices",
  sensorReadings: "bitki_demo_sensor_readings",
} as const;

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event("bitki-store-updated"));
}

export function getDemoSession(): DemoSession | null {
  return read<DemoSession | null>(KEYS.session, null);
}

export function setDemoSession(session: DemoSession | null) {
  if (!session) {
    localStorage.removeItem(KEYS.session);
    document.cookie = "bitki_demo_session=; path=/; max-age=0";
    write(KEYS.session, null);
    return;
  }
  write(KEYS.session, session);
  document.cookie = `bitki_demo_session=${encodeURIComponent(session.userId)}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
}

export function ensureGuestSession(): DemoSession {
  const existing = getDemoSession();
  if (existing) {
    setDemoSession(existing);
    return existing;
  }
  return demoLogin("misafir@demo.local", "Misafir Üretici", "producer");
}

export function demoLogin(email: string, fullName: string, role: UserRole): DemoSession {
  const userId = createId();
  const session: DemoSession = { userId, email, fullName, role };
  const profile: Profile = {
    id: userId,
    full_name: fullName,
    role,
    created_at: new Date().toISOString(),
  };
  write(KEYS.profile, profile);
  setDemoSession(session);

  const farmId = createId();
  const farm: Farm = {
    id: farmId,
    name: role === "advisor" ? "Demo Danışman Portföyü" : "Ana İşletme",
    owner_id: userId,
    location_label: "Türkiye",
    created_at: new Date().toISOString(),
  };
  write(KEYS.farms, [farm]);
  write(KEYS.activeFarm, farmId);

  if (role === "advisor") {
    const farm2: Farm = {
      id: createId(),
      name: "Müşteri — Zeytinlik A.Ş.",
      owner_id: userId,
      location_label: "Aydın",
      created_at: new Date().toISOString(),
    };
    write(KEYS.farms, [farm, farm2]);
  }

  write(KEYS.parcels, []);
  write(KEYS.applications, []);
  write(KEYS.inventory, []);
  write(KEYS.notifications, [
    {
      id: createId(),
      user_id: userId,
      farm_id: farmId,
      type: "system",
      title: "BitkiAnaliz Pro’ya hoş geldiniz",
      body: "Demo modunda çalışıyorsunuz. Supabase anahtarlarını ekleyerek buluta geçebilirsiniz.",
      read: false,
      created_at: new Date().toISOString(),
    } satisfies NotificationItem,
  ]);
  write(KEYS.analyses, []);
  seedDefaultSensors(farmId);

  return session;
}

function seedDefaultSensors(farmId: string) {
  const now = new Date().toISOString();
  const devices: SensorDevice[] = [
    {
      id: createId(),
      farm_id: farmId,
      name: "Ecowitt WS90 — Dış İstasyon",
      vendor: "ecowitt_ws90",
      kind: "outdoor_weather",
      location_label: "Bahçe çatısı",
      external_id: "ws90-main",
      online: true,
      last_seen_at: now,
      created_at: now,
    },
    {
      id: createId(),
      farm_id: farmId,
      name: "ESP32 — Sera İklim",
      vendor: "esp32",
      kind: "greenhouse_climate",
      location_label: "Sera A orta",
      external_id: "esp32-sera-a",
      online: true,
      last_seen_at: now,
      created_at: now,
    },
    {
      id: createId(),
      farm_id: farmId,
      name: "Zigbee — Toprak Nem",
      vendor: "zigbee",
      kind: "soil_moisture",
      location_label: "Sera A sıra 3",
      external_id: "zb-soil-03",
      online: true,
      last_seen_at: now,
      created_at: now,
      meta: { model: "soil_moisture_temp" },
    },
    {
      id: createId(),
      farm_id: farmId,
      name: "Sonoff — Sera Nem/Isı",
      vendor: "sonoff",
      kind: "greenhouse_climate",
      location_label: "Sera B giriş",
      external_id: "sonoff-th-01",
      online: true,
      last_seen_at: now,
      created_at: now,
      meta: { model: "SNZB-02" },
    },
  ];

  const readings: SensorReading[] = devices.map((d, i) => ({
    id: createId(),
    device_id: d.id,
    farm_id: farmId,
    recorded_at: now,
    temperature_c: d.kind === "soil_moisture" ? 18 + i : 22 + i * 1.5,
    humidity_pct: d.kind === "outdoor_weather" ? 48 : 68 + i * 2,
    soil_moisture_pct: d.kind === "soil_moisture" ? 42 : null,
    soil_temp_c: d.kind === "soil_moisture" ? 17.5 : null,
    pressure_hpa: d.kind === "outdoor_weather" ? 1012 : null,
    wind_kmh: d.kind === "outdoor_weather" ? 8 : null,
    rain_mm: d.kind === "outdoor_weather" ? 0 : null,
    co2_ppm: d.kind === "greenhouse_climate" ? 620 + i * 30 : null,
    leaf_wetness_pct: null,
    vpd_kpa: d.kind === "greenhouse_climate" ? 0.85 : null,
  }));

  write(KEYS.sensorDevices, devices);
  write(KEYS.sensorReadings, readings);
}

export function getProfile(): Profile | null {
  return read<Profile | null>(KEYS.profile, null);
}

export function getFarms(): Farm[] {
  return read<Farm[]>(KEYS.farms, []);
}

export function getActiveFarmId(): string | null {
  return read<string | null>(KEYS.activeFarm, null);
}

export function setActiveFarmId(id: string) {
  write(KEYS.activeFarm, id);
}

export function addFarm(name: string, location?: string): Farm {
  const session = getDemoSession();
  if (!session) throw new Error("Oturum yok");
  const farm: Farm = {
    id: createId(),
    name,
    owner_id: session.userId,
    location_label: location ?? null,
    created_at: new Date().toISOString(),
  };
  write(KEYS.farms, [...getFarms(), farm]);
  return farm;
}

export function getParcels(farmId?: string): Parcel[] {
  const all = read<Parcel[]>(KEYS.parcels, []);
  return farmId ? all.filter((p) => p.farm_id === farmId) : all;
}

export function addParcel(input: Omit<Parcel, "id" | "created_at">): Parcel {
  const parcel: Parcel = {
    ...input,
    id: createId(),
    created_at: new Date().toISOString(),
  };
  write(KEYS.parcels, [...getParcels(), parcel]);
  return parcel;
}

export function updateParcel(id: string, patch: Partial<Parcel>): Parcel | null {
  const all = getParcels();
  const idx = all.findIndex((p) => p.id === id);
  if (idx < 0) return null;
  all[idx] = { ...all[idx], ...patch };
  write(KEYS.parcels, all);
  return all[idx];
}

export function deleteParcel(id: string) {
  write(
    KEYS.parcels,
    getParcels().filter((p) => p.id !== id)
  );
}

export function getApplications(farmId?: string): ApplicationRecord[] {
  const all = read<ApplicationRecord[]>(KEYS.applications, []);
  return farmId ? all.filter((a) => a.farm_id === farmId) : all;
}

export function addApplication(
  input: Omit<ApplicationRecord, "id" | "created_at">
): ApplicationRecord {
  const record: ApplicationRecord = {
    ...input,
    id: createId(),
    created_at: new Date().toISOString(),
  };
  write(KEYS.applications, [record, ...getApplications()]);

  if (input.quantity && input.item_name) {
    const inv = getInventory(input.farm_id);
    const match = inv.find(
      (i) =>
        i.name === input.item_name || (input.item_id && i.item_id === input.item_id)
    );
    if (match) {
      updateInventory(match.id, {
        quantity: Math.max(0, match.quantity - (input.quantity ?? 0)),
      });
    }
  }

  return record;
}

export function checkRotation(
  farmId: string,
  parcelId: string | null | undefined,
  activeIngredient: string | null | undefined,
  itemName: string
): ApplicationRecord | undefined {
  if (!activeIngredient && !itemName) return undefined;
  const twoWeeksAgo = Date.now() - 15 * 24 * 60 * 60 * 1000;
  return getApplications(farmId).find((r) => {
    const when = new Date(r.applied_at || r.created_at).getTime();
    if (when < twoWeeksAgo) return false;
    if (parcelId && r.parcel_id && r.parcel_id !== parcelId) return false;
    if (activeIngredient && r.active_ingredient === activeIngredient) return true;
    return r.item_name === itemName;
  });
}

export function getInventory(farmId?: string): InventoryItem[] {
  const all = read<InventoryItem[]>(KEYS.inventory, []);
  return farmId ? all.filter((i) => i.farm_id === farmId) : all;
}

export function addInventoryItem(input: Omit<InventoryItem, "id" | "updated_at">): InventoryItem {
  const item: InventoryItem = {
    ...input,
    id: createId(),
    updated_at: new Date().toISOString(),
  };
  write(KEYS.inventory, [...getInventory(), item]);
  return item;
}

export function updateInventory(id: string, patch: Partial<InventoryItem>): InventoryItem | null {
  const all = getInventory();
  const idx = all.findIndex((i) => i.id === id);
  if (idx < 0) return null;
  all[idx] = { ...all[idx], ...patch, updated_at: new Date().toISOString() };
  write(KEYS.inventory, all);

  if (all[idx].quantity <= all[idx].min_threshold) {
    const session = getDemoSession();
    if (session) {
      addNotification({
        user_id: session.userId,
        farm_id: all[idx].farm_id,
        type: "stock",
        title: "Düşük stok uyarısı",
        body: `${all[idx].name} stoku eşik altında (${all[idx].quantity} ${all[idx].unit}).`,
        read: false,
      });
    }
  }

  return all[idx];
}

export function getNotifications(): NotificationItem[] {
  return read<NotificationItem[]>(KEYS.notifications, []);
}

export function addNotification(
  input: Omit<NotificationItem, "id" | "created_at">
): NotificationItem {
  const n: NotificationItem = {
    ...input,
    id: createId(),
    created_at: new Date().toISOString(),
  };
  write(KEYS.notifications, [n, ...getNotifications()]);
  return n;
}

export function markNotificationRead(id: string) {
  const all = getNotifications().map((n) => (n.id === id ? { ...n, read: true } : n));
  write(KEYS.notifications, all);
}

export function getAnalyses(farmId?: string): AnalysisRecord[] {
  const all = read<AnalysisRecord[]>(KEYS.analyses, []);
  return farmId ? all.filter((a) => a.farm_id === farmId) : all;
}

export function addAnalysis(input: Omit<AnalysisRecord, "id" | "created_at">): AnalysisRecord {
  const record: AnalysisRecord = {
    ...input,
    id: createId(),
    created_at: new Date().toISOString(),
  };
  write(KEYS.analyses, [record, ...getAnalyses()]);
  return record;
}

export function subscribeStore(cb: () => void) {
  const handler = () => cb();
  window.addEventListener("bitki-store-updated", handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener("bitki-store-updated", handler);
    window.removeEventListener("storage", handler);
  };
}

export function getSensorDevices(farmId?: string): SensorDevice[] {
  const all = read<SensorDevice[]>(KEYS.sensorDevices, []);
  return farmId ? all.filter((d) => d.farm_id === farmId) : all;
}

export function getSensorReadings(farmId?: string, deviceId?: string): SensorReading[] {
  let all = read<SensorReading[]>(KEYS.sensorReadings, []);
  if (farmId) all = all.filter((r) => r.farm_id === farmId);
  if (deviceId) all = all.filter((r) => r.device_id === deviceId);
  return all.sort((a, b) => b.recorded_at.localeCompare(a.recorded_at));
}

export function latestReadingForDevice(deviceId: string): SensorReading | null {
  return getSensorReadings(undefined, deviceId)[0] || null;
}

export function ensureSensorsForFarm(farmId: string) {
  if (getSensorDevices(farmId).length === 0) seedDefaultSensors(farmId);
}

export function upsertSensorReading(
  input: Omit<SensorReading, "id"> & { id?: string }
): SensorReading {
  const reading: SensorReading = {
    ...input,
    id: input.id || createId(),
  };
  const devices = getSensorDevices().map((d) =>
    d.id === reading.device_id
      ? { ...d, online: true, last_seen_at: reading.recorded_at }
      : d
  );
  write(KEYS.sensorDevices, devices);
  write(KEYS.sensorReadings, [reading, ...getSensorReadings()].slice(0, 500));
  return reading;
}

export function addSensorDevice(input: Omit<SensorDevice, "id" | "created_at">): SensorDevice {
  const device: SensorDevice = {
    ...input,
    id: createId(),
    created_at: new Date().toISOString(),
  };
  write(KEYS.sensorDevices, [...getSensorDevices(), device]);
  return device;
}

/** Simüle canlı okuma (demo) */
export function simulateLiveReadings(farmId: string) {
  ensureSensorsForFarm(farmId);
  const now = new Date().toISOString();
  for (const d of getSensorDevices(farmId)) {
    const jitter = () => (Math.random() - 0.5) * 2;
    upsertSensorReading({
      device_id: d.id,
      farm_id: farmId,
      recorded_at: now,
      temperature_c:
        d.kind === "soil_moisture" ? 17 + jitter() : d.kind === "outdoor_weather" ? 21 + jitter() * 2 : 24 + jitter(),
      humidity_pct: d.kind === "outdoor_weather" ? 45 + jitter() * 5 : 65 + jitter() * 4,
      soil_moisture_pct: d.kind === "soil_moisture" ? Math.min(80, Math.max(20, 40 + jitter() * 8)) : null,
      soil_temp_c: d.kind === "soil_moisture" ? 17 + jitter() * 0.5 : null,
      pressure_hpa: d.kind === "outdoor_weather" ? 1011 + jitter() : null,
      wind_kmh: d.kind === "outdoor_weather" ? Math.max(0, 7 + jitter() * 3) : null,
      rain_mm: d.kind === "outdoor_weather" ? 0 : null,
      co2_ppm: d.kind === "greenhouse_climate" ? 600 + jitter() * 40 : null,
      vpd_kpa: d.kind === "greenhouse_climate" ? 0.8 + jitter() * 0.1 : null,
    });
  }
}
