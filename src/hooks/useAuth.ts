import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

/** Hydrates the session once per app load and exposes auth state + actions. */
export function useAuth() {
  const store = useAuthStore();

  useEffect(() => {
    if (!store.hydrated) void store.hydrate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.hydrated]);

  return store;
}
