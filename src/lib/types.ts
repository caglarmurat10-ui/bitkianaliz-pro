export type UserRole = "producer" | "advisor";
export type AppItemType = "GÜBRE" | "İLAÇ" | "DİĞER";
export type SeverityLevel = "low" | "medium" | "high" | "critical";
export type NotifType = "weather" | "stock" | "schedule" | "system" | "sensor";

export type SensorVendor = "esp32" | "ecowitt_ws90" | "sonoff" | "zigbee" | "openweather" | "manual";
export type SensorKind =
  | "outdoor_weather"
  | "greenhouse_climate"
  | "soil_moisture"
  | "soil_temp"
  | "leaf_wetness"
  | "co2"
  | "relay";

export interface SensorDevice {
  id: string;
  farm_id: string;
  name: string;
  vendor: SensorVendor;
  kind: SensorKind;
  location_label?: string | null;
  external_id?: string | null;
  online: boolean;
  last_seen_at?: string | null;
  meta?: Record<string, unknown>;
  created_at: string;
}

export interface SensorReading {
  id: string;
  device_id: string;
  farm_id: string;
  recorded_at: string;
  temperature_c?: number | null;
  humidity_pct?: number | null;
  soil_moisture_pct?: number | null;
  soil_temp_c?: number | null;
  pressure_hpa?: number | null;
  wind_kmh?: number | null;
  rain_mm?: number | null;
  co2_ppm?: number | null;
  leaf_wetness_pct?: number | null;
  vpd_kpa?: number | null;
  raw?: Record<string, unknown>;
}

export interface Profile {
  id: string;
  full_name: string | null;
  role: UserRole;
  created_at: string;
}

export interface Farm {
  id: string;
  name: string;
  owner_id: string;
  location_label?: string | null;
  created_at: string;
}

export interface Parcel {
  id: string;
  farm_id: string;
  name: string;
  crop?: string | null;
  area_dekar?: number;
  lat?: number | null;
  lon?: number | null;
  notes?: string | null;
  created_at: string;
}

export interface ApplicationRecord {
  id: string;
  farm_id: string;
  parcel_id?: string | null;
  user_id: string;
  item_id?: string | null;
  item_name: string;
  active_ingredient?: string | null;
  type: AppItemType;
  quantity?: number | null;
  unit?: string | null;
  scheduled_at?: string | null;
  applied_at?: string | null;
  notes?: string | null;
  created_at: string;
}

export interface InventoryItem {
  id: string;
  farm_id: string;
  item_id?: string | null;
  name: string;
  type: AppItemType;
  quantity: number;
  unit: string;
  min_threshold: number;
  updated_at: string;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  farm_id?: string | null;
  type: NotifType;
  title: string;
  body: string;
  read: boolean;
  created_at: string;
}

export interface Disease {
  id: string;
  plant: string;
  name: string;
  pathogen?: string;
  symptoms: string[];
  cultural_measures: string[];
  chemical_measures: string[];
  severity_hint: SeverityLevel;
  /** Katalog görseli (yerel /public veya uzak URL) */
  image: string;
}

export interface AnalysisAlternative {
  diagnosis: string;
  confidence: number;
  disease_id?: string | null;
}

export interface AnalysisRecord {
  id: string;
  user_id: string;
  farm_id?: string | null;
  parcel_id?: string | null;
  image_path?: string | null;
  plant_name: string;
  diagnosis: string;
  confidence: number;
  severity?: SeverityLevel | null;
  disease_id?: string | null;
  alternatives: AnalysisAlternative[];
  treatment: string[];
  fertilizer: string[];
  weather_snapshot?: Record<string, unknown> | null;
  spray_timing_note?: string | null;
  created_at: string;
}

export interface DemoSession {
  userId: string;
  email: string;
  fullName: string;
  role: UserRole;
}
