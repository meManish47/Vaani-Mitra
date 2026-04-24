import axios from "axios";
import { Capacitor } from "@capacitor/core";

function getBaseUrl() {
  // 🔥 CHANGE THIS WHEN USING NGROK
  const NGROK_URL = "https://faustino-weakish-elenora.ngrok-free.dev";

  // 1️⃣ Native apps (Android / iOS)
  if (Capacitor.isNativePlatform()) {
    return NGROK_URL; 
    // or keep production if backend is deployed:
    // return "https://vaani-mitra-ruddy.vercel.app";
  }

  // 2️⃣ Browser
  if (typeof window !== "undefined") {
    const origin = window.location.origin;

    // 🧪 Local development
    if (origin.includes("localhost")) {
      return "http://localhost:3000";
    }

    // 🌐 If you're accessing frontend via ngrok
    if (origin.includes("ngrok-free.dev")) {
      return NGROK_URL;
    }

    // 🚀 Production (Vercel)
    return "https://vaani-mitra-ruddy.vercel.app";
  }

  // 3️⃣ SSR fallback
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