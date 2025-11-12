import axios from "axios";

const isNative = () =>
  typeof window !== "undefined" &&
  (window as any).Capacitor?.isNativePlatform?.();

const API_BASE_URL = isNative()
  ? "https://vaani-mitra-ruddy.vercel.app/" // ✅ your deployed backend
  : process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"; // ✅ dev fallback

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export default api;
