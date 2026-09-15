import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";

interface LanguageSelectorProps {
  className?: string;
}

export function LanguageSelector({ className }: LanguageSelectorProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 sm:gap-1.5 rounded-full border border-amber-400/40 bg-black/60 px-2.5 py-1 sm:px-3 sm:py-1.5 text-[11px] sm:text-xs font-bold text-white shadow-sm backdrop-blur-md select-none shrink-0",
        className,
      )}
    >
      <Globe className="size-3 sm:size-3.5 text-amber-400 shrink-0" />
      <span className="text-amber-300 font-bold">Bhojpuri</span>
    </div>
  );
}
