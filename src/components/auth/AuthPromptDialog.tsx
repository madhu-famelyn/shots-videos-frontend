import { useNavigate } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BrandLogo } from "@/components/common/BrandLogo";

interface AuthPromptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action?: string;
}

/** Shown when a guest tries to like, comment or follow — invites them to join. */
export function AuthPromptDialog({
  open,
  onOpenChange,
  action = "do that",
}: AuthPromptDialogProps) {
  const navigate = useNavigate();

  const go = (to: "/login" | "/register") => {
    onOpenChange(false);
    void navigate({ to });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader className="items-center text-center">
          <span className="mb-2 grid size-12 place-items-center rounded-2xl bg-brand/15 text-brand">
            <Sparkles className="size-6" aria-hidden />
          </span>
          <DialogTitle className="font-display text-xl">
            Join Reeltide to {action}
          </DialogTitle>
          <DialogDescription>
            Create a free account to like videos, follow creators and join the
            conversation. It takes less than a minute.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-2 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => go("/register")}
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-brand px-5 text-sm font-semibold text-brand-foreground transition hover:brightness-110"
          >
            Sign up free
          </button>
          <button
            type="button"
            onClick={() => go("/login")}
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-border px-5 text-sm font-medium transition hover:bg-secondary"
          >
            I already have an account
          </button>
        </div>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          You can keep watching without an account.
        </p>
      </DialogContent>
    </Dialog>
  );
}
