import { useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Play, Star, Clock, AlertTriangle, LayoutGrid, Rows } from "lucide-react";
import type { Show } from "@/types/video";
import { cn } from "@/lib/utils";

interface OTTSectionRowProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  badgeText?: string;
  badgeVariant?: "amber" | "red" | "blue" | "default";
  shows: Show[];
  isAdultSection?: boolean;
}

export function OTTSectionRow({
  title,
  subtitle,
  icon,
  badgeText,
  badgeVariant = "default",
  shows,
  isAdultSection = false,
}: OTTSectionRowProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [isGridView, setIsGridView] = useState(false);

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = scrollRef.current.clientWidth * 0.85;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  if (!shows || shows.length === 0) return null;

  return (
    <section className="relative my-8 sm:my-12">
      {/* Section Header */}
      <div className="flex items-end justify-between gap-3 mb-4 px-1">
        <div>
          <div className="flex items-center gap-2">
            {icon && <span className="text-amber-400">{icon}</span>}
            <h2 className="font-display text-lg sm:text-2xl font-bold text-white tracking-tight">
              {title}
            </h2>
            {badgeText && (
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider",
                  badgeVariant === "red" && "bg-red-500/20 text-red-400 border border-red-500/30",
                  badgeVariant === "amber" && "bg-amber-500/20 text-amber-300 border border-amber-400/30",
                  badgeVariant === "blue" && "bg-blue-500/20 text-blue-300 border border-blue-400/30",
                  badgeVariant === "default" && "bg-white/10 text-white/80 border border-white/10",
                )}
              >
                {badgeText}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>

        {/* Action Controls: Mobile Grid Toggle & Desktop Carousel Arrows */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Mobile Grid/Carousel Toggle */}
          <button
            type="button"
            onClick={() => setIsGridView(!isGridView)}
            aria-label="Toggle Grid View"
            className="sm:hidden flex items-center gap-1 rounded-full border border-white/10 bg-zinc-900/90 px-2.5 py-1 text-[10px] font-semibold text-white/80 transition hover:bg-white/10 active:scale-95 cursor-pointer"
          >
            {isGridView ? (
              <>
                <Rows className="size-3 text-amber-400" />
                <span>Swipe</span>
              </>
            ) : (
              <>
                <LayoutGrid className="size-3 text-amber-400" />
                <span>Grid</span>
              </>
            )}
          </button>

          {/* Desktop Carousel Navigation */}
          <div className="hidden sm:flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleScroll("left")}
              aria-label="Scroll left"
              className="grid size-8 place-items-center rounded-full border border-white/10 bg-black/60 text-white transition hover:bg-white/15 hover:border-amber-400/40 active:scale-95 cursor-pointer"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => handleScroll("right")}
              aria-label="Scroll right"
              className="grid size-8 place-items-center rounded-full border border-white/10 bg-black/60 text-white transition hover:bg-white/15 hover:border-amber-400/40 active:scale-95 cursor-pointer"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 18+ Warning Banner if applicable */}
      {isAdultSection && (
        <div className="mb-3 flex items-center gap-2 rounded-xl bg-red-950/30 border border-red-500/20 px-3.5 py-1.5 text-xs text-red-300">
          <AlertTriangle className="size-3.5 shrink-0 text-red-400" />
          <span>Contains mature themes, adult romance, and psychological intensity. Viewer discretion advised.</span>
        </div>
      )}

      {/* Cards Container: Seamless 2-Column on Mobile (No 50% Cut-off) / Full Widescreen Carousel */}
      <div
        ref={scrollRef}
        className={cn(
          isGridView
            ? "grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
            : "no-scrollbar flex items-stretch gap-3 overflow-x-auto pb-3 pt-1 px-1 scroll-smooth snap-x snap-mandatory sm:snap-none sm:gap-4",
        )}
      >
        {shows.map((show) => {
          return (
            <Link
              key={show.id}
              to="/feed"
              className={cn(
                "group relative flex shrink-0 flex-col overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl",
                /* On mobile: Exactly 2 complete full cards per view (w-[calc(50%-6px)]), on desktop: w-[220px] */
                isGridView
                  ? "w-full"
                  : "w-[calc(50%-6px)] sm:w-[220px] md:w-[240px] snap-start",
                isAdultSection
                  ? "border-red-500/20 bg-gradient-to-b from-zinc-900 to-black hover:border-red-500/50 hover:shadow-red-500/10"
                  : "border-white/10 bg-gradient-to-b from-zinc-900/90 to-black hover:border-amber-400/50 hover:shadow-amber-500/15",
              )}
            >
              {/* Card Poster Image */}
              <div className="relative aspect-[9/13] w-full overflow-hidden bg-zinc-950">
                <img
                  src={show.coverImage}
                  alt={show.title}
                  loading="lazy"
                  className="size-full object-cover transition duration-500 group-hover:scale-105"
                />

                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                {/* Top Badges Row with Safe Spacing & Zero Overflow */}
                <div className="absolute top-2 left-2 right-2 flex items-center justify-between gap-1 pointer-events-none">
                  {show.badge ? (
                    <span
                      className={cn(
                        "truncate max-w-[60%] rounded-full px-1.5 py-0.5 text-[8.5px] sm:text-[9px] font-bold tracking-wide backdrop-blur-md shadow-md",
                        show.is18Plus
                          ? "bg-red-600/95 text-white"
                          : show.isComingSoon
                          ? "bg-blue-600/95 text-white"
                          : "bg-amber-400 text-black",
                      )}
                    >
                      {show.badge}
                    </span>
                  ) : (
                    <span className="shrink-0 rounded-full bg-black/70 border border-white/10 px-1.5 py-0.5 text-[8.5px] sm:text-[9px] font-semibold text-amber-300 backdrop-blur-md">
                      {show.totalEpisodes} Eps
                    </span>
                  )}

                  {show.rating && (
                    <span className="shrink-0 ml-auto flex items-center gap-0.5 rounded-full bg-black/80 border border-white/15 px-1.5 py-0.5 text-[8.5px] sm:text-[9px] font-bold text-amber-300 backdrop-blur-md shadow-md">
                      <Star className="size-2.5 fill-amber-400 text-amber-400" />
                      <span>{show.rating}</span>
                    </span>
                  )}
                </div>

                {/* Hover Play Button */}
                <div className="absolute inset-0 grid place-items-center opacity-0 group-hover:opacity-100 transition duration-200 bg-black/40">
                  <span
                    className={cn(
                      "grid size-10 sm:size-11 place-items-center rounded-full text-black shadow-xl",
                      isAdultSection ? "bg-red-500 shadow-red-500/40" : "bg-amber-400 shadow-amber-500/40",
                    )}
                  >
                    <Play className="size-4 sm:size-4.5 fill-current translate-x-0.5" />
                  </span>
                </div>

                {/* Bottom of Image: Language & Episode Tag */}
                <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between gap-1 text-[9px] sm:text-[10px] text-white/90">
                  <span className="truncate max-w-[80px] font-semibold bg-black/70 border border-white/10 px-1.5 py-0.5 rounded backdrop-blur-sm">
                    {show.language.includes("भोजपुरी") ? "भोजपुरी" : show.language.split(" ")[0]}
                  </span>
                  {show.isComingSoon && show.releaseDate ? (
                    <span className="shrink-0 font-bold text-blue-300 bg-black/70 border border-blue-400/20 px-1.5 py-0.5 rounded backdrop-blur-sm flex items-center gap-0.5">
                      <Clock className="size-2.5" /> {show.releaseDate}
                    </span>
                  ) : (
                    <span className="shrink-0 font-bold text-amber-300 bg-black/70 border border-amber-400/20 px-1.5 py-0.5 rounded backdrop-blur-sm">
                      {show.totalEpisodes} Eps
                    </span>
                  )}
                </div>
              </div>

              {/* Card Footer Info */}
              <div className="flex flex-1 flex-col justify-between p-2.5 sm:p-3">
                <div>
                  <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-amber-400/90">
                    {show.genre}
                  </p>
                  <h3 className="mt-0.5 font-display text-xs sm:text-sm font-bold text-white line-clamp-1 group-hover:text-amber-300 transition">
                    {show.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-[10px] sm:text-[11px] text-muted-foreground leading-relaxed">
                    {show.synopsis}
                  </p>
                </div>

                <div className="mt-2 pt-1.5 border-t border-white/10 flex items-center justify-between gap-1 text-[9px] sm:text-[10px] text-white/60">
                  <span className="truncate max-w-[80px] sm:max-w-[95px]">{show.director}</span>
                  <span className="shrink-0 font-semibold text-amber-300/90">
                    👏 {show.episodes[0]?.claps ? (show.episodes[0].claps >= 1000 ? `${(show.episodes[0].claps / 1000).toFixed(0)}k` : show.episodes[0].claps) : "12k"}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
