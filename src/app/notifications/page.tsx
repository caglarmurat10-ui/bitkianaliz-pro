"use client";

import { AppProviders } from "@/components/app-providers";
import { NotificationsList } from "@/components/notifications-list";

export default function NotificationsPage() {
  return (
    <AppProviders title="Bildirimler">
      <NotificationsList />
    </AppProviders>
  );
}
