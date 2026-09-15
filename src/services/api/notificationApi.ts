import type { AppNotification } from "@/types/notification";
import { apiClient, delay, USE_MOCK_API } from "./client";
import { db } from "./mockDb";

export const notificationApi = {
  async list(): Promise<AppNotification[]> {
    if (USE_MOCK_API) {
      await delay(380);
      return db.notifications;
    }
    try {
      const { data } = await apiClient.get<AppNotification[]>("/notifications");
      return Array.isArray(data) ? data : db.notifications;
    } catch {
      return db.notifications;
    }
  },

  async markRead(id: string): Promise<void> {
    if (USE_MOCK_API) {
      await delay(120);
      const item = db.notifications.find((n) => n.id === id);
      if (item) item.isRead = true;
      return;
    }
    try {
      await apiClient.post(`/notifications/${id}/read`);
    } catch {
      const item = db.notifications.find((n) => n.id === id);
      if (item) item.isRead = true;
    }
  },
};
