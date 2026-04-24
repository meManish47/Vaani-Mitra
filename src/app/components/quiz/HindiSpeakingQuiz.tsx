// @ts-nocheck
import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2 } from "lucide-react";
import { Button } from "@/app/components/ui/button";

// ─────────────────────────────────────────────
// Better TTS — uses hi-IN voice, slower rate,
// falls back gracefully if no Hindi voice found
// ─────────────────────────────────────────────
function pickBestHindiVoice(voices: SpeechSynthesisVoice[]) {
  if (!voices?.length) return null;
  const hindiVoices = voices.filter((v) => (v.lang || "").toLowerCase().startsWith("hi"));
  if (hindiVoices.length === 0) return null;

  const scoreVoice = (v: SpeechSynthesisVoice) => {
    const name = (v.name || "").toLowerCase();
    let score = 0;
    if (v.localService) score += 4;
    if (name.includes("premium") || name.includes("natural") || name.includes("enhanced")) score += 5;
    if (name.includes("google")) score += 3;
    if (name.includes("microsoft")) score += 2;
    if (name.includes("female")) score += 1;
    return score;
  };

  return [...hindiVoices].sort((a, b) => scoreVoice(b) - scoreVoice(a))[0];
}

function makeSpeakFriendly(text: string) {
  return text
    .replace(/[\u{1F300}-\u{1FAFF}]/gu, " ")
    .replace(/[\u2600-\u27BF]/g, " ")
    .replace(/\s+/g, " ")
    .replace(/([।.!?])\s*/g, "$1 ")
    .trim();
}

function speakHindi(text: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel(); // stop any ongoing speech

  const utter = new SpeechSynthesisUtterance(makeSpeakFriendly(text));
  utter.lang  = "hi-IN";
  utter.rate  = 0.9;
  utter.pitch = 1.0;

  const voices = window.speechSynthesis.getVoices();
  const hindiVoice = pickBestHindiVoice(voices);
  if (hindiVoice) utter.voice = hindiVoice;

  window.speechSynthesis.speak(utter);
}

// Voices load async on mobile — wait for them then speak
function speakWhenReady(text: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    speakHindi(text);
  } else {
    window.speechSynthesis.onvoiceschanged = () => speakHindi(text);
  }
}

const cleanFeedbackForSpeech = makeSpeakFriendly;

// ─────────────────────────────────────────────
// Levenshtein distance
// ─────────────────────────────────────────────
function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
  return dp[m][n];
}

// ─────────────────────────────────────────────
// Pronunciation matching
// More generous: also checks partial phonetic matches
// ─────────────────────────────────────────────
function getPronunciationFeedback(heard: string[], targetWord: string, targetRoman: string) {
  const norm = (txt = "") =>
    txt.toLowerCase().replace(/[^a-z\u0900-\u097F]/g, "").trim();

  const normTarget = norm(targetWord);
  const normRoman  = norm(targetRoman);
  const normRomanLite = normRoman.replace(/(aa|ee|ii|oo|uu)/g, (m) => m[0]);
  const normAlts   = heard.map(norm).filter(Boolean);

  if (normAlts.length === 0)
    return { match: false, distance: 99, feedback: `❌ कुछ सुनाई नहीं दिया। फिर बोलो: "${targetWord}"` };

  // 1. Exact / substring match in Hindi or Roman
  const exactMatch = normAlts.some((t) =>
    t.includes(normTarget) ||
    t.includes(normRoman) ||
    t.includes(normRomanLite)
  );
  if (exactMatch) return { match: true, distance: 0, feedback: `🌟 बहुत बढ़िया! Perfect!` };

  // 2. Check each alt individually — pick the closest
  const allDistances = normAlts.flatMap((t) => {
    const tLite = t.replace(/(aa|ee|ii|oo|uu)/g, (m) => m[0]);
    return [
      levenshtein(t, normTarget),
      levenshtein(t, normRoman),
      levenshtein(tLite, normRomanLite),
    ];
  });
  const best = Math.min(...allDistances);

  // 3. Also try syllable-level: does any alt start with the same first 2 chars?
  const startsRight = normAlts.some(
    (t) => normRoman.length >= 2 && t.startsWith(normRoman.slice(0, 2))
  );

  if (best <= 1 || startsRight)
    return { match: false, distance: best, feedback: `🔶 लगभग सही! थोड़ा और कोशिश करो — "${targetWord}"` };
  if (best <= 3)
    return { match: false, distance: best, feedback: `🔁 Close! धीरे-धीरे बोलो: "${targetWord}"` };
  return { match: false, distance: best, feedback: `❌ फिर कोशिश करो! बोलो: "${targetWord}"` };
}

