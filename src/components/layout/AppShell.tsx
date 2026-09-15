import { Link } from "@tanstack/react-router";
import { Bell, Compass, History, Home, Search, Settings, User } from "lucide-react";
import type { ReactNode } from "react";
import { BrandLogo } from "@/components/common/BrandLogo";

const NAV = [
  { to: "/feed", label: "Home", icon: Home },
  { to: "/search", label: "Search", icon: Search },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/profile", label: "Profile", icon: User },
] as const;

const SECONDARY = [
  { to: "/history", label: "Watch history", icon: History },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

interface AppShellProps {
  children: ReactNode;
  /** Immersive pages (the feed) manage their own scrolling and padding. */
  immersive?: boolean;
  title?: string;
}

export function AppShell({ children, immersive = false, title }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Desktop / tablet sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-20 flex-col items-center gap-2 border-r border-border bg-sidebar py-5 md:flex xl:w-60 xl:items-stretch xl:px-4">
        <Link to="/" className="mb-4 flex items-center justify-center xl:justify-start">
          <BrandLogo showName={false} className="xl:hidden" />
          <BrandLogo className="hidden xl:inline-flex" />
        </Link>
        <nav aria-label="Main" className="flex w-full flex-col gap-1">
          {[...NAV, ...SECONDARY].map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              aria-label={label}
              activeOptions={{ exact: to === "/feed" }}
              className="flex min-h-11 items-center justify-center gap-3 rounded-xl px-3 text-muted-foreground transition hover:bg-secondary hover:text-foreground data-[status=active]:bg-secondary data-[status=active]:text-brand xl:justify-start"
            >
              <Icon className="size-5 shrink-0" aria-hidden />
              <span className="hidden text-sm font-medium xl:inline">{label}</span>
            </Link>
          ))}
        </nav>
        <div className="mt-auto hidden xl:block">
          <p className="text-xs text-muted-foreground">
            Reeltide — short videos, endless tide.
          </p>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="fixed inset-x-0 top-0 z-30 flex items-center justify-between gap-3 bg-gradient-to-b from-black/70 to-transparent px-4 py-3 md:hidden">
        <Link to="/" aria-label="Reeltide home">
          <BrandLogo />
        </Link>
        <div className="flex items-center gap-1">
          <Link
            to="/search"
            aria-label="Search"
            className="grid min-h-11 min-w-11 place-items-center rounded-full text-white"
          >
            <Search className="size-5" aria-hidden />
          </Link>
          <Link
            to="/notifications"
            aria-label="Notifications"
            className="grid min-h-11 min-w-11 place-items-center rounded-full text-white"
          >
            <Bell className="size-5" aria-hidden />
          </Link>
        </div>
      </header>

      <main
        className={
          immersive
            ? "h-screen md:pl-20 xl:pl-60"
            : "mx-auto min-h-screen w-full max-w-5xl px-4 pt-16 pb-24 md:pt-8 md:pb-10 md:pl-24 xl:pl-64"
        }
      >
        {title && !immersive ? (
          <h1 className="mb-5 font-display text-2xl font-bold tracking-tight">{title}</h1>
        ) : null}
        {children}
      </main>

      {/* Mobile bottom navigation */}
      <nav
        aria-label="Main"
        className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-border bg-background/95 backdrop-blur-md md:hidden"
      >
        {NAV.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            aria-label={label}
            activeOptions={{ exact: to === "/feed" }}
            className="flex min-h-14 flex-col items-center justify-center gap-1 text-muted-foreground transition data-[status=active]:text-brand"
          >
            <Icon className="size-5" aria-hidden />
            <span className="text-[11px] font-medium">{label}</span>
          </Link>
        ))}
      </nav>

      <Link
        to="/settings"
        aria-label="Settings"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-secondary focus:px-3 focus:py-2"
      >
        <Compass className="mr-2 inline size-4" aria-hidden />
        Settings
      </Link>
    </div>
  );
}
