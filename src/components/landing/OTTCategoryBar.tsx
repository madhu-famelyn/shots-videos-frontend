import { Flame, Clock, Heart, ShieldAlert, Tv, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CategoryTab {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  isRed?: boolean;
}

export const OTT_CATEGORIES: CategoryTab[] = [
  { id: "all", label: "All Categories", icon: <Tv className="size-3.5" /> },
  { id: "trending", label: "🔥 Trending", icon: <Flame className="size-3.5" /> },
  { id: "coming_soon", label: "⏳ Coming Soon", icon: <Clock className="size-3.5" />, badge: "New" },
  { id: "drama", label: "🎭 Drama & Romance", icon: <Heart className="size-3.5" /> },
  { id: "18_plus", label: "🔞 18+ Mature", icon: <ShieldAlert className="size-3.5 text-red-400" />, isRed: true },
  { id: "short_serial", label: "📺 Short Serials", icon: <Tv className="size-3.5" /> },
  { id: "thriller", label: "⚡ Suspense & Thriller", icon: <Zap className="size-3.5" /> },
];

interface OTTCategoryBarProps {
  activeCategory: string;
  onSelectCategory: (id: string) => void;
}

export function OTTCategoryBar({
  activeCategory,
  onSelectCategory,
}: OTTCategoryBarProps) {
  return (
    <div className="sticky top-16 z-30 w-full border-y border-white/5 bg-background/90 backdrop-blur-xl py-3 px-1 my-6">
      <div className="no-scrollbar flex items-center gap-2 overflow-x-auto">
        {OTT_CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={cn(
                "min-h-9 shrink-0 flex items-center gap-1.5 rounded-full px-4 text-xs font-semibold transition cursor-pointer border",
                isActive
                  ? cat.isRed
                    ? "bg-red-600 text-white border-red-500 shadow-lg shadow-red-600/20 font-bold"
                    : "bg-amber-400 text-black border-amber-400 shadow-lg shadow-amber-400/20 font-bold"
                  : cat.isRed
                  ? "border-red-500/30 bg-red-950/20 text-red-300 hover:bg-red-900/30"
                  : "border-white/10 bg-white/5 text-white/80 hover:bg-white/10 hover:border-amber-400/30",
              )}
            >
              {cat.icon}
              <span>{cat.label}</span>
              {cat.badge && (
                <span className="rounded-full bg-blue-500 px-1.5 py-0.2 text-[9px] font-bold text-white uppercase ml-1">
                  {cat.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
