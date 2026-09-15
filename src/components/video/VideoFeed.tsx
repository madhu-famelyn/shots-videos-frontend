import { useEffect } from "react";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { Loading } from "@/components/common/Loading";
import { CategoryBar } from "@/components/video/CategoryBar";
import { VideoCard } from "@/components/video/VideoCard";
import { useActiveItem } from "@/hooks/useVideoPlayer";
import { useInfiniteFeed } from "@/hooks/useInfiniteFeed";
import { useVideoStore } from "@/store/videoStore";

/** How many neighbours around the active clip stay mounted. */
const WINDOW = 1;

export function VideoFeed() {
  const { feed, hasMore, loading, error, loadMore, retry } = useInfiniteFeed();
  const setCurrentVideo = useVideoStore((s) => s.setCurrentVideo);
  const { activeIndex, containerRef, setItemRef, itemRefs } = useActiveItem(feed.length);

  useEffect(() => {
    const current = feed[activeIndex];
    if (current) setCurrentVideo(current.id);
    // Prefetch the next page as the viewer nears the end of the loaded list.
    if (hasMore && !loading && activeIndex >= feed.length - 2) void loadMore();
  }, [activeIndex, feed, hasMore, loading, loadMore, setCurrentVideo]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
      const target = e.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA"].includes(target.tagName)) return;
      const next = activeIndex + (e.key === "ArrowDown" ? 1 : -1);
      const el = itemRefs.current[next];
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIndex, itemRefs]);

  if (error && feed.length === 0) {
    return (
      <div className="grid h-full place-items-center">
        <ErrorState title="Feed unavailable" message={error} onRetry={retry} />
      </div>
    );
  }

  if (loading && feed.length === 0) {
    return (
      <div className="grid h-full place-items-center">
        <Loading label="Loading your feed" />
      </div>
    );
  }

  if (!loading && feed.length === 0) {
    return (
      <div className="grid h-full place-items-center">
        <EmptyState
          title="No videos available"
          message="Try another category — new clips arrive all the time."
        />
      </div>
    );
  }

  return (
    <div className="relative h-full">
      <CategoryBar />
      <div
        ref={containerRef}
        tabIndex={0}
        aria-label="Video feed. Use arrow keys to move between videos."
        className="no-scrollbar h-full snap-y snap-mandatory overflow-y-scroll overscroll-y-contain focus:outline-none"
      >
        {feed.map((video, index) => {
          const mounted = Math.abs(index - activeIndex) <= WINDOW;
          return (
            <section
              key={video.id}
              data-index={index}
              ref={setItemRef(index)}
              className="flex h-full w-full snap-start snap-always items-center justify-center py-0 md:py-6"
            >
              {mounted ? (
                <VideoCard video={video} isActive={index === activeIndex} />
              ) : (
                <div
                  className="h-full w-full bg-cover bg-center md:aspect-[9/16] md:h-full md:w-auto md:rounded-3xl"
                  style={{ backgroundImage: `url(${video.thumbnailUrl})` }}
                  aria-hidden
                />
              )}
            </section>
          );
        })}
        {loading && feed.length > 0 ? (
          <div className="py-6">
            <Loading label="Loading more" />
          </div>
        ) : null}
      </div>
    </div>
  );
}
