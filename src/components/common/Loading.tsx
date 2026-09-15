import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function Loading({ label = "Loading", className }: { label?: string; className?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn("flex flex-col items-center justify-center gap-3 p-10 text-center", className)}
    >
      <Loader2 className="size-6 animate-spin text-brand" aria-hidden />
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  );
}
