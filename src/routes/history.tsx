import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { History as HistoryIcon } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { Loading } from "@/components/common/Loading";
import { AppShell } from "@/components/layout/AppShell";
import { AuthGate } from "@/components/layout/AuthGate";
import { formatRelativeTime } from "@/lib/format";
import { userApi } from "@/services/api/userApi";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Watch history — Reeltide" },
      { name: "description", content: "Every short video you watched, with your progress saved." },
      { property: "og:title", content: "Watch history — Reeltide" },
      { property: "og:description", content: "Pick up where you left off." },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const query = useQuery({ queryKey: ["history"], queryFn: () => userApi.history() });

  return (
    <AuthGate>
      <AppShell title="Watch history">
        {query.isLoading ? <Loading label="Loading history" /> : null}
        {query.isError ? (
          <ErrorState message={(query.error as Error).message} onRetry={() => void query.refetch()} />
        ) : null}
        {query.data && query.data.length === 0 ? (
          <EmptyState
            icon={HistoryIcon}
            title="No watch history yet"
            message="Videos you watch will appear here with your progress."
          />
        ) : null}

        <ul className="space-y-3">
          {query.data?.map((entry) => (
            <li key={entry.video.id}>
              <Link
                to="/video/$id"
                params={{ id: entry.video.id }}
                className="flex gap-3 rounded-2xl bg-card p-3 transition hover:bg-secondary"
              >
                <img
                  src={entry.video.thumbnailUrl}
                  alt=""
                  loading="lazy"
                  className="h-24 w-16 shrink-0 rounded-xl object-cover"
                />
                <span className="flex min-w-0 flex-1 flex-col justify-center gap-1">
                  <span className="truncate text-sm font-semibold">{entry.video.title}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {entry.video.creator.name} · {formatRelativeTime(entry.watchedAt)}
                  </span>
                  <span className="mt-1 block h-1 w-full overflow-hidden rounded-full bg-secondary">
                    <span
                      className="block h-full rounded-full bg-brand"
                      style={{ width: `${Math.round(entry.progress * 100)}%` }}
                    />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </AppShell>
    </AuthGate>
  );
}
