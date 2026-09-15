import type { AppNotification } from "@/types/notification";
import { mockCreators } from "./users";

const ITEMS: Array<Pick<AppNotification, "type" | "text">> = [
  { type: "like", text: "liked your video “Golden hour on the ridge”" },
  { type: "comment", text: "commented: “This is unreasonably good.”" },
  { type: "follow", text: "started following you" },
  { type: "new_video", text: "posted a new video" },
];

export const mockNotifications: AppNotification[] = Array.from({ length: 14 }, (_, i) => {
  const base = ITEMS[i % ITEMS.length]!;
  return {
    id: `n${i + 1}`,
    type: base.type,
    text: base.text,
    actor: mockCreators[i % mockCreators.length]!,
    isRead: i > 4,
    createdAt: new Date(Date.now() - i * 5400_000).toISOString(),
  };
});
