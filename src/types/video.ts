import type { Category } from "./category";
import type { Creator } from "./user";

export interface CastMember {
  name: string;
  role: string;
  avatar: string;
}

export interface Episode {
  id: string;
  episodeNumber: number;
  title: string;
  duration: number;
  thumbnailUrl: string;
  videoUrl: string;
  views: number;
  claps: number;
}

export interface Show {
  id: string;
  title: string;
  synopsis: string;
  coverImage: string;
  genre: string;
  language: string;
  rating: number;
  totalEpisodes: number;
  director: string;
  cast: CastMember[];
  episodes: Episode[];
  featured?: boolean;
  is18Plus?: boolean;
  isComingSoon?: boolean;
  releaseDate?: string;
  sectionCategory?: "trending" | "coming_soon" | "drama" | "18_plus" | "short_serial" | "thriller";
  badge?: string;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: number;
  views: number;
  likes: number;
  comments: number;
  isLiked: boolean;
  isFollowing: boolean;
  creator: Creator;
  category: Category;
  createdAt: string;
  seriesId?: string;
  seriesTitle?: string;
  episodeNumber?: number;
  totalEpisodes?: number;
  language?: string;
  clapsCount?: number;
  cast?: CastMember[];
  is18Plus?: boolean;
  isComingSoon?: boolean;
  badge?: string;
}

export interface Paginated<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

export interface HistoryEntry {
  video: Video;
  progress: number;
  watchedAt: string;
}

export type ReportReason =
  | "spam"
  | "inappropriate"
  | "violence"
  | "copyright"
  | "misleading"
  | "other";
