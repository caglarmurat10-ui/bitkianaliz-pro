"use client";

import { useEffect } from "react";

export function PwaRegister() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    navigator.serviceWorker.register("/sw.js").catch((err) => {
      console.warn("SW register failed", err);
    });

    // Cache last analyses/calendar snapshot for offline shell
    try {
      const analyses = localStorage.getItem("bitki_demo_analyses");
      const apps = localStorage.getItem("bitki_demo_applications");
      if (analyses) localStorage.setItem("bitki_offline_analyses", analyses);
      if (apps) localStorage.setItem("bitki_offline_applications", apps);
    } catch {
      /* ignore */
    }

    if ("Notification" in window && Notification.permission === "default") {
      // Soft prompt later via UI — do not block
    }
  }, []);

  return null;
}
