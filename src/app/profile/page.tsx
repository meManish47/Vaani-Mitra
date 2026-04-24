"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, Zap, Trophy, Target, BookOpen } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import api from "@/lib/apiClient";
import Image from "next/image";
import { useRouter } from "next/navigation";

const AVATARS = [
  { id: "bunny", emoji: "🐰", name: "Bunny" },
  { id: "bear", emoji: "🐻", name: "Bear" },
  { id: "cat", emoji: "🐱", name: "Kitty" },
  { id: "dog", emoji: "🐶", name: "Puppy" },
  { id: "unicorn", emoji: "🦄", name: "Unicorn" },
  { id: "panda", emoji: "🐼", name: "Panda" },
  { id: "lion", emoji: "🦁", name: "Lion" },
  { id: "owl", emoji: "🦉", name: "Owl" },
];

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState("bunny");

  const stats = [
    {
      icon: Star,
      label: "Total Stars",
      value: 5,
      color: "text-yellow-500",
      bg: "bg-yellow-50",
    },
    {
      icon: Zap,
      label: "Day Streak",
      value: 1,
      color: "text-orange-500",
      bg: "bg-orange-50",
    },
    {
      icon: Trophy,
      label: "Level",
      value: 1,
      color: "text-purple-500",
      bg: "bg-purple-50",
    },
    {
      icon: Target,
      label: "XP Points",
      value: 100,
      color: "text-green-500",
      bg: "bg-green-50",
    },
  ];

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await api.get("/api/users/current-user");
        setUser(res.data.user);
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  const logout = async () => {
    try {
      await api.get("/api/users/logout");
      router.push("/");
    } catch (e) {
      console.error(e);
    }
  };

  const currentAvatar =
    AVATARS.find((a) => a.id === selectedAvatar) || AVATARS[0];

  return (
    <div>
      

      <div className="max-w-4xl mx-auto pt-10 pb-20 px-4">
        {/* Profile Header */}
        <motion.div
          className="bg-gradient-to-br from-purple-100 via-pink-100 to-sky-100 rounded-3xl p-6 md:p-8 mb-8 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar */}
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
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-xl 
                      ${
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

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {loading
                  ? "Loading..."
                  : user?.username || "Guest User"}
              </h1>
              <p className="text-gray-600 mb-4">
                Level {stats[2].value} Speaker • {stats[3].value} XP
              </p>

              {user ? (
                <Button
                  className="bg-red-500 hover:bg-red-600 text-white"
                  onClick={logout}
                >
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

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              className={`${s.bg} rounded-2xl p-4 text-center shadow border`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <s.icon className={`w-8 h-8 mx-auto mb-2 ${s.color}`} />
              <p className="text-2xl font-bold text-gray-800">{s.value}</p>
              <p className="text-sm text-gray-600">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Placeholder for future progress */}
        <motion.div
          className="bg-white rounded-3xl p-6 shadow-md text-center text-gray-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          🚀 More profile features coming soon!
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
