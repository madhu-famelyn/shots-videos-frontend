import { create } from "zustand";

interface UserState {
  /** Creator ids the signed-in user follows, kept in sync optimistically. */
  following: Record<string, boolean>;
  recentSearches: string[];
  setFollowing: (userId: string, value: boolean) => void;
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  following: {},
  recentSearches: [],
  setFollowing: (userId, value) => set((s) => ({ following: { ...s.following, [userId]: value } })),
  addRecentSearch: (query) =>
    set((s) => {
      const q = query.trim();
      if (!q) return s;
      return { recentSearches: [q, ...s.recentSearches.filter((r) => r !== q)].slice(0, 8) };
    }),
  clearRecentSearches: () => set({ recentSearches: [] }),
}));
