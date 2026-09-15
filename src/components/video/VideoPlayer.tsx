import { Loader2, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
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
 * Source-agnostic player. Plain MP4 today; when the backend switches to HLS
 * (.m3u8) it keeps working wherever the browser plays HLS natively, and the
 * rest of the feed needs no changes.
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
  const ref = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [failed, setFailed] = useState(false);
  const [progress, setProgress] = useState(0);
  const viewed = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (isActive) {
      el.play().catch(() => setPlaying(false));
      if (!viewed.current) {
        viewed.current = true;
        onView?.();
      }
    } else {
      el.pause();
      el.currentTime = 0;
      setProgress(0);
    }
  }, [isActive, onView]);

  useEffect(() => {
    if (ref.current) ref.current.muted = muted;
  }, [muted]);

  const togglePlay = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    if (el.paused) el.play().catch(() => undefined);
    else el.pause();
  }, []);

  const retry = () => {
    setFailed(false);
    ref.current?.load();
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
    <div className={cn("group relative overflow-hidden bg-black", className)}>
      <video
        ref={ref}
        src={videoUrl}
        poster={thumbnailUrl}
        playsInline
        loop={false}
        muted={muted}
        preload={isActive ? "auto" : "none"}
        className="size-full object-cover"
        onClick={togglePlay}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onWaiting={() => setBuffering(true)}
        onPlaying={() => setBuffering(false)}
        onError={() => setFailed(true)}
        onTimeUpdate={(e) => {
          const el = e.currentTarget;
          if (!el.duration) return;
          const value = el.currentTime / el.duration;
          setProgress(value);
          onProgress?.(value);
        }}
        onEnded={() => {
          onComplete?.();
          const el = ref.current;
          if (el && isActive) {
            el.currentTime = 0;
            el.play().catch(() => undefined);
          }
        }}
        aria-label={title ? `Video: ${title}` : "Short video"}
      />

      <button
        type="button"
        onClick={togglePlay}
        aria-label={playing ? "Pause video" : "Play video"}
        className="absolute inset-0 grid place-items-center focus-visible:bg-black/20"
      >
        {!playing && !buffering ? (
          <span className="grid size-16 place-items-center rounded-full bg-black/45 backdrop-blur-sm">
            <Play className="size-7 translate-x-0.5 fill-white text-white" aria-hidden />
          </span>
        ) : null}
        {buffering ? (
          <Loader2 className="size-8 animate-spin text-white/90" aria-hidden />
        ) : null}
      </button>

      <button
        type="button"
        onClick={onToggleMute}
        aria-label={muted ? "Unmute video" : "Mute video"}
        className="absolute top-4 right-4 grid min-h-11 min-w-11 place-items-center rounded-full bg-black/45 text-white backdrop-blur-sm transition hover:bg-black/65"
      >
        {muted ? <VolumeX className="size-5" aria-hidden /> : <Volume2 className="size-5" aria-hidden />}
      </button>

      {playing ? (
        <span className="pointer-events-none absolute top-4 left-4 hidden rounded-full bg-black/40 p-2 text-white opacity-0 transition group-hover:opacity-100 sm:block">
          <Pause className="size-4" aria-hidden />
        </span>
      ) : null}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-white/15">
        <div
          className="h-full bg-brand transition-[width] duration-200"
          style={{ width: `${Math.round(progress * 100)}%` }}
        />
      </div>
    </div>
  );
}
