"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, Check, X, RotateCcw } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { speak } from "@/app/components/shared/Speak";

const QUIZ_QUESTIONS = [
  { word: "नमस्ते", options: ["नमस्ते", "धन्यवाद", "अलविदा", "क्षमा"], correct: 0 },
  { word: "पानी", options: ["खाना", "पानी", "दूध", "चाय"], correct: 1 },
  { word: "सूरज", options: ["चाँद", "तारे", "सूरज", "बादल"], correct: 2 },
  { word: "किताब", options: ["कलम", "कागज़", "कॉपी", "किताब"], correct: 3 },
  { word: "फूल", options: ["फूल", "पत्ता", "पेड़", "घास"], correct: 0 },
];

type Props = {
  onBack?: () => void;
  onComplete?: (score: number, total: number) => void;
};

export default function HindiListeningQuiz({ onBack, onComplete }: Props) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [week, setweek] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [responses, setResponses] = useState<{ word: string; selected: string; correct: boolean }[]>([]);

  const question = QUIZ_QUESTIONS[currentQuestion];

  const playWord = async () => {
    setHasPlayed(true);
    await speak(question.word);
  };

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;

    const correct = index === question.correct;
    setSelectedAnswer(index);
    setIsCorrect(correct);
    if (correct) setScore(score + 1);

    setResponses(prev => [...prev, { word: question.word, selected: question.options[index], correct }]);

    setTimeout(() => {
      if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
        setHasPlayed(false);
      } else {
        setShowResult(true);
      }
    }, 1300);
  };

  const analyzeWithAI = async () => {
    setLoading(true);

    const payload = {
      score,
      total: QUIZ_QUESTIONS.length,
      correctWords: responses.filter(r => r.correct),
      wrongWords: responses.filter(r => !r.correct),
      detailed: responses,
    };

    try {
      const res = await fetch("/api/hindi-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("AI Analysis Response:", data);
      console.log("AI Feedback:", data.feedback);
      setAnalysis(data.feedback);
      setweek(data.weakPhonemes);
    } catch (err) {
      console.error("AI Feedback Error:", err);
      setAnalysis("⚠️ AI couldn't analyze. Try again later!");
    } finally {
      setLoading(false);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setScore(0);
    setResponses([]);
    setHasPlayed(false);
    setShowResult(false);
    setAnalysis(null);
  };

  // -------------------------- RESULT SCREEN --------------------------
  if (showResult) {
    return (
      <motion.div className="max-w-md mx-auto text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="bg-white rounded-3xl p-8 shadow-lg">
          <motion.div className="text-7xl mb-4" animate={{ scale: [1, 1.2, 1] }}>
            {score >= 4 ? "🏆" : score >= 2 ? "🌟" : "💪"}
          </motion.div>

          <h2 className="text-2xl font-bold text-gray-800 mb-2">Quiz Completed 🎉</h2>
          <p className="text-gray-600 mb-6">
            You scored <b>{score}</b> out of {QUIZ_QUESTIONS.length}
          </p>

          {!analysis && (
            <Button
              onClick={analyzeWithAI}
              disabled={loading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-400 to-purple-500 text-white"
            >
              {loading ? "🔄 Analyzing..." : "🧠 Get Feedback"}
            </Button>
          )}

          {analysis && (
            <motion.div
              className="bg-yellow-50 border border-yellow-300 rounded-2xl p-4 mt-5 text-gray-700 text-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h3 className="font-bold text-lg mb-2">🧠 AI Feedback</h3>
              <p className="whitespace-pre-line font-semibold text-gray-800">{analysis}</p>
              <p className="whitespace-pre-line font-semibold text-gray-800">{}</p>
            </motion.div>
          )}

          <div className="flex gap-3 justify-center mt-6">
            <Button variant="outline" onClick={onBack}>Back</Button>
            <Button className="bg-purple-500 text-white" onClick={restartQuiz}>
              <RotateCcw className="w-4 h-4 mr-1" /> Retry
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  // ------------------------- QUIZ UI -------------------------
  return (
    <motion.div className="max-w-lg mx-auto" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      {/* Progress */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-gray-600">Q {currentQuestion + 1}/{QUIZ_QUESTIONS.length}</span>
        <div className="flex gap-1">
          {QUIZ_QUESTIONS.map((_, i) => (
            <div key={i} className={`w-8 h-2 rounded-full ${i < currentQuestion ? "bg-green-400" : i === currentQuestion ? "bg-purple-400" : "bg-gray-200"}`} />
          ))}
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-3xl p-6 shadow-md">
        <h2 className="text-xl text-center font-bold mb-6">Listen & Choose 👂</h2>

        <motion.button
          onClick={playWord}
          className="w-full py-6 rounded-2xl bg-gradient-to-r from-sky-300 to-purple-500 text-white mb-6 shadow-lg"
        >
          <Volume2 className="w-10 h-10 mx-auto" />
          <p className="text-sm mt-1">{hasPlayed ? "Tap to Replay" : "Tap to Listen"}</p>
        </motion.button>

        <div className="grid grid-cols-2 gap-3">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrectAns = index === question.correct;

            return (
              <motion.button
                key={index}
                disabled={!hasPlayed || selectedAnswer !== null}
                onClick={() => handleAnswer(index)}
                className={`p-4 rounded-2xl border-2 text-lg font-semibold
                ${ selectedAnswer !== null ?
                  (isCorrectAns ? "bg-green-100 border-green-400" : (isSelected ? "bg-red-100 border-red-400" : "bg-gray-50 border-gray-200"))
                  : "bg-gray-50 border-gray-200"
                }`}>
                <div className="flex justify-between items-center">
                  <span>{option}</span>
                  {selectedAnswer !== null && isCorrectAns && <Check className="w-5 h-5 text-green-600" />}
                  {selectedAnswer !== null && isSelected && !isCorrectAns && <X className="w-5 h-5 text-red-600" />}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Mini feedback popup */}
      <AnimatePresence>
        {isCorrect !== null && (
          <motion.div className={`mt-3 text-center p-3 rounded-xl font-semibold
          ${isCorrect ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            {isCorrect ? "✨ Correct!" : "Oops! Try next one 😊"}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
