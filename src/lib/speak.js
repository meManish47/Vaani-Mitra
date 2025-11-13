"use client";
import { Capacitor } from "@capacitor/core";

export async function speak(text) {
  if (!text) return;

  const isNative = Capacitor.isNativePlatform();

  if (isNative) {
    try {
      // Dynamic import so static export = no crash
      const { TextToSpeech } = await import("@capacitor-community/text-to-speech");

      await TextToSpeech.speak({
        text,
        lang: "hi-IN",
        rate: 1.0,
        pitch: 1.0,
      });
    } catch (e) {
      console.error("Native TTS error:", e);
    }
    return;
  }

  // Browser fallback
  if (typeof window !== "undefined" && window.speechSynthesis) {
    try {
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = "hi-IN";
      window.speechSynthesis.speak(utter);
    } catch (e) {
      console.error("Web TTS error:", e);
    }
  }
}
