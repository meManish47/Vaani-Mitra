import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.vaanimitra.app",
  appName: "Vaani-Mitra",
  webDir: "dist", // <-- must point to ANY valid folder
  server: {
    url: "https://vaani-mitra-ruddy.vercel.app", // <-- your hosted Next.js site
    cleartext: true,
  },
};

export default config;
