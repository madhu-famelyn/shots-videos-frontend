import { cn } from "@/lib/utils";

/** Original wordmark for the app: a stacked-reel glyph plus the name. */
export function BrandLogo({
  className,
  showName = true,
}: {
  className?: string;
  showName?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span
        aria-hidden
        className="grid size-8 place-items-center rounded-xl bg-gradient-to-br from-brand to-ember"
      >
        <span className="block h-3.5 w-1 rounded-full bg-brand-foreground" />
      </span>
      {showName ? (
        <span className="font-display text-xl font-extrabold tracking-tight text-white">
          Echo <span className="text-amber-400">Reels</span>
        </span>
      ) : null}
      <span className="sr-only">Echo Reels</span>
    </span>
  );
}
