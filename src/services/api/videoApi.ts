import { mockCategories } from "@/mock/categories";
import type { Category } from "@/types/category";
import type { Paginated, ReportReason, Video } from "@/types/video";
import { apiClient, delay, USE_MOCK_API } from "./client";
import { db, recordHistory } from "./mockDb";
import { transformVideo } from "./transformers";

export interface FeedParams {
  page?: number;
  limit?: number;
  categoryId?: string;
}

export const videoApi = {
  async getFeed({ page = 1, limit = 5, categoryId }: FeedParams = {}): Promise<Paginated<Video>> {
    if (USE_MOCK_API) {
      await delay(400);
      const pool = categoryId ? db.videos.filter((v) => v.category.id === categoryId) : db.videos;
      const start = (page - 1) * limit;
      const items = pool.slice(start, start + limit);
      return { items, page, limit, total: pool.length, hasMore: start + limit < pool.length };
    }
    try {
      const { data } = await apiClient.get<any>("/videos/feed", {
        params: { page, limit, category_id: categoryId },
      });
      const items = Array.isArray(data?.items) ? data.items.map(transformVideo) : [];
      return {
        items,
        page: data?.page ?? page,
        limit: data?.limit ?? limit,
        total: data?.total ?? items.length,
        hasMore: Boolean(data?.hasMore ?? data?.has_more ?? false),
      };
    } catch (err) {
      console.warn("FastAPI feed fallback to mock:", err);
      const pool = categoryId ? db.videos.filter((v) => v.category.id === categoryId) : db.videos;
      const start = (page - 1) * limit;
      const items = pool.slice(start, start + limit);
      return { items, page, limit, total: pool.length, hasMore: start + limit < pool.length };
    }
  },

  async getById(id: string): Promise<Video> {
    if (USE_MOCK_API) {
      await delay(200);
      const video = db.videos.find((v) => v.id === id);
      if (!video) throw new Error("Video not found");
      return video;
    }
    try {
      const { data } = await apiClient.get<any>(`/videos/${id}`);
      return transformVideo(data);
    } catch (err) {
      console.warn(`FastAPI video (${id}) fallback:`, err);
      const video = db.videos.find((v) => v.id === id);
      if (video) return video;
      throw err;
    }
  },

  async like(videoId: string): Promise<void> {
    if (USE_MOCK_API) {
      await delay(150);
      return;
    }
    try {
      await apiClient.post(`/videos/${videoId}/like`);
    } catch (err) {
      console.warn("Like API fallback:", err);
    }
  },

  async unlike(videoId: string): Promise<void> {
    if (USE_MOCK_API) {
      await delay(150);
      return;
    }
    try {
      await apiClient.delete(`/videos/${videoId}/like`);
    } catch (err) {
      console.warn("Unlike API fallback:", err);
    }
  },

  async report(
    videoId: string,
    payload: { reason: ReportReason; description?: string },
  ): Promise<void> {
    if (USE_MOCK_API) {
      await delay(300);
      return;
    }
    try {
      await apiClient.post(`/videos/${videoId}/report`, payload);
    } catch (err) {
      console.warn("Report API fallback:", err);
    }
  },

  /** Throttled by the caller — never send this per frame. */
  async trackEvent(
    videoId: string,
    event: "video_started" | "video_progress" | "video_completed",
    progress: number,
  ): Promise<void> {
    if (USE_MOCK_API) {
      const video = db.videos.find((v) => v.id === videoId);
      if (video) recordHistory(video, progress);
      return;
    }
    try {
      await apiClient.post(`/videos/${videoId}/events`, { event, progress });
    } catch (err) {
      console.warn("Track event fallback:", err);
      const video = db.videos.find((v) => v.id === videoId);
      if (video) recordHistory(video, progress);
    }
  },

  async getCategories(): Promise<Category[]> {
    if (USE_MOCK_API) {
      await delay(150);
      return mockCategories;
    }
    try {
      const { data } = await apiClient.get<Category[]>("/categories");
      return data;
    } catch (err) {
      console.warn("Categories API fallback:", err);
      return mockCategories;
    }
  },
};
