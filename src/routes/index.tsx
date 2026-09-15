import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  ArrowRight,
  Bell,
  Clock,
  Film,
  Flame,
  Globe,
  Heart,
  HelpCircle,
  History,
  LogIn,
  LogOut,
  Play,
  Search,
  Settings,
  ShieldAlert,
  Sparkles,
  Star,
  Tv,
  User,
  Zap,
} from "lucide-react";
import { BrandLogo } from "@/components/common/BrandLogo";
import { Avatar } from "@/components/common/Avatar";
import { LanguageSelector } from "@/components/common/LanguageSelector";
import { HelpFeedbackModal } from "@/components/common/HelpFeedbackModal";
import { OTTSectionRow } from "@/components/landing/OTTSectionRow";
import { OTTCategoryBar, OTT_CATEGORIES } from "@/components/landing/OTTCategoryBar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { showApi } from "@/services/api/showApi";
import { mockShows } from "@/mock/shows";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Echo Reels — India's #1 Bhojpuri 2-Min Micro-Drama OTT" },
      {
        name: "description",
        content:
          "Watch original Bhojpuri micro-dramas, short serials, 18+ romantic thrillers, and village comedy. 2-minute bite-sized Bhojpuri episodes with zero buffering.",
      },
      { property: "og:title", content: "Echo Reels — Bhojpuri 2-Min Micro-Dramas & Short Serials" },
      {
        property: "og:description",
        content: "Explore Bhojpuri Trending, Drama, 18+ Mature, Coming Soon, Short Serials, and Thrillers in vertical format.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [helpModalOpen, setHelpModalOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      void navigate({ to: "/search", search: { q: searchQuery.trim() } });
    } else {
      void navigate({ to: "/search" });
    }
  };

  // Fetch dynamic Bhojpuri shows from FastAPI backend (with fallback to mockShows)
  const { data: allShows = mockShows } = useQuery({
    queryKey: ["shows"],
    queryFn: () => showApi.list(),
    initialData: mockShows,
  });

  // Group shows by section category
  const trendingShows = useMemo(
    () => allShows.filter((s) => s.sectionCategory === "trending"),
    [allShows],
  );
  const comingSoonShows = useMemo(
    () => allShows.filter((s) => s.sectionCategory === "coming_soon"),
    [allShows],
  );
  const dramaShows = useMemo(
    () => allShows.filter((s) => s.sectionCategory === "drama"),
    [allShows],
  );
  const adultShows = useMemo(
    () => allShows.filter((s) => s.sectionCategory === "18_plus"),
    [allShows],
  );
  const shortSerialShows = useMemo(
    () => allShows.filter((s) => s.sectionCategory === "short_serial"),
    [allShows],
  );
  const thrillerShows = useMemo(
    () => allShows.filter((s) => s.sectionCategory === "thriller"),
    [allShows],
  );

  const featuredShow = allShows[0] || mockShows[0]!;

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-amber-400 selection:text-black overflow-x-hidden">
      {/* Top Ambient Glow */}
      <div className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 -z-10 h-[500px] w-full max-w-7xl bg-gradient-to-b from-amber-500/10 via-orange-500/5 to-transparent blur-3xl" />

      {/* Floating Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link to="/" aria-label="Home" className="transition hover:opacity-90 shrink-0">
            <BrandLogo showName={true} />
          </Link>

          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Language Badge (Bhojpuri in English) */}
            <LanguageSelector />

            {/* Profile Dropdown Menu (Houses Profile, Mobile Log In, Help & Feedback, Settings, History) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                {isAuthenticated ? (
                  <button
                    type="button"
                    aria-label="User Profile"
                    className="grid size-9 sm:size-9.5 place-items-center rounded-full border border-amber-400/40 bg-zinc-900/80 p-0.5 backdrop-blur-md transition hover:border-amber-400 hover:ring-2 hover:ring-amber-400/30 active:scale-95 cursor-pointer overflow-hidden"
                  >
                    <Avatar
                      src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop"}
                      name={user?.name || "User"}
                      size="sm"
                      className="size-full"
                    />
                  </button>
                ) : (
                  <button
                    type="button"
                    aria-label="Profile"
                    className="grid size-9 sm:size-9.5 place-items-center rounded-full border border-amber-400/40 bg-zinc-900/80 text-amber-400 backdrop-blur-md shadow-sm transition hover:bg-amber-400/20 hover:border-amber-400 hover:text-amber-300 active:scale-95 cursor-pointer"
                  >
                    <User className="size-4 sm:size-4.5 text-amber-400" />
                  </button>
                )}
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56 rounded-2xl border border-amber-500/20 bg-zinc-950/95 p-2 backdrop-blur-xl shadow-2xl z-50">
                {isAuthenticated ? (
                  /* Authenticated User Menu */
                  <>
                    <div className="px-3 py-2 border-b border-white/10 mb-1">
                      <p className="text-xs font-bold text-white truncate">{user?.name || "Bhojpuri Viewer"}</p>
                      <p className="text-[11px] text-muted-foreground truncate">@{user?.username || "viewer"}</p>
                    </div>

                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium text-white hover:bg-white/10 cursor-pointer">
                        <User className="size-4 text-amber-400" />
                        <span>My Profile</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link to="/history" className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium text-white hover:bg-white/10 cursor-pointer">
                        <History className="size-4 text-amber-400" />
                        <span>Watch History</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link to="/notifications" className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium text-white hover:bg-white/10 cursor-pointer">
                        <Bell className="size-4 text-amber-400" />
                        <span>Notifications</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => setHelpModalOpen(true)}
                      className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium text-white hover:bg-white/10 cursor-pointer"
                    >
                      <HelpCircle className="size-4 text-amber-400" />
                      <span>Help & Feedback</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium text-white hover:bg-white/10 cursor-pointer">
                        <Settings className="size-4 text-amber-400" />
                        <span>Account Settings</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="my-1 bg-white/10" />

                    <DropdownMenuItem
                      onClick={() => void logout()}
                      className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 cursor-pointer"
                    >
                      <LogOut className="size-4" />
                      <span>Log Out</span>
                    </DropdownMenuItem>
                  </>
                ) : (
                  /* Guest / Unauthenticated Menu */
                  <>
                    <div className="px-3 py-2 border-b border-white/10 mb-2">
                      <p className="text-xs font-bold text-white">Echo Reels Bhojpuri</p>
                      <p className="text-[11px] text-muted-foreground">Log in with Mobile to stream & save history</p>
                    </div>

                    <div className="px-1 mb-2">
                      <Link
                        to="/login"
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-400 py-2.5 text-xs font-bold text-black shadow-lg shadow-amber-400/20 transition hover:brightness-110 active:scale-95"
                      >
                        <LogIn className="size-4" />
                        <span>Log In</span>
                      </Link>
                    </div>

                    <DropdownMenuItem
                      onClick={() => setHelpModalOpen(true)}
                      className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium text-white hover:bg-white/10 cursor-pointer"
                    >
                      <HelpCircle className="size-4 text-amber-400" />
                      <span>Help & Feedback</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium text-white hover:bg-white/10 cursor-pointer">
                        <User className="size-4 text-amber-400" />
                        <span>My Profile</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link to="/history" className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium text-white hover:bg-white/10 cursor-pointer">
                        <History className="size-4 text-amber-400" />
                        <span>Watch History</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium text-white hover:bg-white/10 cursor-pointer">
                        <Settings className="size-4 text-amber-400" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Featured Spotlight Banner */}
      <section className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 pt-4 pb-2">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 p-6 sm:p-8 md:p-10 shadow-2xl min-h-[340px] sm:min-h-[300px] flex flex-col justify-end">
          {/* Background Poster */}
          <img
            src={featuredShow.coverImage}
            alt={featuredShow.title}
            className="absolute inset-0 size-full object-cover opacity-45 brightness-75"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />

          {/* Featured Content Info */}
          <div className="relative z-10 max-w-xl">
            <div className="flex flex-wrap items-center gap-2 mb-2.5">
              <span className="rounded-full bg-amber-400 px-2.5 py-0.5 text-[10px] font-extrabold text-black uppercase tracking-wider shrink-0">
                FEATURED SPOTLIGHT
              </span>
              <span className="text-xs text-white/90 font-medium">
                {featuredShow.language} · {featuredShow.totalEpisodes} Episodes
              </span>
              <span className="flex items-center gap-1 text-xs font-bold text-amber-300">
                <Star className="size-3 fill-amber-400 text-amber-400" />
                {featuredShow.rating}
              </span>
            </div>

            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {featuredShow.title}
            </h1>

            <p className="mt-2 line-clamp-2 text-xs sm:text-sm text-white/80 leading-relaxed max-w-lg">
              {featuredShow.synopsis}
            </p>

            <div className="mt-4 sm:mt-5 flex flex-wrap items-center gap-3">
              <Link
                to="/feed"
                className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-6 py-2.5 text-xs sm:text-sm font-bold text-black shadow-lg shadow-amber-400/30 transition hover:brightness-110 active:scale-95"
              >
                <Play className="size-4 fill-current" />
                <span>Play Ep 1 (2 Min)</span>
              </Link>
              <Link
                to="/search"
                search={{ q: featuredShow.title }}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 py-2.5 text-xs font-semibold text-white backdrop-blur-md transition hover:bg-white/20 active:scale-95"
              >
                Details & Cast
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Landing OTT Sections */}
      <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 pb-20">
        {/* Sticky Category Bar */}
        <OTTCategoryBar
          activeCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* SECTION 1: TRENDING NOW */}
        {(selectedCategory === "all" || selectedCategory === "trending") && (
          <OTTSectionRow
            title="Trending Now"
            subtitle="Top streamed 2-minute micro-dramas across India today"
            icon={<Flame className="size-5" />}
            badgeText="Top 10"
            badgeVariant="amber"
            shows={trendingShows}
          />
        )}

        {/* SECTION 2: COMING SOON */}
        {(selectedCategory === "all" || selectedCategory === "coming_soon") && (
          <OTTSectionRow
            title="Coming Soon & Exclusive Drops"
            subtitle="Upcoming original series arriving this week"
            icon={<Clock className="size-5 text-blue-400" />}
            badgeText="Teasers & Trailers"
            badgeVariant="blue"
            shows={comingSoonShows}
          />
        )}

        {/* SECTION 3: DRAMA & ROMANCE */}
        {(selectedCategory === "all" || selectedCategory === "drama") && (
          <OTTSectionRow
            title="Drama & Romance"
            subtitle="Heartfelt Indian love stories, family drama, and emotional bonds"
            icon={<Heart className="size-5 text-rose-400" />}
            badgeText="Must Watch"
            badgeVariant="amber"
            shows={dramaShows}
          />
        )}

        {/* SECTION 4: 18+ BOLD & MATURE */}
        {(selectedCategory === "all" || selectedCategory === "18_plus") && (
          <OTTSectionRow
            title="18+ Bold & Sensual"
            subtitle="Late-night mature romance, dark desire, and psychological intrigue"
            icon={<ShieldAlert className="size-5 text-red-500" />}
            badgeText="🔞 18+ Only"
            badgeVariant="red"
            shows={adultShows}
            isAdultSection={true}
          />
        )}

        {/* SECTION 5: SHORT SERIALS (DAILY MINI-SOAPS) */}
        {(selectedCategory === "all" || selectedCategory === "short_serial") && (
          <OTTSectionRow
            title="Short Serials & Daily Soaps"
            subtitle="Bite-sized daily serials packed with comedy, family twists, and cliffhangers"
            icon={<Tv className="size-5 text-amber-400" />}
            badgeText="Multi-Ep Serials"
            badgeVariant="amber"
            shows={shortSerialShows}
          />
        )}

        {/* SECTION 6: SUSPENSE & THRILLER */}
        {(selectedCategory === "all" || selectedCategory === "thriller") && (
          <OTTSectionRow
            title="Suspense & Cyber Thrillers"
            subtitle="Fast-paced crime, murder mystery, and edge-of-the-seat cliffhangers"
            icon={<Zap className="size-5 text-amber-400" />}
            badgeText="Edge of Seat"
            badgeVariant="amber"
            shows={thrillerShows}
          />
        )}

        {/* Quick Search Bar with Trending Search Tags (At the bottom) */}
        <div className="mx-auto w-full max-w-2xl mt-14 mb-4 pt-10 border-t border-white/10">
          <form
            onSubmit={handleSearchSubmit}
            className="relative flex items-center rounded-full border border-amber-400/30 bg-zinc-900/90 p-1.5 shadow-xl backdrop-blur-xl transition hover:border-amber-400 focus-within:border-amber-400"
          >
            <Search className="ml-3.5 size-4 text-amber-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search any micro-drama, actor, 18+ series, or genre..."
              className="w-full bg-transparent px-3 text-xs sm:text-sm text-white placeholder:text-muted-foreground focus:outline-none"
            />
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-full bg-amber-400 px-5 py-2 text-xs font-bold text-black shadow-md transition hover:brightness-110 active:scale-95 shrink-0 cursor-pointer"
            >
              <Search className="size-3.5 fill-current" />
              <span>Search</span>
            </button>
          </form>

          {/* Quick Trending Keyword Pills */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 text-[11px] px-2">
            <span className="text-muted-foreground shrink-0 font-medium mr-1">Quick search:</span>
            {[
              { label: "🌟 Pawan Singh", q: "Pawan Singh" },
              { label: "💥 Khesari Lal", q: "Khesari Lal" },
              { label: "🎬 Nirahua", q: "Nirahua" },
              { label: "❤️ Bhojpuri Romance", q: "Romance" },
              { label: "⚡ Action Dhamaka", q: "Action" },
              { label: "🔞 18+ Suspense", q: "18+" },
              { label: "🌾 Dehati Drama", q: "Drama" },
            ].map(({ label, q }) => (
              <button
                key={label}
                type="button"
                onClick={() => void navigate({ to: "/search", search: { q } })}
                className="shrink-0 rounded-full bg-white/5 border border-white/10 px-3 py-1 text-white/80 transition hover:bg-amber-400/20 hover:border-amber-400/40 hover:text-amber-300 active:scale-95 cursor-pointer"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* Minimal Clean Footer */}
      <footer className="border-t border-white/10 bg-black/80 py-8">
        <div className="mx-auto flex w-full max-w-7xl flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <BrandLogo showName={true} />
            <span className="text-white/20">|</span>
            <p>© 2026 Echo Reels. 2-Minute Micro-Drama OTT.</p>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/feed" className="hover:text-white transition">Watch Feed</Link>
            <Link to="/search" className="hover:text-white transition">Search Catalog</Link>
            <Link to="/settings" className="hover:text-white transition">Settings</Link>
          </div>
        </div>
      </footer>

      {/* Help & Feedback Modal */}
      <HelpFeedbackModal
        isOpen={helpModalOpen}
        onClose={() => setHelpModalOpen(false)}
      />
    </div>
  );
}
