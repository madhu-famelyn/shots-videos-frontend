import { create } from "zustand";
import { authApi } from "@/services/api/authApi";
import { tokenStorage } from "@/services/api/client";
import type { LoginPayload, PhoneLoginPayload, RegisterPayload } from "@/types/auth";
import type { UserProfile } from "@/types/user";

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
  hydrated: boolean;
  error: string | null;
  hydrate: () => Promise<void>;
  login: (payload: LoginPayload) => Promise<void>;
  loginWithPhone: (payload: PhoneLoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: UserProfile) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  loading: false,
  hydrated: false,
  error: null,

  hydrate: async () => {
    if (!tokenStorage.get()) {
      set({ hydrated: true, isAuthenticated: false, user: null });
      return;
    }
    try {
      const user = await authApi.me();
      set({ user, isAuthenticated: true, hydrated: true });
    } catch {
      tokenStorage.clear();
      set({ hydrated: true, isAuthenticated: false, user: null });
    }
  },

  login: async (payload) => {
    set({ loading: true, error: null });
    try {
      const res = await authApi.login(payload);
      tokenStorage.set(res.accessToken);
      set({ user: res.user, isAuthenticated: true, loading: false, hydrated: true });
    } catch (e) {
      set({ loading: false, error: (e as Error).message });
      throw e;
    }
  },

  loginWithPhone: async (payload) => {
    set({ loading: true, error: null });
    try {
      const res = await authApi.loginWithPhone(payload);
      tokenStorage.set(res.accessToken);
      set({ user: res.user, isAuthenticated: true, loading: false, hydrated: true });
    } catch (e) {
      set({ loading: false, error: (e as Error).message });
      throw e;
    }
  },

  register: async (payload) => {
    set({ loading: true, error: null });
    try {
      const res = await authApi.register(payload);
      tokenStorage.set(res.accessToken);
      set({ user: res.user, isAuthenticated: true, loading: false, hydrated: true });
    } catch (e) {
      set({ loading: false, error: (e as Error).message });
      throw e;
    }
  },

  logout: async () => {
    await authApi.logout().catch(() => undefined);
    tokenStorage.clear();
    set({ user: null, isAuthenticated: false });
  },

  setUser: (user) => set({ user }),
}));
