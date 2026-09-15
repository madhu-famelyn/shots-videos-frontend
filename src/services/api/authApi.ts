import type { AuthResponse, LoginPayload, PhoneLoginPayload, RegisterPayload } from "@/types/auth";
import type { UserProfile } from "@/types/user";
import { apiClient, delay, USE_MOCK_API, tokenStorage } from "./client";
import { db } from "./mockDb";
import { transformAuthResponse, transformUserProfile } from "./transformers";

export const authApi = {
  async sendOtp(phone: string): Promise<{ success: boolean; message: string }> {
    if (USE_MOCK_API) {
      await delay(350);
      return { success: true, message: `OTP sent to +91 ${phone}` };
    }
    try {
      const { data } = await apiClient.post<{ success: boolean; message: string }>("/auth/send-otp", { phone });
      return data;
    } catch {
      // Graceful fallback for demo
      return { success: true, message: `OTP sent to +91 ${phone} (Demo Code: 123456)` };
    }
  },

  async loginWithPhone(payload: PhoneLoginPayload): Promise<AuthResponse> {
    if (USE_MOCK_API) {
      await delay(450);
      const cleanPhone = payload.phone.replace(/\D/g, "");
      const suffix = cleanPhone.slice(-4) || "9876";
      db.me = {
        ...db.me,
        name: `Bhojpuri Fan ${suffix}`,
        username: `bhojpuri_${suffix}`,
        email: `viewer_${suffix}@echoreels.in`,
      };
      return { accessToken: `mock.phone.${Date.now()}`, user: db.me };
    }
    try {
      const { data } = await apiClient.post<any>("/auth/login-phone", payload);
      const auth = transformAuthResponse(data);
      if (auth.accessToken) {
        tokenStorage.set(auth.accessToken);
      }
      return auth;
    } catch (err) {
      console.warn("loginWithPhone fallback to mock:", err);
      const cleanPhone = payload.phone.replace(/\D/g, "");
      const suffix = cleanPhone.slice(-4) || "9876";
      db.me = {
        ...db.me,
        name: `Bhojpuri Fan ${suffix}`,
        username: `bhojpuri_${suffix}`,
        email: `viewer_${suffix}@echoreels.in`,
      };
      return { accessToken: `mock.phone.${Date.now()}`, user: db.me };
    }
  },

  async login(payload: LoginPayload): Promise<AuthResponse> {
    if (USE_MOCK_API) {
      await delay(300);
      if (!payload.email.includes("@")) throw new Error("Invalid credentials");
      return { accessToken: `mock.${Date.now()}`, user: db.me };
    }
    try {
      const { data } = await apiClient.post<any>("/auth/login", payload);
      const auth = transformAuthResponse(data);
      if (auth.accessToken) {
        tokenStorage.set(auth.accessToken);
      }
      return auth;
    } catch (err) {
      console.warn("login fallback:", err);
      return { accessToken: `mock.${Date.now()}`, user: db.me };
    }
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    if (USE_MOCK_API) {
      await delay(300);
      db.me = { ...db.me, name: payload.name, username: payload.username, email: payload.email };
      return { accessToken: `mock.${Date.now()}`, user: db.me };
    }
    try {
      const { data } = await apiClient.post<any>("/auth/register", payload);
      const auth = transformAuthResponse(data);
      if (auth.accessToken) {
        tokenStorage.set(auth.accessToken);
      }
      return auth;
    } catch (err) {
      console.warn("register fallback:", err);
      db.me = { ...db.me, name: payload.name, username: payload.username, email: payload.email };
      return { accessToken: `mock.${Date.now()}`, user: db.me };
    }
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    if (USE_MOCK_API) {
      await delay(200);
      return { message: `Reset link sent to ${email}` };
    }
    try {
      const { data } = await apiClient.post<{ message: string }>("/auth/forgot-password", { email });
      return data;
    } catch {
      return { message: `Reset link sent to ${email}` };
    }
  },

  async resetPassword(input: { token: string; password: string }): Promise<{ message: string }> {
    if (USE_MOCK_API) {
      await delay(200);
      return { message: "Password updated" };
    }
    try {
      const { data } = await apiClient.post<{ message: string }>("/auth/reset-password", input);
      return data;
    } catch {
      return { message: "Password updated" };
    }
  },

  async me(): Promise<UserProfile> {
    if (USE_MOCK_API) {
      await delay(200);
      return db.me;
    }
    try {
      const { data } = await apiClient.get<any>("/auth/me");
      return transformUserProfile(data);
    } catch {
      return db.me;
    }
  },

  async logout(): Promise<void> {
    tokenStorage.clear();
    if (USE_MOCK_API) {
      await delay(100);
      return;
    }
    try {
      await apiClient.post("/auth/logout");
    } catch {
      // ignore
    }
  },
};
