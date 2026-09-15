import { useNavigate } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { BrandLogo } from "@/components/common/BrandLogo";
import { useAuth } from "@/hooks/useAuth";

export function SplashScreen() {
  return (
    <div className="grid min-h-screen place-items-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <span className="animate-pulse">
          <BrandLogo showName={false} className="scale-150" />
        </span>
        <p className="font-display text-2xl font-bold tracking-tight">Reeltide</p>
        <span
          className="h-1 w-28 overflow-hidden rounded-full bg-secondary"
          role="status"
          aria-label="Loading"
        >
          <span className="block h-full w-1/2 animate-[pulse_1.2s_ease-in-out_infinite] rounded-full bg-brand" />
        </span>
      </div>
    </div>
  );
}

/** Shows the splash while the session hydrates, then guards private screens. */
export function AuthGate({ children }: { children: ReactNode }) {
  const { hydrated, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (hydrated && !isAuthenticated) void navigate({ to: "/login", replace: true });
  }, [hydrated, isAuthenticated, navigate]);

  if (!hydrated || !isAuthenticated) return <SplashScreen />;
  return <>{children}</>;
}
