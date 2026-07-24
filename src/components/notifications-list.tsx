"use client";

import { useEffect, useState } from "react";
import { getNotifications, markNotificationRead, subscribeStore } from "@/lib/demo-store";
import type { NotificationItem } from "@/lib/types";
import { Bell } from "lucide-react";

export function NotificationsList() {
  const [items, setItems] = useState<NotificationItem[]>([]);
  useEffect(() => {
    const load = () => setItems(getNotifications());
    load();
    return subscribeStore(load);
  }, []);

  return (
    <div className="space-y-3">
      {items.map((n) => (
        <button
          key={n.id}
          onClick={() => markNotificationRead(n.id)}
          className={`block w-full rounded-2xl border p-4 text-left ${
            n.read ? "border-white/10 bg-slate-900/40" : "border-emerald-500/30 bg-emerald-500/10"
          }`}
        >
          <div className="mb-1 flex items-center gap-2">
            <Bell className="h-4 w-4 text-emerald-400" />
            <p className="font-semibold text-white">{n.title}</p>
          </div>
          <p className="text-sm text-slate-400">{n.body}</p>
        </button>
      ))}
      {items.length === 0 && <p className="text-slate-500">Bildirim yok</p>}
    </div>
  );
}
