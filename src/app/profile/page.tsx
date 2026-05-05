"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, Zap, Trophy, Target, Mic, BookOpen, TrendingUp } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import Footer from "@/app/components/Footer";
import api from "@/lib/apiClient";
import { useRouter } from "next/navigation";

const AVATARS = [
  { id: "bunny",   emoji: "🐰", name: "Bunny" },
  { id: "bear",    emoji: "🐻", name: "Bear" },
  { id: "cat",     emoji: "🐱", name: "Kitty" },
  { id: "dog",     emoji: "🐶", name: "Puppy" },
  { id: "unicorn", emoji: "🦄", name: "Unicorn" },
  { id: "panda",   emoji: "🐼", name: "Panda" },
  { id: "lion",    emoji: "🦁", name: "Lion" },
  { id: "owl",     emoji: "🦉", name: "Owl" },
];

function StatCard({ icon: Icon, label, value, color, bg, suffix = "" }: any) {
  return (
    <motion.div
      className={`${bg} rounded-2xl p-4 text-center shadow border`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.03 }}
    >
      <Icon className={`w-8 h-8 mx-auto mb-2 ${color}`} />
      <p className="text-2xl font-bold text-gray-800">{value}{suffix}</p>
      <p className="text-sm text-gray-600">{label}</p>
    </motion.div>
  );
}

