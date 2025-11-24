"use client";
import { Capacitor } from "@capacitor/core";

let webRecognition;

export async function startListening(onText) {
  const isNative = Capacitor.isNativePlatform();

  // -------------------------
  // 👉 Native (Android/iOS)
  // -------------------------
  if (isNative) {
    try {
      const { SpeechRecognition } = await import(
        "@capacitor-community/speech-recognition"
      );

      await SpeechRecognition.requestPermission();

      const { matches } = await SpeechRecognition.start({
        language: "hi-IN",
        maxResults: 1,
        prompt: "Speak now...",
        partialResults: true,
      });

      if (matches?.length > 0) onText(matches[0]);
    } catch (e) {
      console.error("Native SR error:", e);
    }
    return;
  }

  // -------------------------
  // 👉 Web fallback
  // -------------------------
  if (typeof window !== "undefined") {
    const Speech =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!Speech) {
      alert("Speech recognition not supported");
      return;
    }

    webRecognition = new Speech();
    webRecognition.continuous = true;
    webRecognition.interimResults = true;
    webRecognition.lang = "hi-IN";

    webRecognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      onText(transcript);
    };

    webRecognition.start();
  }
}

export function stopListening() {
  if (webRecognition) webRecognition.stop();
}
