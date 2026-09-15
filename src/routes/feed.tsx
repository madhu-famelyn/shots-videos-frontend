import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { VideoFeed } from "@/components/video/VideoFeed";

export const Route = createFileRoute("/feed")({
  head: () => ({
    meta: [
      { title: "Feed — Reeltide" },
      {
        name: "description",
        content:
          "Watch short vertical videos on Reeltide: swipe the feed, follow creators, comment and save your watch history.",
      },
      { property: "og:title", content: "Feed — Reeltide" },
      {
        property: "og:description",
        content: "Swipe an endless tide of short videos on phone, tablet and desktop.",
      },
    ],
  }),
  component: FeedPage,
});

function FeedPage() {
  return (
    <AppShell immersive>
      <VideoFeed />
    </AppShell>
  );
}
