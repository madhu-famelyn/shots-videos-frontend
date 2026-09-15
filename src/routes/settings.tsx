import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Bell,
  ChevronRight,
  FileText,
  HelpCircle,
  KeyRound,
  LogOut,
  Shield,
  UserCog,
} from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { AuthGate } from "@/components/layout/AuthGate";
import { HelpFeedbackModal } from "@/components/common/HelpFeedbackModal";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useAuthStore } from "@/store/authStore";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Reeltide" },
      { name: "description", content: "Manage your Reeltide account, notifications and privacy." },
      { property: "og:title", content: "Settings — Reeltide" },
      { property: "og:description", content: "Account, notifications and privacy controls." },
    ],
  }),
  component: SettingsPage,
});

function Row({
  icon: Icon,
  label,
  description,
  right,
  to,
}: {
  icon: typeof UserCog;
  label: string;
  description?: string;
  right?: React.ReactNode;
  to?: "/profile" | "/forgot-password";
}) {
  const content = (
    <>
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary">
        <Icon className="size-4" aria-hidden />
      </span>
      <span className="min-w-0 flex-1 text-left">
        <span className="block text-sm font-medium">{label}</span>
        {description ? (
          <span className="block text-xs text-muted-foreground">{description}</span>
        ) : null}
      </span>
      {right ?? <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />}
    </>
  );

  const className =
    "flex min-h-16 w-full items-center gap-3 rounded-2xl bg-card p-3 transition hover:bg-secondary";

  if (to) {
    return (
      <li>
        <Link to={to} className={className}>
          {content}
        </Link>
      </li>
    );
  }
  return <li className={className}>{content}</li>;
}

function SettingsPage() {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const [pushEnabled, setPushEnabled] = useState(true);
  const [privateAccount, setPrivateAccount] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  return (
    <AuthGate>
      <AppShell title="Settings">
        <ul className="space-y-2">
          <Row icon={UserCog} label="Edit profile" description="Name, bio and avatar" to="/profile" />
          <Row
            icon={KeyRound}
            label="Change password"
            description="Send yourself a reset link"
            to="/forgot-password"
          />
          <Row
            icon={Bell}
            label="Notifications"
            description="Likes, comments and new videos"
            right={
              <Switch
                checked={pushEnabled}
                onCheckedChange={setPushEnabled}
                aria-label="Enable notifications"
              />
            }
          />
          <Row
            icon={Shield}
            label="Private account"
            description="Only approved followers see your videos"
            right={
              <Switch
                checked={privateAccount}
                onCheckedChange={setPrivateAccount}
                aria-label="Private account"
              />
            }
          />
          <li>
            <button
              type="button"
              onClick={() => setHelpOpen(true)}
              className="flex min-h-16 w-full items-center gap-3 rounded-2xl bg-card p-3 transition hover:bg-secondary text-left cursor-pointer"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-amber-500/10 text-amber-400">
                <HelpCircle className="size-4" aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium">Help & Feedback</span>
                <span className="block text-xs text-muted-foreground">FAQ, suggestions & issue reporting</span>
              </span>
              <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
            </button>
          </li>
          <Row icon={FileText} label="Terms of service" />
          <Row icon={FileText} label="Privacy policy" />
        </ul>

        <Button
          variant="ghost"
          className="mt-6 min-h-12 w-full rounded-full text-destructive"
          onClick={async () => {
            await logout();
            void navigate({ to: "/login", replace: true });
          }}
        >
          <LogOut className="mr-2 size-4" aria-hidden />
          Log out
        </Button>
      </AppShell>
      <HelpFeedbackModal isOpen={helpOpen} onClose={() => setHelpOpen(false)} />
    </AuthGate>
  );
}
