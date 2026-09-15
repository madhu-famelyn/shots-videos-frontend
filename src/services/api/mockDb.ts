import { mockComments } from "@/mock/comments";
import { mockNotifications } from "@/mock/notifications";
import { mockMe } from "@/mock/users";
import { mockVideos } from "@/mock/videos";
import type { Comment } from "@/types/comment";
import type { AppNotification } from "@/types/notification";
import type { UserProfile } from "@/types/user";
import type { HistoryEntry, Video } from "@/types/video";

/** In-memory mutable copy of the mock dataset, so optimistic writes persist per session. */
export const db = {
  me: { ...mockMe } as UserProfile,
  videos: mockVideos.map((v) => ({ ...v })) as Video[],
  comments: mockComments.map((c) => ({ ...c })) as Comment[],
  notifications: mockNotifications.map((n) => ({ ...n })) as AppNotification[],
  history: [] as HistoryEntry[],
};

export function recordHistory(video: Video, progress: number) {
  const existing = db.history.find((h) => h.video.id === video.id);
  if (existing) {
    existing.progress = Math.max(existing.progress, progress);
    existing.watchedAt = new Date().toISOString();
    return;
  }
  db.history.unshift({ video, progress, watchedAt: new Date().toISOString() });
}
