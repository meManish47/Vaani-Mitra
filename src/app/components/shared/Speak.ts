export async function speak(text: string) {
  if (!text) return;

  // Browser Web Speech API only (Capacitor not available in this environment)
  if (typeof window !== "undefined" && window.speechSynthesis) {
    try {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const cleaned = String(text)
        .replace(/[\u{1F300}-\u{1FAFF}]/gu, " ")
        .replace(/[\u2600-\u27BF]/g, " ")
        .replace(/\s+/g, " ")
        .replace(/([।.!?])\s*/g, "$1 ")
        .trim();

      const utter = new SpeechSynthesisUtterance(cleaned);
      utter.lang = "hi-IN";
      utter.rate = 0.9;
      utter.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const hindiVoices = voices.filter((v) => (v.lang || "").toLowerCase().startsWith("hi"));
      const scoreVoice = (v: SpeechSynthesisVoice) => {
        const name = (v.name || "").toLowerCase();
        let score = 0;
        if (v.localService) score += 4;
        if (name.includes("premium") || name.includes("natural") || name.includes("enhanced")) score += 5;
        if (name.includes("google")) score += 3;
        if (name.includes("microsoft")) score += 2;
        return score;
      };
      const hindiVoice = hindiVoices.sort((a, b) => scoreVoice(b) - scoreVoice(a))[0];

      if (hindiVoice) {
        utter.voice = hindiVoice;
      }

      window.speechSynthesis.speak(utter);
    } catch (e) {
      console.error("Web TTS error:", e);
    }
  }
}

export default speak;