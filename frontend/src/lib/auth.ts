// src/lib/auth.ts
import { jwtDecode } from "jwt-decode";

export interface DecodedToken {
  user_id: number;
  email: string;
  role: string;
  exp: number;
}

export const getCurrentUser = (): DecodedToken | null => {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("access_token");
  if (!token) return null;
  try {
    return jwtDecode<DecodedToken>(token);
  } catch {
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem("access_token");
  window.location.href = "/auth/login";
};
