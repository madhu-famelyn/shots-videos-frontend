import type { Creator } from "./user";

export type NotificationType = "like" | "comment" | "follow" | "new_video";

export interface AppNotification {
  id: string;
  type: NotificationType;
  actor: Creator;
  text: string;
  isRead: boolean;
  createdAt: string;
}
