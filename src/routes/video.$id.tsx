import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { ErrorState } from "@/components/common/ErrorState";
import { Loading } from "@/components/common/Loading";
import { AppShell } from "@/components/layout/AppShell";
import { VideoCard } from "@/components/video/VideoCard";
import { useVideo } from "@/hooks/useVideos";

export const Route = createFileRoute("/video/$id")({
  head: () => ({
    meta: [
      { title: "Watch a short video — Reeltide" },
      { name: "description", content: "Watch this short video on Reeltide, like, comment and share." },
      { property: "og:title", content: "Watch a short video — Reeltide" },
      { property: "og:description", content: "Watch, like, comment and share on Reeltide." },
    ],
  }),
  component: VideoDetailPage,
});

function VideoDetailPage() {
  const { id } = Route.useParams();
  const { data, isLoading, isError, error, refetch } = useVideo(id);

  return (
    <AppShell immersive>
      <div className="relative h-full">
          <Link
            to="/feed"
            aria-label="Back to feed"
            className="absolute top-4 left-4 z-20 grid min-h-11 min-w-11 place-items-center rounded-full bg-black/50 text-white backdrop-blur-sm"
          >
            <ArrowLeft className="size-5" aria-hidden />
          </Link>

          {isLoading ? (
            <div className="grid h-full place-items-center">
              <Loading label="Loading video" />
            </div>
          ) : isError || !data ? (
            <div className="grid h-full place-items-center">
              <ErrorState
                title="Video unavailable"
                message={(error as Error)?.message}
                onRetry={() => void refetch()}
              />
            </div>
          ) : (
            <div className="flex h-full items-center justify-center py-0 md:py-6">
              <VideoCard video={data} isActive />
            </div>
          )}
        </div>
      </AppShell>
  );
}
