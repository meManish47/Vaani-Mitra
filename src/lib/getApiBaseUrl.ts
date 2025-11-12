export const getApiBaseUrl = () => {
  const isNative =
    typeof window !== "undefined" &&
    (window as any).Capacitor?.isNativePlatform?.();

  return isNative
    ? "https://vaani-mitra-ruddy.vercel.app/" // 👈 replace with your deployed API URL
    : process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
};
