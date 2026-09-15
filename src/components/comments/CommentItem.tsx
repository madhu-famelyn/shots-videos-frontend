import { Heart, Trash2 } from "lucide-react";
import { useState } from "react";
import { Avatar } from "@/components/common/Avatar";
import { formatCount, formatRelativeTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Comment } from "@/types/comment";

export function CommentItem({
  comment,
  onDelete,
}: {
  comment: Comment;
  onDelete: (id: string) => void;
}) {
  const [liked, setLiked] = useState(comment.isLiked);
  const [likes, setLikes] = useState(comment.likes);

  const toggleLike = () => {
    setLiked((v) => !v);
    setLikes((n) => n + (liked ? -1 : 1));
  };

  return (
    <li className="flex gap-3 py-3">
      <Avatar src={comment.user.avatar} name={comment.user.name} size="sm" />
      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-center gap-2">
          <span className="truncate text-sm font-semibold text-foreground">
            {comment.user.name}
          </span>
          <span className="shrink-0 text-xs text-muted-foreground">
            {formatRelativeTime(comment.createdAt)}
          </span>
        </div>
        <p className="mt-0.5 text-sm break-words text-foreground/90">{comment.text}</p>
        <div className="mt-1 flex items-center gap-4">
          <button
            type="button"
            className="text-xs text-muted-foreground transition hover:text-foreground"
          >
            Reply
          </button>
          {comment.isOwn ? (
            <button
              type="button"
              onClick={() => onDelete(comment.id)}
              aria-label="Delete your comment"
              className="inline-flex items-center gap-1 text-xs text-muted-foreground transition hover:text-destructive"
            >
              <Trash2 className="size-3.5" aria-hidden />
              Delete
            </button>
          ) : null}
        </div>
      </div>
      <button
        type="button"
        onClick={toggleLike}
        aria-label={liked ? "Unlike comment" : "Like comment"}
        className="flex shrink-0 flex-col items-center gap-1 self-start pt-1 text-muted-foreground"
      >
        <Heart className={cn("size-4", liked && "fill-ember text-ember")} aria-hidden />
        <span className="text-[11px]">{formatCount(likes)}</span>
      </button>
    </li>
  );
}
