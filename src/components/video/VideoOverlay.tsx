import { Link } from "@tanstack/react-router";
import { Avatar } from "@/components/common/Avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Video } from "@/types/video";

interface VideoOverlayProps {
  video: Video;
  onFollow: () => void;
  className?: string;
}

export function VideoOverlay({ video, onFollow, className }: VideoOverlayProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent px-4 pt-16 pb-6",
        className,
      )}
    >
      <div className="pointer-events-auto flex min-w-0 flex-col gap-3 pr-20">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar src={video.creator.avatar} name={video.creator.name} size="md" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">{video.creator.name}</p>
            <p className="truncate text-xs text-white/70">@{video.creator.username}</p>
          </div>
          <Button
            onClick={onFollow}
            variant={video.isFollowing ? "secondary" : "default"}
            className="ml-auto min-h-9 shrink-0 rounded-full px-4 text-xs font-semibold"
          >
            {video.isFollowing ? "Following" : "Follow"}
          </Button>
        </div>

        <div className="min-w-0">
          <h2 className="truncate font-display text-base font-bold text-white">{video.title}</h2>
          <p className="line-clamp-2 text-sm text-white/80">{video.description}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/search"
            search={{ q: video.category.name }}
            className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm transition hover:bg-white/25"
          >
            #{video.category.name}
          </Link>
          <span className="text-xs text-white/60">{video.views.toLocaleString()} views</span>
        </div>
      </div>
    </div>
  );
}
