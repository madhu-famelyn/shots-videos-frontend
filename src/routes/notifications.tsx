import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Bell } from "lucide-react";
import { Avatar } from "@/components/common/Avatar";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { Loading } from "@/components/common/Loading";
import { AppShell } from "@/components/layout/AppShell";
import { AuthGate } from "@/components/layout/AuthGate";
import { formatRelativeTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import { notificationApi } from "@/services/api/notificationApi";
import type { AppNotification } from "@/types/notification";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — Reeltide" },
      { name: "description", content: "Likes, comments, follows and new videos from creators you follow." },
      { property: "og:title", content: "Notifications — Reeltide" },
      { property: "og:description", content: "Your Reeltide activity in one place." },
    ],
  }),
  component: NotificationsPage,
});

function NotificationsPage() {
  const qc = useQueryClient();
  const query = useQuery({ queryKey: ["notifications"], queryFn: () => notificationApi.list() });

  const markRead = useMutation({
    mutationFn: (id: string) => notificationApi.markRead(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ["notifications"] });
      const prev = qc.getQueryData<AppNotification[]>(["notifications"]);
      qc.setQueryData<AppNotification[]>(["notifications"], (list) =>
        (list ?? []).map((n) => (n.id === id ? { ...n, isRead: true } : n)),
      );
      return { prev };
    },
    onError: (_e, _id, ctx) => {
      if (ctx?.prev) qc.setQueryData(["notifications"], ctx.prev);
    },
  });

  return (
    <AuthGate>
      <AppShell title="Notifications">
        {query.isLoading ? <Loading label="Loading notifications" /> : null}
        {query.isError ? (
          <ErrorState
            message={(query.error as Error).message}
            onRetry={() => void query.refetch()}
          />
        ) : null}
        {query.data && query.data.length === 0 ? (
          <EmptyState icon={Bell} title="Nothing new" message="Activity will show up here." />
        ) : null}

        <ul className="space-y-2">
          {query.data?.map((n) => (
            <li key={n.id}>
              <button
                type="button"
                onClick={() => !n.isRead && markRead.mutate(n.id)}
                className={cn(
                  "flex w-full min-h-16 items-center gap-3 rounded-2xl p-3 text-left transition hover:bg-secondary",
                  n.isRead ? "bg-card/50" : "bg-card ring-1 ring-brand/40",
                )}
              >
                <Avatar src={n.actor.avatar} name={n.actor.name} />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm">
                    <span className="font-semibold">{n.actor.name}</span> {n.text}
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    {formatRelativeTime(n.createdAt)}
                  </span>
                </span>
                {!n.isRead ? (
                  <span className="size-2 shrink-0 rounded-full bg-brand" aria-label="Unread" />
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      </AppShell>
    </AuthGate>
  );
}
