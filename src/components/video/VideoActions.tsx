import { Heart, MessageCircle, MoreHorizontal, Share2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ReportDialog } from "@/components/video/ReportDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatCount } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Video } from "@/types/video";

interface VideoActionsProps {
  video: Video;
  onLike: () => void;
  onComments: () => void;
  className?: string;
}

function ActionButton({
  label,
  count,
  active,
  onClick,
  children,
}: {
  label: string;
  count?: number;
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex flex-col items-center gap-1 text-white"
    >
      <span
        className={cn(
          "grid min-h-12 min-w-12 place-items-center rounded-full bg-black/40 backdrop-blur-sm transition hover:bg-black/60 active:scale-90",
          active && "bg-ember/90 hover:bg-ember",
        )}
      >
        {children}
      </span>
      {count !== undefined ? (
        <span className="text-xs font-semibold drop-shadow">{formatCount(count)}</span>
      ) : null}
    </button>
  );
}

export function VideoActions({ video, onLike, onComments, className }: VideoActionsProps) {
  const [reportOpen, setReportOpen] = useState(false);

  const share = async () => {
    const url = `${window.location.origin}/video/${video.id}`;
    const data = { title: video.title, text: video.title, url };
    if (navigator.share) {
      try {
        await navigator.share(data);
        return;
      } catch {
        /* user dismissed — fall through to copy */
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard");
    } catch {
      toast.error("Couldn't copy the link");
    }
  };

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <ActionButton
        label={video.isLiked ? "Unlike video" : "Like video"}
        count={video.likes}
        active={video.isLiked}
        onClick={onLike}
      >
        <Heart className={cn("size-6", video.isLiked && "fill-white")} aria-hidden />
      </ActionButton>

      <ActionButton label="Open comments" count={video.comments} onClick={onComments}>
        <MessageCircle className="size-6" aria-hidden />
      </ActionButton>

      <ActionButton label="Share video" onClick={() => void share()}>
        <Share2 className="size-6" aria-hidden />
      </ActionButton>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label="More options"
            className="grid min-h-12 min-w-12 place-items-center rounded-full bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/60"
          >
            <MoreHorizontal className="size-6" aria-hidden />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => void share()}>Copy link</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setReportOpen(true)}>Report video</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ReportDialog videoId={video.id} open={reportOpen} onOpenChange={setReportOpen} />
    </div>
  );
}
