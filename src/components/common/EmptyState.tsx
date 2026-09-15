import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  message,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn("flex flex-col items-center justify-center gap-3 p-10 text-center", className)}
    >
      <span className="grid size-12 place-items-center rounded-2xl bg-secondary">
        <Icon className="size-5 text-muted-foreground" aria-hidden />
      </span>
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      {message ? <p className="max-w-xs text-sm text-muted-foreground">{message}</p> : null}
      {actionLabel && onAction ? (
        <Button variant="secondary" onClick={onAction} className="mt-1 min-h-11 rounded-full px-6">
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
