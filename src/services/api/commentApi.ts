import type { Comment } from "@/types/comment";
import { apiClient, delay, USE_MOCK_API } from "./client";
import { db } from "./mockDb";
import { transformComment } from "./transformers";

export const commentApi = {
  async list(videoId: string): Promise<Comment[]> {
    if (USE_MOCK_API) {
      await delay(350);
      return db.comments.filter((c) => c.videoId === videoId);
    }
    try {
      const { data } = await apiClient.get<any[]>(`/videos/${videoId}/comments`);
      if (Array.isArray(data)) {
        return data.map(transformComment);
      }
      return db.comments.filter((c) => c.videoId === videoId);
    } catch {
      return db.comments.filter((c) => c.videoId === videoId);
    }
  },

  async create(videoId: string, text: string): Promise<Comment> {
    if (USE_MOCK_API) {
      await delay(200);
      const comment: Comment = {
        id: `cm-${Date.now()}`,
        videoId,
        user: { ...db.me },
        text,
        likes: 0,
        isLiked: false,
        isOwn: true,
        createdAt: new Date().toISOString(),
      };
      db.comments.unshift(comment);
      return comment;
    }
    try {
      const { data } = await apiClient.post<any>(`/videos/${videoId}/comments`, { text });
      return transformComment(data);
    } catch {
      const comment: Comment = {
        id: `cm-${Date.now()}`,
        videoId,
        user: { ...db.me },
        text,
        likes: 0,
        isLiked: false,
        isOwn: true,
        createdAt: new Date().toISOString(),
      };
      db.comments.unshift(comment);
      return comment;
    }
  },

  async remove(commentId: string): Promise<void> {
    if (USE_MOCK_API) {
      await delay(150);
      db.comments = db.comments.filter((c) => c.id !== commentId);
      return;
    }
    try {
      await apiClient.delete(`/comments/${commentId}`);
    } catch {
      db.comments = db.comments.filter((c) => c.id !== commentId);
    }
  },
};