function PhonemeBar({ phoneme, mistakes, attempts, accuracy }: any) {
  const pct = Math.max(0, Math.min(100, 100 - accuracy));
  return (
    <div className="flex items-center gap-3">
      <span className="w-8 text-center text-xl font-bold text-gray-700">{phoneme}</span>
      <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
        <motion.div
          className="h-3 rounded-full bg-gradient-to-r from-red-400 to-orange-400"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
      <span className="text-xs text-gray-500 w-16 text-right">{mistakes} miss ({accuracy}% acc)</span>
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser]           = useState<any>(null);
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading]     = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState("bunny");

  useEffect(() => {
    async function fetchAll() {
      try {
        const [userRes, dashRes] = await Promise.allSettled([
          api.get("/api/users/current-user"),
          api.get("/api/dashboard"),
        ]);

        if (userRes.status === "fulfilled") {
          setUser(userRes.value.data.user);
        }
        if (dashRes.status === "fulfilled") {
          setDashboard(dashRes.value.data);
        }
      } catch (err) {
        console.error("Error fetching profile data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  const logout = async () => {
    try {
      await api.get("/api/users/logout");
      router.push("/");
    } catch (e) {
      console.error(e);
    }
  };

  const currentAvatar = AVATARS.find((a) => a.id === selectedAvatar) || AVATARS[0];

  // Build stats from real dashboard data or loading placeholders
  const stats = [
    {
      icon: Star,
      label: "Total Stars",
      value: loading ? "—" : (dashboard?.totalStars ?? 0),
      color: "text-yellow-500",
      bg: "bg-yellow-50",
    },
    {
      icon: Zap,
      label: "Day Streak",
      value: loading ? "—" : (dashboard?.streak ?? 0),
      color: "text-orange-500",
      bg: "bg-orange-50",
      suffix: "🔥",
    },
    {
      icon: Trophy,
      label: "Level",
      value: loading ? "—" : (dashboard?.level ?? 1),
      color: "text-purple-500",
      bg: "bg-purple-50",
    },
    {
      icon: Target,
      label: "XP Points",
      value: loading ? "—" : (dashboard?.xp ?? 0),
      color: "text-green-500",
      bg: "bg-green-50",
    },
  ];

  return (
    <div>
      <div className="max-w-4xl mx-auto pt-10 pb-20 px-4">

        {/* ── Profile Header ──────────────────────────── */}
        <motion.div
          className="bg-gradient-to-br from-purple-100 via-pink-100 to-sky-100 rounded-3xl p-6 md:p-8 mb-8 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar picker */}
            <div className="relative">
              <motion.div
                className="w-32 h-32 bg-white rounded-full shadow-xl flex items-center justify-center text-6xl border-4 border-white"
                whileHover={{ scale: 1.05 }}
              >
                {currentAvatar.emoji}
              </motion.div>
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                {AVATARS.map((avatar) => (
                  <motion.button
                    key={avatar.id}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                      selectedAvatar === avatar.id
                        ? "bg-purple-500 text-white ring-2 ring-purple-300"
                        : "bg-white hover:bg-purple-100"
                    }`}
                    onClick={() => setSelectedAvatar(avatar.id)}
                    whileTap={{ scale: 0.85 }}
                  >
                    {avatar.emoji}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* User info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-800 mb-1">
                {loading ? "Loading..." : (user?.username || "Guest User")}
              </h1>
              <p className="text-gray-500 mb-1">
                {user?.email || ""}
              </p>
              <p className="text-gray-600 mb-4">
                Level {loading ? "—" : (dashboard?.level ?? 1)} Speaker •{" "}
                {loading ? "—" : (dashboard?.xp ?? 0)} XP
              </p>

              {user ? (
                <Button className="bg-red-500 hover:bg-red-600 text-white" onClick={logout}>
                  Logout
                </Button>
              ) : (
                <Button
                  className="bg-purple-500 hover:bg-purple-600 text-white"
                  onClick={() => router.push("/login")}
                >
                  Login
                </Button>
              )}
            </div>
          </div>
        </motion.div>

        {/* ── Stats Grid ──────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.07 }}
            >
              <StatCard {...s} />
            </motion.div>
          ))}
        </div>

        {/* ── Quiz Summary ────────────────────────────── */}
        {!loading && dashboard && (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-white rounded-2xl p-5 shadow border text-center">
              <BookOpen className="w-8 h-8 mx-auto mb-2 text-sky-500" />
              <p className="text-3xl font-bold text-gray-800">{dashboard.listeningSessions}</p>
              <p className="text-sm text-gray-500">Listening Quizzes</p>
              <p className="text-xs text-sky-600 mt-1 font-semibold">{dashboard.listeningAccuracy}% accuracy</p>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow border text-center">
              <Mic className="w-8 h-8 mx-auto mb-2 text-pink-500" />
              <p className="text-3xl font-bold text-gray-800">{dashboard.speakingSessions}</p>
              <p className="text-sm text-gray-500">Speaking Quizzes</p>
              <p className="text-xs text-pink-600 mt-1 font-semibold">{dashboard.speakingAccuracy}% accuracy</p>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow border text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <p className="text-3xl font-bold text-gray-800">{dashboard.accuracy}%</p>
              <p className="text-sm text-gray-500">Overall Accuracy</p>
              <p className="text-xs text-green-600 mt-1 font-semibold">{dashboard.totalSessions} total quizzes</p>
            </div>
          </motion.div>
        )}

        {/* ── Weak Phonemes ───────────────────────────── */}
        {!loading && dashboard?.weakPhonemes?.length > 0 && (
          <motion.div
            className="bg-white rounded-3xl p-6 shadow-md mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>🔤</span> Sounds to Practice
            </h2>
            <div className="space-y-3">
              {dashboard.weakPhonemes.slice(0, 6).map((p: any) => (
                <PhonemeBar key={p.phoneme} {...p} />
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Recommended Words ───────────────────────── */}
        {!loading && dashboard?.recommendedWords?.length > 0 && (
          <motion.div
            className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-6 shadow-md border border-purple-100 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>🎯</span> Recommended Next Practice
            </h2>
            <div className="flex flex-wrap gap-3">
              {dashboard.recommendedWords.map((w: any) => (
                <div
                  key={w.word}
                  className="flex items-center gap-2 bg-white rounded-xl px-4 py-2 shadow-sm border border-purple-100"
                >
                  <span className="text-xl">{w.hint}</span>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">{w.word}</p>
                    <p className="text-xs text-gray-400">{w.pronunciation}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Recent Quiz History ─────────────────────── */}
        {!loading && dashboard?.recentSessions?.length > 0 && (
          <motion.div
            className="bg-white rounded-3xl p-6 shadow-md mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>📋</span> Recent Sessions
            </h2>
            <div className="space-y-3">
              {dashboard.recentSessions.map((s: any) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {s.quizType === "speaking" ? "🎤" : "👂"}
                    </span>
                    <div>
                      <p className="font-semibold text-gray-700 capitalize text-sm">
                        {s.quizType} Quiz
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(s.date).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric"
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800">{s.score}/{s.total}</p>
                    <p className={`text-xs font-semibold ${
                      s.accuracy >= 80 ? "text-green-600"
                      : s.accuracy >= 50 ? "text-amber-600"
                      : "text-red-500"
                    }`}>
                      {s.accuracy}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Empty state if no data ──────────────────── */}
        {!loading && !dashboard?.totalSessions && user && (
          <motion.div
            className="bg-white rounded-3xl p-8 shadow-md text-center text-gray-500"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-4xl mb-3">📊</p>
            <p className="text-lg font-semibold text-gray-700 mb-2">No quiz data yet!</p>
            <p className="text-sm text-gray-400 mb-4">Take a quiz to see your real stats here.</p>
            <Button
              className="bg-purple-500 hover:bg-purple-600 text-white"
              onClick={() => router.push("/user/startquiz")}
            >
              Take a Quiz →
            </Button>
          </motion.div>
        )}

        {/* Guest prompt */}
        {!loading && !user && (
          <motion.div
            className="bg-white rounded-3xl p-8 shadow-md text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-4xl mb-3">🔒</p>
            <p className="text-lg font-semibold text-gray-700 mb-2">Login to see your stats</p>
            <p className="text-sm text-gray-400 mb-4">Your progress, streaks, and weak sounds are saved when you log in.</p>
            <Button
              className="bg-purple-500 hover:bg-purple-600 text-white"
              onClick={() => router.push("/login")}
            >
              Login
            </Button>
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  );
}
