import type { AuthResponse } from "@/types/auth";
import type { Comment } from "@/types/comment";
import type { Creator, UserProfile } from "@/types/user";
import type { CastMember, Episode, HistoryEntry, Show, Video } from "@/types/video";

export function transformCastMember(raw: any): CastMember {
  return {
    name: raw?.name ?? "",
    role: raw?.role ?? "",
    avatar: raw?.avatar ?? "",
  };
}

export function transformEpisode(raw: any): Episode {
  return {
    id: raw?.id ?? "",
    episodeNumber: raw?.episodeNumber ?? raw?.episode_number ?? 1,
    title: raw?.title ?? "",
    duration: raw?.duration ?? 0,
    thumbnailUrl: raw?.thumbnailUrl ?? raw?.thumbnail_url ?? "",
    videoUrl: raw?.videoUrl ?? raw?.video_url ?? "",
    views: raw?.views ?? 0,
    claps: raw?.claps ?? 0,
  };
}

export function transformShow(raw: any): Show {
  return {
    id: raw?.id ?? "",
    title: raw?.title ?? "",
    synopsis: raw?.synopsis ?? "",
    coverImage: raw?.coverImage ?? raw?.cover_image ?? "",
    genre: raw?.genre ?? "",
    language: raw?.language ?? "भोजपुरी",
    rating: raw?.rating ?? 4.8,
    totalEpisodes: raw?.totalEpisodes ?? raw?.total_episodes ?? 1,
    director: raw?.director ?? "",
    cast: Array.isArray(raw?.cast) ? raw.cast.map(transformCastMember) : [],
    episodes: Array.isArray(raw?.episodes) ? raw.episodes.map(transformEpisode) : [],
    featured: Boolean(raw?.featured),
    is18Plus: Boolean(raw?.is18Plus ?? raw?.is_18_plus),
    isComingSoon: Boolean(raw?.isComingSoon ?? raw?.is_coming_soon),
    releaseDate: raw?.releaseDate ?? raw?.release_date ?? undefined,
    sectionCategory: raw?.sectionCategory ?? raw?.section_category ?? "trending",
    badge: raw?.badge ?? undefined,
  };
}

export function transformCreator(raw: any): Creator {
  return {
    id: raw?.id ?? "",
    name: raw?.name ?? "Bhojpuri Creator",
    username: raw?.username ?? "creator",
    avatar: raw?.avatar ?? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    followers: raw?.followers ?? 0,
    isFollowing: Boolean(raw?.isFollowing ?? raw?.is_following),
  };
}

export function transformUserProfile(raw: any): UserProfile {
  return {
    id: raw?.id ?? "",
    name: raw?.name ?? "Bhojpuri Viewer",
    username: raw?.username ?? "viewer",
    avatar: raw?.avatar ?? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    followers: raw?.followers ?? 0,
    isFollowing: Boolean(raw?.isFollowing ?? raw?.is_following),
    email: raw?.email ?? "viewer@echoreels.in",
    bio: raw?.bio ?? "Dil Se Bhojpuri • 2-Min Micro-Drama Fan",
    following: raw?.following ?? 0,
    totalLikes: raw?.totalLikes ?? raw?.total_likes ?? 0,
  };
}

export function transformVideo(raw: any): Video {
  return {
    id: raw?.id ?? "",
    title: raw?.title ?? "",
    description: raw?.description ?? "",
    videoUrl: raw?.videoUrl ?? raw?.video_url ?? "",
    thumbnailUrl: raw?.thumbnailUrl ?? raw?.thumbnail_url ?? "",
    duration: raw?.duration ?? 120,
    views: raw?.views ?? 0,
    likes: raw?.likes ?? 0,
    comments: raw?.comments ?? raw?.comments_count ?? 0,
    isLiked: Boolean(raw?.isLiked ?? raw?.is_liked),
    isFollowing: Boolean(raw?.isFollowing ?? raw?.is_following),
    creator: transformCreator(raw?.creator),
    category: raw?.category ?? { id: "trending", name: "Trending", slug: "trending" },
    createdAt: raw?.createdAt ?? raw?.created_at ?? new Date().toISOString(),
    seriesId: raw?.seriesId ?? raw?.series_id ?? undefined,
    seriesTitle: raw?.seriesTitle ?? raw?.series_title ?? undefined,
    episodeNumber: raw?.episodeNumber ?? raw?.episode_number ?? undefined,
    totalEpisodes: raw?.totalEpisodes ?? raw?.total_episodes ?? undefined,
    language: raw?.language ?? "भोजपुरी",
    clapsCount: raw?.clapsCount ?? raw?.claps_count ?? 0,
    cast: Array.isArray(raw?.cast) ? raw.cast.map(transformCastMember) : [],
    is18Plus: Boolean(raw?.is18Plus ?? raw?.is_18_plus),
    isComingSoon: Boolean(raw?.isComingSoon ?? raw?.is_coming_soon),
    badge: raw?.badge ?? undefined,
  };
}

export function transformAuthResponse(raw: any): AuthResponse {
  return {
    accessToken: raw?.accessToken ?? raw?.access_token ?? "",
    user: transformUserProfile(raw?.user),
  };
}

export function transformComment(raw: any): Comment {
  return {
    id: raw?.id ?? "",
    videoId: raw?.videoId ?? raw?.video_id ?? "",
    user: transformCreator(raw?.user),
    text: raw?.text ?? "",
    likes: raw?.likes ?? 0,
    isLiked: Boolean(raw?.isLiked ?? raw?.is_liked),
    isOwn: Boolean(raw?.isOwn ?? raw?.is_own),
    createdAt: raw?.createdAt ?? raw?.created_at ?? new Date().toISOString(),
  };
}

export function transformHistoryEntry(raw: any): HistoryEntry {
  return {
    video: transformVideo(raw?.video),
    progress: raw?.progress ?? 0,
    watchedAt: raw?.watchedAt ?? raw?.watched_at ?? new Date().toISOString(),
  };
}
