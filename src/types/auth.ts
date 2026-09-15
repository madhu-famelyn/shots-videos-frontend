import type { UserProfile } from "./user";

export interface LoginPayload {
  email: string;
  password: string;
  remember?: boolean;
}

export interface PhoneLoginPayload {
  phone: string;
  otp: string;
}

export interface RegisterPayload {
  name: string;
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  user: UserProfile;
}
