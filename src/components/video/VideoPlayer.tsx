import { Loader2, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import videojs from "video.js";
import type Player from "video.js/dist/types/player";
import "video.js/dist/video-js.css";
import { ErrorState } from "@/components/common/ErrorState";
import { cn } from "@/lib/utils";

export interface VideoPlayerProps {
  videoUrl: string;
  thumbnailUrl: string;
  isActive: boolean;
  muted?: boolean;
  onToggleMute?: () => void;
  onView?: () => void;
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
  className?: string;
  title?: string;
}

/**
 * High-performance Video.js powered player supporting Bunny Stream HLS (.m3u8)
 * adaptive bitrate streaming and standard MP4 sources with custom Reels UI.
 */
export function VideoPlayer({
  videoUrl,
  thumbnailUrl,
  isActive,
  muted = true,
  onToggleMute,
  onView,
  onProgress,
  onComplete,
  className,
  title,
}: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<Player | null>(null);
  const [playing, setPlaying] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [failed, setFailed] = useState(false);
  const [progress, setProgress] = useState(0);
  const viewed = useRef(false);

  // Initialize Video.js Player instance
  useEffect(() => {
    if (!containerRef.current || !videoUrl) return;

    containerRef.current.innerHTML = "";
    const videoEl = document.createElement("video-js");
    videoEl.classList.add("vjs-fill");
    containerRef.current.appendChild(videoEl);

    const isHls = videoUrl.includes(".m3u8");

    const player = videojs(videoEl, {
      autoplay: false,
      controls: false, // We use custom Reels UI overlay
      muted,
      loop: false,
      poster: thumbnailUrl,
      fill: true,
      preload: isActive ? "auto" : "metadata",
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
          src: videoUrl,
          type: isHls ? "application/x-mpegURL" : "video/mp4",
        },
      ],
    });

    playerRef.current = player;

    player.on("play", () => setPlaying(true));
    player.on("pause", () => setPlaying(false));
    player.on("waiting", () => setBuffering(true));
    player.on("playing", () => setBuffering(false));
    player.on("error", () => setFailed(true));

    player.on("timeupdate", () => {
      const dur = player.duration() || 0;
      const cur = player.currentTime() || 0;
      if (dur > 0) {
        const val = cur / dur;
        setProgress(val);
        onProgress?.(val);
      }
    });

    player.on("ended", () => {
      onComplete?.();
      if (playerRef.current && isActive) {
        playerRef.current.currentTime(0);
        playerRef.current.play()?.catch(() => undefined);
      }
    });

    if (isActive) {
      player.ready(() => {
        player.play()?.catch(() => setPlaying(false));
        if (!viewed.current) {
          viewed.current = true;
          onView?.();
        }
      });
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [videoUrl]); // Re-create if URL changes

  // Handle active slide changes in feed
  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    if (isActive) {
      player.play()?.catch(() => setPlaying(false));
      if (!viewed.current) {
        viewed.current = true;
        onView?.();
      }
    } else {
      player.pause();
      player.currentTime(0);
      setProgress(0);
    }
  }, [isActive, onView]);

  // Handle mute changes
  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.muted(muted);
    }
  }, [muted]);

  const togglePlay = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;
    if (player.paused()) {
      player.play()?.catch(() => undefined);
    } else {
      player.pause();
    }
  }, []);

  const retry = () => {
    setFailed(false);
    if (playerRef.current) {
      playerRef.current.src({
        src: videoUrl,
        type: videoUrl.includes(".m3u8") ? "application/x-mpegURL" : "video/mp4",
      });
      playerRef.current.load();
      playerRef.current.play()?.catch(() => undefined);
    }
  };

  if (failed) {
    return (
      <div className={cn("grid place-items-center bg-surface", className)}>
        <ErrorState
          title="Video failed to load"
          message="This clip couldn't be played. Check your connection and try again."
          onRetry={retry}
        />
      </div>
    );
  }

  return (
    <div className={cn("group relative size-full overflow-hidden bg-black", className)}>
      <div
        ref={containerRef}
        className="size-full [&_.video-js]:size-full [&_.vjs-tech]:size-full [&_.vjs-tech]:object-cover"
        onClick={togglePlay}
        aria-label={title ? `Video: ${title}` : "Short video"}
      />

      {/* Play / Pause / Buffering Overlay */}
      <button
        type="button"
        onClick={togglePlay}
        aria-label={playing ? "Pause video" : "Play video"}
        className="absolute inset-0 grid place-items-center focus-visible:bg-black/20"
      >
        {!playing && !buffering ? (
          <span className="grid size-16 place-items-center rounded-full bg-black/45 backdrop-blur-sm shadow-xl transition transform active:scale-95">
            <Play className="size-7 translate-x-0.5 fill-white text-white" aria-hidden />
          </span>
        ) : null}
        {buffering ? (
          <Loader2 className="size-8 animate-spin text-white/90" aria-hidden />
        ) : null}
      </button>

      {/* Mute Toggle Button */}
      <button
        type="button"
        onClick={onToggleMute}
        aria-label={muted ? "Unmute video" : "Mute video"}
        className="absolute top-4 right-4 grid min-h-11 min-w-11 place-items-center rounded-full bg-black/45 text-white backdrop-blur-sm transition hover:bg-black/65 active:scale-90"
      >
        {muted ? <VolumeX className="size-5" aria-hidden /> : <Volume2 className="size-5" aria-hidden />}
      </button>

      {/* Subtle Hover Pause indicator for desktop */}
      {playing ? (
        <span className="pointer-events-none absolute top-4 left-4 hidden rounded-full bg-black/40 p-2 text-white opacity-0 transition group-hover:opacity-100 sm:block">
          <Pause className="size-4" aria-hidden />
        </span>
      ) : null}

      {/* Bottom Progress Bar */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-white/15">
        <div
          className="h-full bg-brand transition-[width] duration-200"
          style={{ width: `${Math.round(progress * 100)}%` }}
        />
      </div>
    </div>
  );
}
