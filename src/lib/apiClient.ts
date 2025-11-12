import axios from "axios";

const isNative = () => {
  if (typeof window === "undefined") return false;
  try {
    // Capacitor injected at runtime only on native builds
    return !!(window as any).Capacitor?.isNativePlatform?.();
  } catch {
    return false;
  }
};

const API_BASE_URL = isNative()
  ? "https://vaani-mitra-ruddy.vercel.app" // ✅ no trailing slash
  : process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"; // ✅ fallback for dev web

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // ✅ keep cookies/session
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
