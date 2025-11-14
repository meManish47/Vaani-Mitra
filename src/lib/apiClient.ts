import axios from "axios";
import { Capacitor } from "@capacitor/core";

function getBaseUrl() {
  // 1️⃣ If running inside Android/iOS (Capacitor Native)
  if (Capacitor.isNativePlatform()) {
    return "https://vaani-mitra-ruddy.vercel.app"; // production backend
  }

  // 2️⃣ If running in browser (dev or prod)
  if (typeof window !== "undefined") {
    const origin = window.location.origin;

    // Dev mode → localhost:3000
    if (origin.includes("localhost")) {
      return "http://localhost:3000";
    }

    // Production website (Vercel)
    return "https://vaani-mitra-ruddy.vercel.app";
  }

  // 3️⃣ Default fallback (SSR)
  return "https://vaani-mitra-ruddy.vercel.app";
}

const api = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
