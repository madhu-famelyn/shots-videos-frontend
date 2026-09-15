import { Link, useNavigate } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";

export function AuthLayout({
  children,
}: {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  const { hydrated, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (hydrated && isAuthenticated) void navigate({ to: "/feed", replace: true });
  }, [hydrated, isAuthenticated, navigate]);

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-black text-foreground selection:bg-amber-400 selection:text-black overflow-x-hidden sm:p-6 lg:p-8">
      {/* Desktop / Laptop Ambient Cinema Backdrop (Dims wide monitor edges) */}
      <div className="fixed inset-0 z-0 hidden sm:block overflow-hidden pointer-events-none select-none">
        <div className="absolute inset-0 flex items-center justify-center gap-8 opacity-25 filter blur-3xl scale-110">
          <img
            src="/bhojpuri_login_bg.jpg"
            alt=""
            className="h-[120vh] w-auto max-w-none object-cover"
          />
        </div>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[140px]" />
        <div className="absolute inset-0 bg-radial from-transparent via-black/70 to-zinc-950" />
      </div>

      {/* Main Authentication Card: Edge-to-edge full-bleed on Mobile, Centered Mobile Canvas on Laptop */}
      <div className="relative z-10 w-full min-h-screen sm:min-h-[720px] sm:max-h-[92vh] sm:max-w-[420px] flex flex-col justify-between p-4 sm:p-6 sm:rounded-3xl sm:border sm:border-white/15 sm:bg-black sm:shadow-[0_25px_80px_rgba(0,0,0,0.95),0_0_50px_rgba(234,179,8,0.15)] overflow-hidden my-auto">
        {/* Full-bleed Authentic Bhojpuri Movie Backdrop */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
          <img
            src="/bhojpuri_login_bg.jpg"
            alt="Bhojpuri Movie Posters Backdrop"
            className="size-full object-cover object-top"
          />
          {/* Smooth Cinematic Gradient Vignette: posters fade naturally behind the login form */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/85 to-black/30" />
          <div className="absolute inset-0 bg-radial from-transparent via-black/40 to-black/90" />
        </div>

        {/* Top Header: Clean Floating Back Arrow (No extra right chips) */}
        <header className="relative z-20 flex items-center pt-2">
          <Link
            to="/"
            aria-label="Back"
            className="grid size-11 place-items-center rounded-full text-white/90 transition hover:text-amber-400 hover:bg-white/10 active:scale-90 cursor-pointer"
          >
            <ChevronLeft className="size-8 text-white stroke-[2.5]" />
          </Link>
        </header>

        {/* Center Form Section */}
        <div className="relative z-20 mx-auto w-full max-w-sm pb-6 sm:pb-8 flex flex-col items-center">
          {children}
        </div>

        {/* Bottom Anchor */}
        <div className="hidden" />
      </div>
    </div>
  );
}
