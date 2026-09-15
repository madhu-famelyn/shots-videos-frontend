import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load this right now.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn("flex flex-col items-center justify-center gap-3 p-10 text-center", className)}
    >
      <AlertTriangle className="size-7 text-destructive" aria-hidden />
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      <p className="max-w-xs text-sm text-muted-foreground">{message}</p>
      {onRetry ? (
        <Button onClick={onRetry} className="mt-1 min-h-11 rounded-full px-6">
          Try again
        </Button>
      ) : null}
    </div>
  );
}
