// src/lib/axios.ts
import axios, { AxiosError } from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
const api = axios.create({
  baseURL: API_BASE,
  // ✅ Refresh uses JSON tokens, not cookies → so keep false
  withCredentials: false,
});

// ✅ Standardized keys to avoid mismatch bugs
export const ACCESS_KEY = "access_token";
export const REFRESH_KEY = "refresh_token";

let isRefreshing = false;
let failedQueue: {
  resolve: (value?: any) => void;
  reject: (err?: any) => void;
  originalRequest: any;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((p) => {
    if (error) {
      p.reject(error);
    } else {
      if (token && p.originalRequest?.headers) {
        p.originalRequest.headers.Authorization = `Bearer ${token}`;
      }
      p.resolve(api(p.originalRequest));
    }
  });
  failedQueue = [];
};

// ✅ Only skip Authorization for real public endpoints
const isPublicEndpoint = (url: string | undefined) => {
  if (!url) return false;
  return (
    url.startsWith("/auth/login") ||
    url.startsWith("/auth/register") ||
    url.startsWith("/auth/refresh") ||
    (url.startsWith("/listings") && !url.includes("favorites"))
  );
};

// ✅ Attach access token on every non-public request
api.interceptors.request.use((config) => {
  if (typeof window === "undefined") return config;

  const token = localStorage.getItem(ACCESS_KEY);

  if (!isPublicEndpoint(config.url) && token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Refresh-token-aware response handler
api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError & { config?: any }) => {
    const originalRequest = error.config;

    if (!originalRequest) return Promise.reject(error);

    // ✅ Only trigger refresh once
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, originalRequest });
        });
      }

      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem(REFRESH_KEY);
        if (!refreshToken) throw new Error("Refresh token missing");

        // ✅ Must also include refresh token in Authorization header
        const refreshRes = await fetch(`${API_BASE}/auth/refresh`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${refreshToken}`, // ✅ FIX #1
          },
          body: JSON.stringify({ refresh_token: refreshToken }),
        });

        if (!refreshRes.ok) throw new Error("Refresh failed");

        const data = await refreshRes.json();
        const newAccess = data.access_token;
        const newRefresh = data.refresh_token; // ✅ FIX #2

        if (!newAccess) throw new Error("No access token returned");

        // ✅ Replace old tokens only if both are valid
        localStorage.setItem(ACCESS_KEY, newAccess);
        if (newRefresh) localStorage.setItem(REFRESH_KEY, newRefresh);

        processQueue(null, newAccess);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        }

        isRefreshing = false;
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        isRefreshing = false;

        // ✅ Fix broken infinite redirect loops
        localStorage.removeItem(ACCESS_KEY);
        localStorage.removeItem(REFRESH_KEY);

        if (typeof window !== "undefined") {
          if (!window.location.pathname.includes("/auth/login")) {
            window.location.href = "/auth/login"; // ✅ FIX #3: prevents login redirect loop
          }
        }
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
