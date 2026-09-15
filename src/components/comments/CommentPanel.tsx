import { MessageCircle } from "lucide-react";
import { CommentInput } from "@/components/comments/CommentInput";
import { CommentItem } from "@/components/comments/CommentItem";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { Loading } from "@/components/common/Loading";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useComments } from "@/hooks/useComments";
import { useIsMobile } from "@/hooks/use-mobile";

interface CommentPanelProps {
  videoId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  commentCount: number;
}

/** Bottom sheet on touch screens, side panel on desktop. */
export function CommentPanel({ videoId, open, onOpenChange, commentCount }: CommentPanelProps) {
  const isMobile = useIsMobile();
  const { data, isLoading, isError, error, refetch, add, remove } = useComments(videoId, open);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={isMobile ? "bottom" : "right"}
        className="flex h-[80vh] flex-col gap-0 rounded-t-3xl p-0 sm:h-full sm:max-w-md sm:rounded-none"
      >
        <SheetHeader className="border-b border-border p-4">
          <SheetTitle className="font-display">
            Comments <span className="text-muted-foreground">({commentCount})</span>
          </SheetTitle>
        </SheetHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-4">
          {isLoading ? <Loading label="Loading comments" /> : null}
          {isError ? (
            <ErrorState message={(error as Error)?.message} onRetry={() => void refetch()} />
          ) : null}
          {!isLoading && !isError && (data?.length ?? 0) === 0 ? (
            <EmptyState
              icon={MessageCircle}
              title="No comments yet"
              message="Be the first to say something."
            />
          ) : null}
          <ul className="divide-y divide-border">
            {data?.map((c) => (
              <CommentItem key={c.id} comment={c} onDelete={(id) => remove.mutate(id)} />
            ))}
          </ul>
        </div>

        <CommentInput onSubmit={(text) => add.mutate(text)} pending={add.isPending} />
      </SheetContent>
    </Sheet>
  );
}
