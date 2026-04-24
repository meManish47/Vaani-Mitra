"use client";
import HindiListeningQuiz from "@/app/components/quiz/HindiListeningQuiz";
import HindiSpeakingQuiz from "@/app/components/quiz/HindiSpeakingQuiz";
import React, { useState, useEffect } from "react";
/*
  Replacements for external deps so the page builds and runs without changing logic/styles:
  - base44 => small runtime mock that returns a local user and sample progress
  - useQuery => replaced by a useEffect that fetches progress once user is loaded
  - framer-motion => minimal motion shim exposing div/button as components (no animation)
  - lucide-react icons => tiny inline components returning simple SVG/emoji
  - Button, Mascot, HindiListeningQuiz, HindiSpeakingQuiz => small local components preserving the same props/API
*/

// --- small base44 mock (runtime only) ---
const base44 = {
  auth: {
    me: async () => {
      // simulate network delay
      await new Promise((r) => setTimeout(r, 80));
      return { id: "local-user-1", username: "local", name: "Local User" };
    },
  },
  entities: {
    UserProgress: {
      filter: async ({ user_id }: { user_id: string }) => {
        // return a sample progress object similar to what the original expected
        await new Promise((r) => setTimeout(r, 80));
        return [
          {
            total_stars: 12,
            current_streak: 3,
            quizzes_completed: 4,
          },
        ];
      },
    },
  },
};

// --- motion shim (keeps same JSX usage but no animations) ---
const motion: any = {
  div: (props: any) => <div {...props}>{props.children}</div>,
  button: (props: any) => <button {...props}>{props.children}</button>,
};

// --- small icon placeholders (Headphones, Mic, Star, Zap, Trophy, ArrowLeft) ---
const Headphones = (p: any) => <span {...p}>🎧</span>;
const Mic = (p: any) => <span {...p}>🎤</span>;
const Star = (p: any) => <span {...p}>⭐</span>;
const Zap = (p: any) => <span {...p}>⚡</span>;
const Trophy = (p: any) => <span {...p}>🏆</span>;
const ArrowLeft = (p: any) => <span {...p}>⬅️</span>;

// --- local Button component that preserves variant prop and className usage ---
function Button({
  children,
  className = "",
  onClick,
  variant,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: string;
}) {
  const base = "px-4 py-2 rounded-lg inline-flex items-center justify-center";
  const ghost = variant === "ghost" ? "bg-transparent" : "";
  return (
    <button onClick={onClick} className={`${base} ${ghost} ${className}`}>
      {children}
    </button>
  );
}

// --- Mascot shim ---
function Mascot({
  size = "medium",
  message = "",
  mood = "neutral",
}: {
  size?: string;
  message?: string;
  mood?: string;
}) {
  const sizes: Record<string, string> = {
    small: "w-12 h-12",
    medium: "w-16 h-16",
    large: "w-20 h-20",
  };
  return (
    <div className="flex items-center gap-3">
      <div
        className={`rounded-full bg-white/80 flex items-center justify-center shadow ${
          sizes[size] || sizes.medium
        }`}
      >
        <span className="text-2xl">🙂</span>
      </div>
      <div>
        <div className="font-semibold">{message}</div>
        <div className="text-xs text-gray-500">{mood}</div>
      </div>
    </div>
  );
}

// --- Small quiz components that follow the original API (onComplete, onBack) ---
// function HindiListeningQuiz({
//   onComplete,
//   onBack,
// }: {
//   onComplete?: () => void;
//   onBack?: () => void;
// }) {
//   return (
//     <div className="p-4 bg-white rounded-xl border">
//       <h3 className="text-xl font-bold mb-2">Listening Quiz (demo)</h3>
//       <p className="text-sm text-gray-600 mb-4">
//         This is a lightweight local implementation for build/run.
//       </p>
//       <div className="flex gap-2">
//         <Button onClick={() => onBack && onBack()} className="bg-gray-100">
//           Back
//         </Button>
//         <Button
//           onClick={() => onComplete && onComplete()}
//           className="bg-green-500 text-white"
//         >
//           Finish Quiz
//         </Button>
//       </div>
//     </div>
//   );
// }

// function HindiSpeakingQuiz({
//   onComplete,
//   onBack,
// }: {
//   onComplete?: () => void;
//   onBack?: () => void;
// }) {
//   return (
//     <div className="p-4 bg-white rounded-xl border">
//       <h3 className="text-xl font-bold mb-2">Speaking Quiz (demo)</h3>
//       <p className="text-sm text-gray-600 mb-4">
//         This is a lightweight local implementation for build/run.
//       </p>
//       <div className="flex gap-2">
//         <Button onClick={() => onBack && onBack()} className="bg-gray-100">
//           Back
//         </Button>
//         <Button
//           onClick={() => onComplete && onComplete()}
//           className="bg-green-500 text-white"
//         >
//           Finish Quiz
//         </Button>
//       </div>
//     </div>
//   );
// }

// --- Page component (keeps original structure, styles & logic) ---
type UserType = { id: string; username?: string; name?: string } | null;
type ProgressType = {
  total_stars?: number;
  current_streak?: number;
  quizzes_completed?: number;
} | null;

