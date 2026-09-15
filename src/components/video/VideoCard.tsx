import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { AuthPromptDialog } from "@/components/auth/AuthPromptDialog";
import { CommentPanel } from "@/components/comments/CommentPanel";
import { VideoActions } from "@/components/video/VideoActions";
import { VideoOverlay } from "@/components/video/VideoOverlay";
import { VideoPlayer } from "@/components/video/VideoPlayer";
import { useAuth } from "@/hooks/useAuth";
import { useVideoAnalytics } from "@/hooks/useVideoPlayer";
import { userApi } from "@/services/api/userApi";
import { videoApi } from "@/services/api/videoApi";
import { useUserStore } from "@/store/userStore";
import { useVideoStore } from "@/store/videoStore";
import type { Video } from "@/types/video";

interface VideoCardProps {
  video: Video;
  isActive: boolean;
}

export function VideoCard({ video, isActive }: VideoCardProps) {
  const muted = useVideoStore((s) => s.muted);
  const toggleMuted = useVideoStore((s) => s.toggleMuted);
  const patchVideo = useVideoStore((s) => s.patchVideo);
  const setFollowing = useUserStore((s) => s.setFollowing);
  const { isAuthenticated } = useAuth();
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [authPrompt, setAuthPrompt] = useState<string | null>(null);
  const likePending = useRef(false);
  const followPending = useRef(false);
  const { onProgress, onComplete } = useVideoAnalytics(video.id);

  const toggleLike = useCallback(async () => {
    if (!isAuthenticated) {
      setAuthPrompt("like this video");
      return;
    }
    if (likePending.current) return;
    likePending.current = true;
    const next = !video.isLiked;
    patchVideo(video.id, { isLiked: next, likes: video.likes + (next ? 1 : -1) });
    try {
      if (next) await videoApi.like(video.id);
      else await videoApi.unlike(video.id);
    } catch {
      patchVideo(video.id, { isLiked: !next, likes: video.likes });
      toast.error("Couldn't update your like");
    } finally {
      likePending.current = false;
    }
  }, [isAuthenticated, patchVideo, video.id, video.isLiked, video.likes]);

  const toggleFollow = useCallback(async () => {
    if (!isAuthenticated) {
      setAuthPrompt("follow this creator");
      return;
    }
    if (followPending.current) return;
    followPending.current = true;
    const next = !video.isFollowing;
    patchVideo(video.id, { isFollowing: next });
    setFollowing(video.creator.id, next);
    try {
      if (next) await userApi.follow(video.creator.id);
      else await userApi.unfollow(video.creator.id);
    } catch {
      patchVideo(video.id, { isFollowing: !next });
      setFollowing(video.creator.id, !next);
      toast.error("Couldn't update follow");
    } finally {
      followPending.current = false;
    }
  }, [isAuthenticated, patchVideo, setFollowing, video.creator.id, video.id, video.isFollowing]);

  const openComments = useCallback(() => {
    if (!isAuthenticated) {
      setAuthPrompt("join the comments");
      return;
    }
    setCommentsOpen(true);
  }, [isAuthenticated]);

  return (
    <div className="relative mx-auto h-full w-full overflow-hidden bg-black md:aspect-[9/16] md:h-full md:w-auto md:rounded-3xl md:shadow-2xl md:shadow-black/60">
      <VideoPlayer
        videoUrl={video.videoUrl}
        thumbnailUrl={video.thumbnailUrl}
        isActive={isActive}
        muted={muted}
        onToggleMute={toggleMuted}
        onProgress={onProgress}
        onComplete={onComplete}
        title={video.title}
        className="size-full"
      />

      <VideoOverlay video={video} onFollow={() => void toggleFollow()} />

      <VideoActions
        video={video}
        onLike={() => void toggleLike()}
        onComments={openComments}
        className="absolute right-3 bottom-28"
      />

      <CommentPanel
        videoId={video.id}
        open={commentsOpen}
        onOpenChange={setCommentsOpen}
        commentCount={video.comments}
      />

      <AuthPromptDialog
        open={authPrompt !== null}
        onOpenChange={(open) => !open && setAuthPrompt(null)}
        action={authPrompt ?? "do that"}
      />
    </div>
  );
}
