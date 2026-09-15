import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { HelpCircle, Settings } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Avatar } from "@/components/common/Avatar";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { Loading } from "@/components/common/Loading";
import { HelpFeedbackModal } from "@/components/common/HelpFeedbackModal";
import { AppShell } from "@/components/layout/AppShell";
import { AuthGate } from "@/components/layout/AuthGate";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatCount } from "@/lib/format";
import { userApi } from "@/services/api/userApi";
import { useAuthStore } from "@/store/authStore";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Your profile — Reeltide" },
      { name: "description", content: "Your Reeltide profile, videos, followers and likes." },
      { property: "og:title", content: "Your profile — Reeltide" },
      { property: "og:description", content: "Manage your Reeltide profile and videos." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const setUser = useAuthStore((s) => s.setUser);

  const profile = useQuery({ queryKey: ["me"], queryFn: () => userApi.me() });
  const videos = useQuery({ queryKey: ["my-videos"], queryFn: () => userApi.myVideos() });

  const [open, setOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");

  const save = useMutation({
    mutationFn: () => userApi.updateMe({ name, bio }),
    onSuccess: (updated) => {
      setUser(updated);
      qc.setQueryData(["me"], updated);
      setOpen(false);
      toast.success("Profile updated");
    },
    onError: (e) => toast.error((e as Error).message),
  });

  if (profile.isLoading) {
    return (
      <AuthGate>
        <AppShell title="Profile">
          <Loading label="Loading profile" />
        </AppShell>
      </AuthGate>
    );
  }

  if (profile.isError || !profile.data) {
    return (
      <AuthGate>
        <AppShell title="Profile">
          <ErrorState onRetry={() => void profile.refetch()} />
        </AppShell>
      </AuthGate>
    );
  }

  const me = profile.data;
  const stats = [
    { label: "Followers", value: me.followers },
    { label: "Following", value: me.following },
    { label: "Likes", value: me.totalLikes },
  ];

  return (
    <AuthGate>
      <AppShell>
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:items-center sm:gap-6">
          <div className="flex min-w-0 items-center gap-4">
            <Avatar src={me.avatar} name={me.name} size="xl" ring />
            <div className="min-w-0">
              <h1 className="truncate font-display text-xl font-bold sm:text-2xl">{me.name}</h1>
              <p className="truncate text-sm text-muted-foreground">@{me.username}</p>
            </div>
          </div>
          <Link
            to="/settings"
            aria-label="Settings"
            className="grid min-h-11 min-w-11 shrink-0 place-items-center rounded-full bg-secondary"
          >
            <Settings className="size-5" aria-hidden />
          </Link>
        </header>

        <p className="mt-4 max-w-prose text-sm text-foreground/85">{me.bio}</p>

        <dl className="mt-5 grid grid-cols-3 gap-3">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl bg-card p-4 text-center">
              <dt className="text-xs text-muted-foreground">{s.label}</dt>
              <dd className="font-display text-lg font-bold">{formatCount(s.value)}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-5 flex flex-wrap gap-2">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                className="min-h-11 rounded-full px-6"
                onClick={() => {
                  setName(me.name);
                  setBio(me.bio);
                }}
              >
                Edit profile
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="profile-name">Name</Label>
                  <Input
                    id="profile-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="min-h-11 rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="profile-bio">Bio</Label>
                  <Textarea
                    id="profile-bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="min-h-24 rounded-xl"
                  />
                </div>
                <Button
                  onClick={() => save.mutate()}
                  disabled={save.isPending}
                  className="min-h-11 w-full rounded-full"
                >
                  {save.isPending ? "Saving…" : "Save changes"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button asChild variant="secondary" className="min-h-11 rounded-full px-6">
            <Link to="/history">Watch history</Link>
          </Button>
          <Button
            variant="secondary"
            className="min-h-11 rounded-full px-6 flex items-center gap-1.5"
            onClick={() => setHelpOpen(true)}
          >
            <HelpCircle className="size-4 text-amber-400" />
            <span>Help & Feedback</span>
          </Button>
          <Button
            variant="ghost"
            className="min-h-11 rounded-full px-6 text-destructive"
            onClick={async () => {
              await logout();
              void navigate({ to: "/login", replace: true });
            }}
          >
            Log out
          </Button>
        </div>

        <section className="mt-8">
          <h2 className="mb-3 text-sm font-semibold">Your videos</h2>
          {videos.isLoading ? <Loading label="Loading videos" /> : null}
          {videos.data && videos.data.length === 0 ? (
            <EmptyState title="No videos yet" message="Videos you post will show up here." />
          ) : null}
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {videos.data?.map((v) => (
              <li key={v.id}>
                <Link
                  to="/video/$id"
                  params={{ id: v.id }}
                  className="group block overflow-hidden rounded-2xl bg-card"
                >
                  <img
                    src={v.thumbnailUrl}
                    alt=""
                    loading="lazy"
                    className="aspect-[9/16] w-full object-cover transition group-hover:opacity-90"
                  />
                  <span className="block truncate p-2 text-xs font-medium">{v.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </AppShell>
      <HelpFeedbackModal isOpen={helpOpen} onClose={() => setHelpOpen(false)} />
    </AuthGate>
  );
}
