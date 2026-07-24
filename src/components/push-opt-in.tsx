"use client";

import { useState } from "react";
import { Bell } from "lucide-react";

export function PushOptIn() {
  const [status, setStatus] = useState<string>("");

  const enable = async () => {
    if (!("Notification" in window)) {
      setStatus("Bu tarayıcı bildirim desteklemiyor.");
      return;
    }
    const perm = await Notification.requestPermission();
    setStatus(perm === "granted" ? "Bildirimler açık" : "İzin verilmedi");
    if (perm === "granted") {
      new Notification("BitkiAnaliz Pro", {
        body: "Hava, stok ve ilaçlama hatırlatmaları aktif.",
        icon: "/icon-192.png",
      });
    }
  };

  return (
    <button
      onClick={enable}
      className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800"
    >
      <Bell className="h-3.5 w-3.5" />
      {status || "Web bildirimi aç"}
    </button>
  );
}
