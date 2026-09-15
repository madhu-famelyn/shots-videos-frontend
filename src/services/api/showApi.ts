import type { Show } from "@/types/video";
import { mockShows } from "@/mock/shows";
import { apiClient, delay, USE_MOCK_API } from "./client";
import { transformShow } from "./transformers";

export const showApi = {
  async list(params?: { category?: string; featured?: boolean }): Promise<Show[]> {
    if (USE_MOCK_API) {
      await delay(250);
      let list = mockShows;
      if (params?.category && params.category !== "all") {
        list = list.filter((s) => s.sectionCategory === params.category);
      }
      if (params?.featured !== undefined) {
        list = list.filter((s) => s.featured === params.featured);
      }
      return list;
    }
    try {
      const { data } = await apiClient.get<any[]>("/shows", { params });
      if (Array.isArray(data)) {
        return data.map(transformShow);
      }
      return mockShows;
    } catch (err) {
      console.warn("FastAPI shows fallback to mock:", err);
      return mockShows;
    }
  },

  async getTrending(): Promise<Show[]> {
    if (USE_MOCK_API) {
      await delay(200);
      return mockShows.filter((s) => s.sectionCategory === "trending");
    }
    try {
      const { data } = await apiClient.get<any[]>("/shows/trending");
      if (Array.isArray(data)) {
        return data.map(transformShow);
      }
      return mockShows.filter((s) => s.sectionCategory === "trending");
    } catch (err) {
      console.warn("FastAPI trending fallback to mock:", err);
      return mockShows.filter((s) => s.sectionCategory === "trending");
    }
  },

  async getByCategory(category: string): Promise<Show[]> {
    if (USE_MOCK_API) {
      await delay(200);
      return mockShows.filter((s) => s.sectionCategory === category);
    }
    try {
      const { data } = await apiClient.get<any[]>(`/shows/category/${category}`);
      if (Array.isArray(data)) {
        return data.map(transformShow);
      }
      return mockShows.filter((s) => s.sectionCategory === category);
    } catch (err) {
      console.warn(`FastAPI category (${category}) fallback:`, err);
      return mockShows.filter((s) => s.sectionCategory === category);
    }
  },

  async getById(id: string): Promise<Show | undefined> {
    if (USE_MOCK_API) {
      await delay(150);
      return mockShows.find((s) => s.id === id);
    }
    try {
      const { data } = await apiClient.get<any>(`/shows/${id}`);
      return transformShow(data);
    } catch (err) {
      console.warn(`FastAPI show (${id}) fallback:`, err);
      return mockShows.find((s) => s.id === id);
    }
  },
};
