import type { Creator, UserProfile } from "@/types/user";
import type { Category } from "@/types/category";
import type { HistoryEntry, Video } from "@/types/video";
import { apiClient, delay, USE_MOCK_API } from "./client";
import { db } from "./mockDb";
import { transformCreator, transformHistoryEntry, transformUserProfile, transformVideo } from "./transformers";

export interface SearchResults {
  videos: Video[];
  creators: Creator[];
  categories: Category[];
}

export const userApi = {
  async me(): Promise<UserProfile> {
    if (USE_MOCK_API) {
      await delay(220);
      return db.me;
    }
    try {
      const { data } = await apiClient.get<any>("/users/me");
      return transformUserProfile(data);
    } catch {
      return db.me;
    }
  },

  async updateMe(payload: Partial<UserProfile>): Promise<UserProfile> {
    if (USE_MOCK_API) {
      await delay(250);
      db.me = { ...db.me, ...payload };
      return db.me;
    }
    try {
      const { data } = await apiClient.put<any>("/users/me", payload);
      return transformUserProfile(data);
    } catch {
      db.me = { ...db.me, ...payload };
      return db.me;
    }
  },

  async myVideos(): Promise<Video[]> {
    if (USE_MOCK_API) {
      await delay(250);
      return db.videos.slice(0, 9);
    }
    try {
      const { data } = await apiClient.get<any[]>("/users/me/videos");
      if (Array.isArray(data)) {
        return data.map(transformVideo);
      }
      return db.videos.slice(0, 9);
    } catch {
      return db.videos.slice(0, 9);
    }
  },

  async history(): Promise<HistoryEntry[]> {
    if (USE_MOCK_API) {
      await delay(250);
      return db.history;
    }
    try {
      const { data } = await apiClient.get<any[]>("/users/me/history");
      if (Array.isArray(data)) {
        return data.map(transformHistoryEntry);
      }
      return db.history;
    } catch {
      return db.history;
    }
  },

  async follow(userId: string): Promise<void> {
    if (USE_MOCK_API) {
      await delay(150);
      return;
    }
    try {
      await apiClient.post(`/users/${userId}/follow`);
    } catch (err) {
      console.warn("Follow fallback:", err);
    }
  },

  async unfollow(userId: string): Promise<void> {
    if (USE_MOCK_API) {
      await delay(150);
      return;
    }
    try {
      await apiClient.delete(`/users/${userId}/follow`);
    } catch (err) {
      console.warn("Unfollow fallback:", err);
    }
  },

  async search(query: string): Promise<SearchResults> {
    if (USE_MOCK_API) {
      await delay(300);
      const q = query.trim().toLowerCase();
      if (!q) return { videos: [], creators: [], categories: [] };
      const videos = db.videos.filter(
        (v) => v.title.toLowerCase().includes(q) || v.description.toLowerCase().includes(q),
      );
      const seen = new Set<string>();
      const creators = db.videos
        .map((v) => v.creator)
        .filter((c) => {
          const match = c.name.toLowerCase().includes(q) || c.username.toLowerCase().includes(q);
          if (!match || seen.has(c.id)) return false;
          seen.add(c.id);
          return true;
        });
      const catSeen = new Set<string>();
      const categories = db.videos
        .map((v) => v.category)
        .filter((c) => {
          if (!c.name.toLowerCase().includes(q) || catSeen.has(c.id)) return false;
          catSeen.add(c.id);
          return true;
        });
      return { videos, creators, categories };
    }
    try {
      const { data } = await apiClient.get<any>("/search", { params: { q: query } });
      return {
        videos: Array.isArray(data?.videos) ? data.videos.map(transformVideo) : [],
        creators: Array.isArray(data?.creators) ? data.creators.map(transformCreator) : [],
        categories: Array.isArray(data?.categories) ? data.categories : [],
      };
    } catch (err) {
      console.warn("Search fallback to mock:", err);
      const q = query.trim().toLowerCase();
      if (!q) return { videos: [], creators: [], categories: [] };
      const videos = db.videos.filter(
        (v) => v.title.toLowerCase().includes(q) || v.description.toLowerCase().includes(q),
      );
      return { videos, creators: [], categories: [] };
    }
  },
};
