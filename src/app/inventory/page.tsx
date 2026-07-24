"use client";

import { FormEvent, useEffect, useState } from "react";
import { AppProviders } from "@/components/app-providers";
import { useFarm } from "@/components/farm-provider";
import { AGRI_ITEMS } from "@/data/agri-data";
import { isDemoMode } from "@/lib/config";
import {
  addInventoryItem,
  getInventory,
  subscribeStore,
  updateInventory,
} from "@/lib/demo-store";
import type { AppItemType, InventoryItem } from "@/lib/types";
import { Package } from "lucide-react";

function InventoryContent() {
  const { activeFarm } = useFarm();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [itemId, setItemId] = useState("");
  const [quantity, setQuantity] = useState("10");
  const [unit, setUnit] = useState("kg");
  const [minThreshold, setMinThreshold] = useState("2");

  useEffect(() => {
    if (!activeFarm || !isDemoMode()) return;
    const load = () => setItems(getInventory(activeFarm.id));
    load();
    return subscribeStore(load);
  }, [activeFarm]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!activeFarm) return;
    const catalog = AGRI_ITEMS.find((i) => i.id === itemId);
    if (!catalog) return;
    addInventoryItem({
      farm_id: activeFarm.id,
      item_id: catalog.id,
      name: catalog.name,
      type: catalog.category as AppItemType,
      quantity: Number(quantity) || 0,
      unit,
      min_threshold: Number(minThreshold) || 0,
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <form onSubmit={onSubmit} className="space-y-3 rounded-3xl border border-white/10 bg-slate-900/60 p-6">
        <h2 className="font-bold text-white">Stok ekle</h2>
        <select className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white" value={itemId} onChange={(e) => setItemId(e.target.value)} required>
          <option value="">Ürün</option>
          {AGRI_ITEMS.map((i) => (
            <option key={i.id} value={i.id}>{i.name}</option>
          ))}
        </select>
        <input className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
        <input className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white" value={unit} onChange={(e) => setUnit(e.target.value)} />
        <input className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white" type="number" value={minThreshold} onChange={(e) => setMinThreshold(e.target.value)} />
        <button className="w-full rounded-xl bg-emerald-600 py-2 font-semibold text-white">Ekle</button>
      </form>
      <div className="space-y-3 lg:col-span-2">
        {items.map((item) => {
          const low = item.quantity <= item.min_threshold;
          return (
            <div key={item.id} className={`rounded-2xl border p-4 ${low ? "border-amber-500/40 bg-amber-500/10" : "border-white/10 bg-slate-900/60"}`}>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Package className={`h-5 w-5 ${low ? "text-amber-400" : "text-emerald-400"}`} />
                  <div>
                    <p className="font-semibold text-white">{item.name}</p>
                    <p className="text-xs text-slate-400">eşik {item.min_threshold} {item.unit}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="rounded-lg bg-white/5 px-2 py-1" onClick={() => updateInventory(item.id, { quantity: Math.max(0, item.quantity - 1) })}>−</button>
                  <span className="min-w-16 text-center font-mono text-white">{item.quantity} {item.unit}</span>
                  <button className="rounded-lg bg-white/5 px-2 py-1" onClick={() => updateInventory(item.id, { quantity: item.quantity + 1 })}>+</button>
                </div>
              </div>
            </div>
          );
        })}
        {items.length === 0 && <p className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-slate-500">Stok boş</p>}
      </div>
    </div>
  );
}

export default function InventoryPage() {
  return (
    <AppProviders title="Stok">
      <InventoryContent />
    </AppProviders>
  );
}
