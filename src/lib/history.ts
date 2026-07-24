import {
  addApplication,
  checkRotation as demoCheckRotation,
  getApplications,
} from "@/lib/demo-store";
import type { ApplicationRecord, AppItemType } from "@/lib/types";

/** @deprecated Prefer demo-store / Supabase — kept for compatibility */
export type { ApplicationRecord };

export const getHistory = (farmId?: string): ApplicationRecord[] => {
  return getApplications(farmId);
};

export const addRecord = (
  record: Omit<ApplicationRecord, "id" | "created_at"> & {
    type: AppItemType;
  }
) => {
  const created = addApplication(record);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("historyUpdated"));
  }
  return created;
};

export const clearHistory = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("bitki_demo_applications");
  window.dispatchEvent(new Event("historyUpdated"));
  window.dispatchEvent(new Event("bitki-store-updated"));
};

export const checkRotation = (
  itemName: string,
  opts?: { farmId?: string; parcelId?: string; activeIngredient?: string }
): ApplicationRecord | undefined => {
  const farmId = opts?.farmId || getApplications()[0]?.farm_id;
  if (!farmId) return undefined;
  return demoCheckRotation(farmId, opts?.parcelId, opts?.activeIngredient, itemName);
};
