import { useEffect, useRef } from "react";
import videojs from "video.js";
import type Player from "video.js/dist/types/player";
import "video.js/dist/video-js.css";

export interface BunnyPlayerProps {
  /** Bunny Stream Library ID (from Bunny Dashboard) */
  libraryId?: string;
  /** Bunny Stream Video GUID */
  videoId?: string;
  /** Direct stream URL (e.g. .m3u8 or .mp4) */
  src?: string;
  /** Video poster / thumbnail image URL */
  poster?: string;
  /** Autoplay video (muted is required for browser autoplay policy) */
  autoplay?: boolean;
  /** Start audio muted */
  muted?: boolean;
  /** Loop playback */
  loop?: boolean;
  /** Show native Video.js controls */
  controls?: boolean;
  /** Bunny Stream token authentication if token security is enabled */
  token?: string;
  /** Custom CSS classes */
  className?: string;
  /** Callbacks */
  onReady?: (player: Player) => void;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
}

/**
 * Builds Bunny Stream HLS Playlist URL
 */
export function getBunnyHlsUrl(libraryId: string, videoId: string, token?: string): string {
  const base = `https://vz-${libraryId}.b-cdn.net/${videoId}/playlist.m3u8`;
  return token ? `${base}?token=${token}` : base;
}

/**
 * Builds Bunny Stream Thumbnail URL
 */
export function getBunnyThumbnailUrl(libraryId: string, videoId: string): string {
  return `https://vz-${libraryId}.b-cdn.net/${videoId}/thumbnail.jpg`;
}

/**
 * Builds Bunny Stream Preview WebP URL
 */
export function getBunnyPreviewUrl(libraryId: string, videoId: string): string {
  return `https://vz-${libraryId}.b-cdn.net/${videoId}/preview.webp`;
}

export default function BunnyPlayer({
  libraryId,
  videoId,
  src,
  poster,
  autoplay = false,
  muted = false,
  loop = false,
  controls = true,
  token,
  className = "",
  onReady,
  onPlay,
  onPause,
  onEnded,
  onTimeUpdate,
}: BunnyPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<Player | null>(null);

  const streamUrl =
    src ||
    (libraryId && videoId ? getBunnyHlsUrl(libraryId, videoId, token) : "");

  const resolvedPoster =
    poster ||
    (libraryId && videoId ? getBunnyThumbnailUrl(libraryId, videoId) : undefined);

  useEffect(() => {
    if (!containerRef.current || !streamUrl) return;

    // Clean up any existing video element inside container
    containerRef.current.innerHTML = "";

    const videoElement = document.createElement("video-js");
    videoElement.classList.add("vjs-big-play-centered", "vjs-theme-dark");
    containerRef.current.appendChild(videoElement);

    const isHls = streamUrl.includes(".m3u8");

    const player = videojs(videoElement, {
      autoplay: autoplay ? (muted ? "muted" : true) : false,
      muted,
      controls,
      loop,
      poster: resolvedPoster,
      fluid: true,
      responsive: true,
      preload: "auto",
      playsinline: true,
      html5: {
        vhs: {
          overrideNative: !videojs.browser.IS_SAFARI,
          enableLowInitialPlaylist: true,
          smoothQualityChange: true,
        },
      },
      sources: [
        {
          src: streamUrl,
          type: isHls ? "application/x-mpegURL" : "video/mp4",
        },
      ],
    });

    playerRef.current = player;

    player.ready(() => {
      onReady?.(player);
    });

    if (onPlay) player.on("play", onPlay);
    if (onPause) player.on("pause", onPause);
    if (onEnded) player.on("ended", onEnded);

    if (onTimeUpdate) {
      player.on("timeupdate", () => {
        onTimeUpdate(player.currentTime() || 0, player.duration() || 0);
      });
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [streamUrl, autoplay, muted, loop, controls, resolvedPoster]);

  return (
    <div
      ref={containerRef}
      className={`bunny-player-container w-full overflow-hidden rounded-2xl ${className}`}
      data-vjs-player
    />
  );
}