// ─────────────────────────────────────────────
// Word list
// ─────────────────────────────────────────────
const ALL_WORDS = [
  { word: "नमस्ते", hint: "🙏", pronunciation: "namaste" },
  { word: "पानी",   hint: "💧", pronunciation: "paani"   },
  { word: "खाना",  hint: "🍽️", pronunciation: "khana"   },
  { word: "माँ",   hint: "👩", pronunciation: "maa"     },
  { word: "घर",    hint: "🏠", pronunciation: "ghar"    },
  { word: "किताब", hint: "📚", pronunciation: "kitaab"  },
  { word: "दोस्त", hint: "🤝", pronunciation: "dost"    },
  { word: "स्कूल", hint: "🏫", pronunciation: "iskool"  },
  { word: "सेब",   hint: "🍎", pronunciation: "seb"     },
  { word: "रात",   hint: "🌙", pronunciation: "raat"    },
];

function pickWords() {
  return [...ALL_WORDS].sort(() => Math.random() - 0.5).slice(0, 5);
}

const RECORD_SECONDS = 6;

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────
export default function HindiSpeakingQuiz({ onComplete, onBack }) {
  const [quizWords]    = useState(() => pickWords());
  const [currentIndex, setCurrentIndex]           = useState(0);
  const [isRecording, setIsRecording]             = useState(false);
  const [liveTranscript, setLiveTranscript]       = useState("");
  const [result, setResult]                       = useState(null);
  const [score, setScore]                         = useState(0);
  const [showResult, setShowResult]               = useState(false);
  const [responses, setResponses]                 = useState([]);
  const [countdown, setCountdown]                 = useState(0);
  const [aiFeedback, setAiFeedback]               = useState<string | null>(null);
  const [aiFeedbackLoading, setAiFeedbackLoading] = useState(false);
  const [locked, setLocked]                       = useState(false);

  // DEBUG — every important event gets pushed here and shown on screen
  const [debugLog, setDebugLog]                   = useState<string[]>([]);
  const addLog = (msg: string) => {
    const ts = new Date().toLocaleTimeString("en-IN", { hour12: false });
    setDebugLog((prev) => [`[${ts}] ${msg}`, ...prev].slice(0, 30));
  };

  const currentIndexRef = useRef(0);
  const quizWordsRef    = useRef(quizWords);
  const getCurrentWord  = () => quizWordsRef.current[currentIndexRef.current];

  const recognitionRef       = useRef<any>(null);
  const recordingTimeoutRef  = useRef<any>(null);
  const countdownIntervalRef = useRef<any>(null);
  const lastHeardAltsRef     = useRef<string[]>([]);
  const evaluatedRef         = useRef(false);
  const spokenFeedbackRef    = useRef<string>("");

  // ── Create recognition ONCE on mount ─────────
  useEffect(() => {
    addLog("Component mounted");

    const SpeechRecognition =
      typeof window !== "undefined" &&
      ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);

    if (!SpeechRecognition) {
      addLog("❌ SpeechRecognition NOT available on this browser/device");
      return;
    }

    addLog("✅ SpeechRecognition available");

    const reco = new SpeechRecognition();
    reco.lang            = "hi-IN";
    reco.continuous      = true;
    reco.interimResults  = true;
    reco.maxAlternatives = 10;

    reco.onstart = () => addLog("🎙️ mic started");

    reco.onresult = (event) => {
      if (evaluatedRef.current) {
        addLog("onresult fired but already evaluated — ignored");
        return;
      }

      const mergedAlts: string[] = [];
      let isFinal = false;
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        isFinal = isFinal || result.isFinal;
        Array.from(result).forEach((r: any) => {
          const t = (r?.transcript || "").trim();
          if (t) mergedAlts.push(t);
        });
      }

      const uniqueAlts = Array.from(new Set(mergedAlts));
      addLog(`onresult isFinal=${isFinal} alts=${JSON.stringify(uniqueAlts)}`);

      if (uniqueAlts.length > 0) {
        lastHeardAltsRef.current = uniqueAlts;
        setLiveTranscript(uniqueAlts[0]);
      }

      if (isFinal) {
        evaluatedRef.current = true;
        stopTimers();
        setIsRecording(false);
        setLiveTranscript("");
        runEvaluate(alts);
      }
    };

    reco.onnomatch = () => addLog("⚠️ onnomatch fired — nothing matched");

    reco.onerror = (e: any) => {
      addLog(`❌ onerror: ${e.error} — ${e.message || "no message"}`);
      if (evaluatedRef.current) return;
      stopTimers();
      setIsRecording(false);
      setLiveTranscript("");
      if (e.error === "no-speech") {
        setResult({ success: false, message: "🔊 ज़ोर से बोलो! माइक्रोफ़ोन सुन नहीं पाया!" });
      } else if (e.error === "not-allowed") {
        setResult({ success: false, message: "🚫 Mic permission denied. Please allow microphone access." });
      } else if (e.error === "network") {
        setResult({ success: false, message: "📶 Network error. SpeechRecognition needs internet on some devices." });
      } else {
        setResult({ success: false, message: `⚠️ Mic error: ${e.error}` });
      }
    };

    reco.onend = () => {
      addLog("onend fired");
      setIsRecording(false);
    };

    if ((window as any).SpeechGrammarList || (window as any).webkitSpeechGrammarList) {
      try {
        const Grammar = (window as any).SpeechGrammarList || (window as any).webkitSpeechGrammarList;
        const list = new Grammar();
        const vocab = ALL_WORDS.map((w) => w.word).join(" | ");
        const jsgf = `#JSGF V1.0; grammar words; public <word> = ${vocab} ;`;
        list.addFromString(jsgf, 1);
        reco.grammars = list;
        addLog("✅ Grammar hints attached");
      } catch (e: any) {
        addLog(`Grammar attach failed: ${e?.message || e}`);
      }
    }

    recognitionRef.current = reco;
    addLog("Recognition object created");

    // Pre-load voices for TTS
    if (window.speechSynthesis) {
      const v = window.speechSynthesis.getVoices();
      addLog(`TTS voices available: ${v.length} (${v.filter(x=>x.lang.startsWith("hi")).map(x=>x.name).join(", ") || "none Hindi"})`);
    }

    return () => {
      addLog("Cleanup: aborting recognition");
      reco.abort();
      stopTimers();
    };
  }, []);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  useEffect(() => {
    if (!locked || aiFeedbackLoading || !aiFeedback) return;
    if (spokenFeedbackRef.current === aiFeedback) return;

    const feedbackToSpeak = cleanFeedbackForSpeech(aiFeedback);
    if (!feedbackToSpeak) return;

    spokenFeedbackRef.current = aiFeedback;
    addLog(`TTS: speaking AI feedback "${feedbackToSpeak.slice(0, 80)}..."`);
    speakWhenReady(feedbackToSpeak);
  }, [locked, aiFeedbackLoading, aiFeedback]);

  // ── Timer helpers ─────────────────────────────
  const stopTimers = () => {
    clearTimeout(recordingTimeoutRef.current);
    clearInterval(countdownIntervalRef.current);
    setCountdown(0);
  };

  const stopRecording = useCallback(() => {
    stopTimers();
    setIsRecording(false);
    setLiveTranscript("");
    try { recognitionRef.current?.stop(); } catch (e) { addLog(`stopRecording error: ${e}`); }
  }, []);

  // ── Evaluate ──────────────────────────────────
  const runEvaluate = useCallback((heard: string[]) => {
    const word = getCurrentWord();
    addLog(`runEvaluate word="${word.word}" heard=${JSON.stringify(heard)}`);

    const { match, distance, feedback } = getPronunciationFeedback(
      heard, word.word, word.pronunciation
    );

    addLog(`result: match=${match} distance=${distance} feedback="${feedback}"`);

    if (match) setScore((s) => s + 1);
    setResult({ success: match, message: feedback, heard: heard[0] || "" });
    setResponses((p) => [...p, { word: word.word, heard: heard[0] || "", success: match }]);
    setLocked(true);

    callAIAnalysis({
      word,
      heard: heard[0] || "",
      allHeard: heard,
      success: match,
      levenshteinDistance: distance,
    });
  }, []);

  // ── AI call ───────────────────────────────────
  const callAIAnalysis = async ({ word, heard, allHeard, success, levenshteinDistance }) => {
    addLog(`AI call start — word="${word.word}" heard="${heard}" success=${success}`);
    setAiFeedbackLoading(true);
    setAiFeedback(null);

    try {
      const res = await fetch("/api/speak-quiz-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          word: word.word,
          pronunciation: word.pronunciation,
          heard,
          allHeard,
          success,
          levenshteinDistance,
        }),
      });

      addLog(`AI response status: ${res.status}`);
      const data = await res.json();
      addLog(`AI data keys: ${Object.keys(data).join(", ")}`);
      addLog(`AI feedback: "${String(data.feedback).slice(0, 80)}..."`);

      if (data.feedback) {
        setAiFeedback(data.feedback);
      } else {
        addLog("⚠️ No feedback field in AI response");
        setAiFeedback("(AI returned no feedback — check API route)");
      }
    } catch (err: any) {
      addLog(`❌ AI fetch error: ${err?.message}`);
      setAiFeedback(`⚠️ AI error: ${err?.message}`);
    } finally {
      setAiFeedbackLoading(false);
    }
  };

  // ── Try Again (same word, fresh attempt) ──────
  const tryAgain = () => {
    setResult(null);
    setAiFeedback(null);
    setLiveTranscript("");
    setLocked(false);
    spokenFeedbackRef.current = "";
    evaluatedRef.current     = false;
    lastHeardAltsRef.current = [];
    addLog("Try again — reset for same word");
  };

  // ── Record button ─────────────────────────────
  const recordSpeech = () => {
    if (locked) {
      addLog("recordSpeech called but locked — ignored");
      return;
    }

    if (!recognitionRef.current) {
      addLog("❌ recognitionRef is null — mic not supported");
      alert(
        location.protocol === "http:"
          ? "Mic requires HTTPS. Open this page over https:// on your phone."
          : "Mic not supported in this browser"
      );
      return;
    }

    // Tap to stop mid-recording
    if (isRecording) {
      addLog("Manual stop mid-recording");
      evaluatedRef.current = true;
      stopRecording();
      if (lastHeardAltsRef.current.length > 0) {
        runEvaluate(lastHeardAltsRef.current);
      } else {
        setResult({ success: false, message: "⏱️ Nothing heard — tap again and speak louder!" });
      }
      return;
    }

    // Start fresh attempt
    addLog(`Starting recording for "${getCurrentWord().word}"`);
    evaluatedRef.current     = false;
    lastHeardAltsRef.current = [];
    setResult(null);
    setAiFeedback(null);
    setLiveTranscript("");
    setIsRecording(true);
    setCountdown(RECORD_SECONDS);

    const startRecognition = () => {
      try {
        recognitionRef.current.start();
        addLog("recognition.start() called");
      } catch (e: any) {
        addLog(`start() threw: ${e?.message} — retrying after abort`);
        recognitionRef.current.abort();
        setTimeout(() => {
          try {
            recognitionRef.current.start();
            addLog("retry start() OK");
          } catch (e2: any) {
            addLog(`retry start() also failed: ${e2?.message}`);
          }
        }, 300);
      }
    };

    if (navigator?.mediaDevices?.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({
          audio: { noiseSuppression: true, echoCancellation: true, autoGainControl: true },
        })
        .then((stream) => {
          stream.getTracks().forEach((t) => t.stop());
          addLog("✅ Mic warm-up with noise suppression");
          startRecognition();
        })
        .catch((e) => {
          addLog(`Mic warm-up skipped: ${e?.message || e}`);
          startRecognition();
        });
    } else {
      startRecognition();
    }

    countdownIntervalRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) { clearInterval(countdownIntervalRef.current); return 0; }
        return c - 1;
      });
    }, 1000);

    recordingTimeoutRef.current = setTimeout(() => {
      if (evaluatedRef.current) {
        addLog("Timeout fired but already evaluated — skipping");
        return;
      }
      addLog(`Timeout reached. alts captured: ${JSON.stringify(lastHeardAltsRef.current)}`);
      evaluatedRef.current = true;
      stopRecording();

      if (lastHeardAltsRef.current.length > 0) {
        runEvaluate(lastHeardAltsRef.current);
      } else {
        setResult({ success: false, message: "⏱️ Time's up! Nothing heard — tap to try again!" });
        addLog("Nothing heard — not locking so user can retry");
      }
    }, RECORD_SECONDS * 1000);
  };

  // ── Next word ─────────────────────────────────
  const nextWord = () => {
    const next = currentIndex + 1;
    addLog(`nextWord: moving to index ${next}`);
    if (next < quizWords.length) {
      setCurrentIndex(next);
      setResult(null);
      setAiFeedback(null);
      setLiveTranscript("");
      setLocked(false);
      spokenFeedbackRef.current = "";
      evaluatedRef.current     = false;
      lastHeardAltsRef.current = [];
    } else {
      setShowResult(true);
      onComplete?.({ score, attempts: responses });
    }
  };

  const word = quizWords[currentIndex];

  // ── Quiz Completed ────────────────────────────
  if (showResult) {
    return (
      <div className="max-w-md mx-auto text-center bg-white rounded-3xl shadow-lg p-8">
        <h2 className="text-3xl mb-3">🎤 Speaking Test Done!</h2>
        <p className="text-gray-700 mb-6">Score: {score}/{quizWords.length}</p>
        <Button className="bg-purple-500 text-white w-full rounded-xl mb-4"
          onClick={() => window.location.reload()}>
          🔁 फिर से
        </Button>
        <Button variant="outline" className="w-full rounded-xl" onClick={onBack}>
          ⬅️ वापस
        </Button>
      </div>
    );
  }

  // ── Speaking UI ───────────────────────────────
  return (
    <motion.div className="max-w-lg mx-auto pb-8">

      {/* Progress dots */}
      <div className="flex justify-center gap-2 mb-4">
        {quizWords.map((_, i) => (
          <div key={i} className={`h-2 rounded-full transition-all duration-300 ${
            i < currentIndex   ? "bg-green-400 w-6"  :
            i === currentIndex ? "bg-purple-400 w-6" : "bg-gray-200 w-4"
          }`} />
        ))}
      </div>

      {/* Word card */}
      <div className="bg-white rounded-3xl shadow-lg p-6 mb-4">
        <h2 className="text-xl text-center font-bold mb-6">यह शब्द बोलो 🎤</h2>
        <div className="text-center mb-6">
          <motion.div key={word.word} className="text-8xl mb-3"
            animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
            {word.hint}
          </motion.div>
          <h3 className="text-4xl font-bold">{word.word}</h3>
          <p className="text-sm text-gray-400 mt-1">{word.pronunciation}</p>
        </div>

        {/* Listen button — uses our better TTS */}
        <Button variant="outline" className="w-full mb-4"
          onClick={() => { addLog(`TTS: speaking "${word.word}"`); speakWhenReady(word.word); }}>
          <Volume2 className="mr-2" /> पहले सुनो
        </Button>

        {/* Record button */}
        <motion.button onClick={recordSpeech} disabled={locked}
          className={`w-full py-6 rounded-2xl text-white font-bold text-lg transition-colors duration-200 ${
            locked      ? "bg-gray-300 cursor-not-allowed" :
            isRecording ? "bg-red-500"                     :
                          "bg-gradient-to-r from-pink-400 to-purple-500"
          }`}>
          {isRecording ? `🎙️ बोलो... ${countdown}s` :
           locked       ? "नीचे देखो 👇"             :
                          "बोलने के लिए टैप करें"}
        </motion.button>

        {/* Countdown bar */}
        {isRecording && (
          <div className="mt-3 w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <motion.div className="bg-red-400 h-2 rounded-full"
              initial={{ width: "100%" }} animate={{ width: "0%" }}
              transition={{ duration: RECORD_SECONDS, ease: "linear" }} />
          </div>
        )}
      </div>

      {/* Live transcript while speaking */}
      <AnimatePresence>
        {isRecording && liveTranscript !== "" && (
          <motion.div key="live" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="p-3 rounded-xl bg-blue-50 border border-blue-100 text-center mb-3">
            <p className="text-xs text-blue-400 mb-1">🎧 सुन रहे हैं...</p>
            <p className="text-base font-semibold text-blue-700">{liveTranscript}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Final result */}
      <AnimatePresence>
        {result && (
          <motion.div key="result" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className={`p-4 rounded-xl text-center mb-3 ${result.success ? "bg-green-100" : "bg-yellow-100"}`}>
            <p className="font-semibold text-lg">{result.message}</p>
            {result.heard && (
              <p className="text-xs opacity-60 mt-1">🗣 आपने बोला: &quot;{result.heard}&quot;</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI loading spinner */}
      <AnimatePresence>
        {aiFeedbackLoading && (
          <motion.div key="ai-loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="p-4 rounded-xl bg-purple-50 border border-purple-100 text-center mb-3">
            <p className="text-sm text-purple-400 animate-pulse">🤖 Coach सोच रहा है...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI feedback + Try Again + Next — all shown together after AI responds */}
      <AnimatePresence>
        {locked && !aiFeedbackLoading && (
          <motion.div key="ai-done" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>

            {/* AI Coach — each line as its own coloured point */}
            {aiFeedback && (() => {
              const lines = aiFeedback
                .split("\n")
                .map((l) => l.trim())
                .filter((l) => l.length > 0);
              const feedbackToSpeak = cleanFeedbackForSpeech(aiFeedback);

              const styleFor = (line) => {
                if (line.startsWith("👂")) return { bg: "bg-blue-50",   border: "border-blue-200",   text: "text-blue-900"   };
                if (line.startsWith("🔤")) return { bg: "bg-yellow-50", border: "border-yellow-200", text: "text-yellow-900" };
                if (line.startsWith("💡")) return { bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-900" };
                if (line.startsWith("🌟")) return { bg: "bg-green-50",  border: "border-green-200",  text: "text-green-900"  };
                return                           { bg: "bg-purple-50",  border: "border-purple-200", text: "text-purple-900" };
              };

              return (
                <div className="mb-4 space-y-2">
                  <p className="text-xs font-semibold text-purple-400 mb-2 px-1">🤖 Coach कहता है</p>
                  {lines.map((line, i) => {
                    const s = styleFor(line);
                    return (
                      <div key={i} className={"flex items-start p-3 rounded-xl border " + s.bg + " " + s.border}>
                        <p className={"text-sm leading-relaxed w-full " + s.text}>{line}</p>
                      </div>
                    );
                  })}
                  {feedbackToSpeak && (
                    <Button
                      variant="outline"
                      className="w-full mt-2"
                      onClick={() => {
                        addLog(`TTS: replaying AI feedback "${feedbackToSpeak.slice(0, 80)}..."`);
                        speakWhenReady(feedbackToSpeak);
                      }}
                    >
                      <Volume2 className="mr-2" /> सुनो फिर से
                    </Button>
                  )}
                </div>
              );
            })()}

            {/* Try Again button — lets user redo the same word */}
            {!result?.success && (
              <Button variant="outline"
                className="w-full mb-3 border-yellow-300 text-yellow-700 hover:bg-yellow-50"
                onClick={tryAgain}>
                🔄 Try Again — फिर बोलो
              </Button>
            )}

            {/* Next / Finish */}
            <Button className="w-full bg-green-500 text-white text-lg py-4 rounded-2xl" onClick={nextWord}>
              {currentIndex < quizWords.length - 1 ? "अगला शब्द ➜" : "🏁 Results देखो"}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── DEBUG PANEL — visible on screen for mobile testing ── */}
      {/* <div className="mt-6 p-3 bg-gray-900 rounded-2xl">
        <p className="text-xs text-gray-400 font-mono mb-2 font-bold">🐛 DEBUG LOG</p>
        <div className="max-h-48 overflow-y-auto space-y-1">
          {debugLog.length === 0 && (
            <p className="text-xs text-gray-500 font-mono">No events yet...</p>
          )}
          {debugLog.map((entry, i) => (
            <p key={i} className="text-xs text-green-400 font-mono break-all leading-relaxed">
              {entry}
            </p>
          ))}
        </div>
      </div> */}

    </motion.div>
  );
}