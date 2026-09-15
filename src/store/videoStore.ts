import { create } from "zustand";
import type { Video } from "@/types/video";

interface VideoState {
  feed: Video[];
  currentVideoId: string | null;
  page: number;
  hasMore: boolean;
  loading: boolean;
  error: string | null;
  muted: boolean;
  activeCategoryId: string | null;
  setFeed: (videos: Video[]) => void;
  appendFeed: (videos: Video[]) => void;
  setPagination: (input: { page: number; hasMore: boolean }) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setCurrentVideo: (id: string | null) => void;
  toggleMuted: () => void;
  setCategory: (categoryId: string | null) => void;
  patchVideo: (id: string, patch: Partial<Video>) => void;
  reset: () => void;
}

export const useVideoStore = create<VideoState>((set) => ({
  feed: [],
  currentVideoId: null,
  page: 0,
  hasMore: true,
  loading: false,
  error: null,
  muted: true,
  activeCategoryId: null,

  setFeed: (feed) => set({ feed }),
  appendFeed: (videos) =>
    set((s) => {
      const seen = new Set(s.feed.map((v) => v.id));
      return { feed: [...s.feed, ...videos.filter((v) => !seen.has(v.id))] };
    }),
  setPagination: ({ page, hasMore }) => set({ page, hasMore }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setCurrentVideo: (currentVideoId) => set({ currentVideoId }),
  toggleMuted: () => set((s) => ({ muted: !s.muted })),
  setCategory: (activeCategoryId) =>
    set({ activeCategoryId, feed: [], page: 0, hasMore: true, error: null }),
  patchVideo: (id, patch) =>
    set((s) => ({ feed: s.feed.map((v) => (v.id === id ? { ...v, ...patch } : v)) })),
  reset: () => set({ feed: [], page: 0, hasMore: true, error: null, currentVideoId: null }),
}));