export default function Quiz() {
  const [selectedQuiz, setSelectedQuiz] = useState<string | null>(null);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);

  const [user, setUser] = useState<any>(null);
  const [progress, setProgress] = useState<any>(null);

  useEffect(() => {
    const loadUser = async () => {
      const userData = await base44.auth.me();
      setUser(userData);
    };
    loadUser();
  }, []);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!user) return;
      const progressList = await base44.entities.UserProgress.filter({
        user_id: user.id,
      });
      setProgress(progressList[0]);
    };
    fetchProgress();
  }, [user]);

  const handleListeningComplete = async (results: any) => {
    setSelectedQuiz(null);
    try {
      const res = await fetch("/api/hindi-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(results),
      });

      const data = await res.json();
      // console.log("AI Analysis Data:", data);
      if (data.status == 401) {
        setAiFeedback("⚠️ Unauthorized. Please log in to get AI feedback.");
        return;
      }
      setAiFeedback(data.feedback);
    } catch {
      setAiFeedback("⚠️ AI analysis unavailable. Try again later!");
    }
  };

  const quizTypes = [
    {
      id: "listening",
      title: "Listening Quiz",
      description: "Listen and choose the correct answer!",
      icon: Headphones,
      emoji: "🎧",
      color: "from-sky-400 to-blue-500",
      bgColor: "bg-sky-50",
      borderColor: "border-sky-200",
    },
    {
      id: "speaking",
      title: "Speaking Quiz",
      description: "Say the word and get a score!",
      icon: Mic,
      emoji: "🎤",
      color: "from-pink-400 to-purple-500",
      bgColor: "bg-pink-50",
      borderColor: "border-pink-200",
    },
  ];

  if (selectedQuiz === "listening") {
    return (
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => setSelectedQuiz(null)}
          className="mb-6 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Quiz Menu
        </Button>

        <HindiListeningQuiz
          onComplete={handleListeningComplete}
          onBack={() => setSelectedQuiz(null)}
        />
      </div>
    );
  }

  if (selectedQuiz === "speaking") {
    return (
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => setSelectedQuiz(null)}
          className="mb-6 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Quiz Menu
        </Button>
        <HindiSpeakingQuiz
          onComplete={() => setSelectedQuiz(null)}
          onBack={() => setSelectedQuiz(null)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
        <Mascot
          size="medium"
          message="Quiz time! Let's go! 🚀"
          mood="excited"
        />
        <div className="text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Quiz Time! 🧠
          </h1>
          <p className="text-gray-600">
            Test what you&apos;ve learned and earn stars!
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      {progress && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          <motion.div
            className="bg-yellow-50 rounded-2xl p-4 text-center border border-yellow-200"
            whileHover={{ scale: 1.02 }}
          >
            <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-800">
              {progress.total_stars || 0}
            </p>
            <p className="text-sm text-gray-600">Stars</p>
          </motion.div>

          <motion.div
            className="bg-orange-50 rounded-2xl p-4 text-center border border-orange-200"
            whileHover={{ scale: 1.02 }}
          >
            <Zap className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-800">
              {progress.current_streak || 0}
            </p>
            <p className="text-sm text-gray-600">Day Streak</p>
          </motion.div>

          <motion.div
            className="bg-purple-50 rounded-2xl p-4 text-center border border-purple-200"
            whileHover={{ scale: 1.02 }}
          >
            <Trophy className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-800">
              {progress.quizzes_completed || 0}
            </p>
            <p className="text-sm text-gray-600">Quizzes</p>
          </motion.div>
        </div>
      )}

      {/* Quiz Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quizTypes.map((quiz, index) => (
          <motion.div
            key={quiz.id}
            onClick={() => setSelectedQuiz(quiz.id)}
            className={`
              ${quiz.bgColor} rounded-3xl p-6 md:p-8 cursor-pointer 
              border-2 ${quiz.borderColor} hover:border-transparent
              transition-all duration-300 hover:shadow-xl
            `}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Icon */}
            <motion.div
              className={`
                w-24 h-24 mx-auto mb-6 rounded-3xl 
                bg-gradient-to-br ${quiz.color}
                flex items-center justify-center shadow-lg
              `}
              animate={{
                y: [0, -5, 0],
                rotate: [0, 2, -2, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: index * 0.5,
              }}
            >
              <span className="text-5xl">{quiz.emoji}</span>
            </motion.div>

            {/* Content */}
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-3">
              {quiz.title}
            </h2>
            <p className="text-gray-600 text-center mb-6">{quiz.description}</p>

            {/* Start Button */}
            <motion.button
              className={`
                w-full py-4 rounded-xl bg-gradient-to-r ${quiz.color}
                text-white font-bold text-lg shadow-md
                hover:shadow-lg transition-shadow
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Start Quiz →
            </motion.button>
          </motion.div>
        ))}
      </div>

      {/* Tips Section */}
      <motion.div
        className="mt-8 bg-gradient-to-r from-purple-100 to-pink-100 rounded-3xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-start gap-4">
          <span className="text-3xl">💡</span>
          <div>
            <h3 className="font-bold text-gray-800 mb-1">Quiz Tips</h3>
            <ul className="text-gray-600 text-sm space-y-1">
              <li>• Listen carefully before answering</li>
              <li>• Speak slowly and clearly</li>
              <li>• Don&apos;t worry about mistakes - keep trying!</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
