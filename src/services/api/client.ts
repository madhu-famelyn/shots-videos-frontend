import axios from "axios";

/**
 * Centralized API configuration.
 * Set VITE_API_BASE_URL (e.g. http://localhost:8000/api) to talk to the FastAPI
 * backend. While it is unset the app serves realistic mock responses that match
 * the shape of the future API, so no UI component has to change later.
 */
export const API_BASE_URL = (import.meta.env["VITE_API_BASE_URL"] as string | undefined) ?? "";

export const USE_MOCK_API = API_BASE_URL.length === 0;

const TOKEN_KEY = "lumo.access_token";

export const tokenStorage = {
  get(): string | null {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(TOKEN_KEY);
  },
  set(token: string) {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(TOKEN_KEY, token);
  },
  clear() {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(TOKEN_KEY);
  },
};

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    const detail =
      (error?.response?.data?.detail as string | undefined) ??
      (error?.message as string | undefined) ??
      "Network unavailable";
    return Promise.reject(new Error(detail));
  },
);

/** Simulated latency for the mock layer. */
export const delay = (ms = 420) => new Promise<void>((resolve) => setTimeout(resolve, ms));
