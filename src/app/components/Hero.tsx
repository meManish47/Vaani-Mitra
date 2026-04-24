import React, { useState, useEffect } from "react";
// import { Link } from 'react-router-dom';
// import { createPageUrl } from '@/utils';
// import { base44 } from '@/api/base44Client';
// import { useQuery } from '@tanstack/react-query';
import { motion } from "framer-motion";
import { BookOpen, Brain, TrendingUp, Star, Zap, Trophy } from "lucide-react";
import Mascot from "@/app/components/shared/Mascot";
import ProgressBar from "@/app/components/shared/ProgressBar";
import Link from "next/link";

export default function Home() {
  const [user, setUser] = useState(null);

  // useEffect(() => {
  //   const loadUser = async () => {
  //     try {
  //       const userData = await base44.auth.me();
  //       setUser(userData);
  //     } catch (e) {
  //       // User not logged in
  //     }
  //   };
  //   loadUser();
  // }, []);

  // const { data: progress } = useQuery({
  //   queryKey: ['userProgress', user?.id],
  //   queryFn: async () => {
  //     if (!user) return null;
  //     const progressList = await base44.entities.UserProgress.filter({ user_id: user.id });
  //     return progressList[0] || null;
  //   },
  //   enabled: !!user,
  // });
  const progress = {
    total_stars: 5,
    current_streak: 3,
    level: 1,
    completed_letters: Array(20).fill(0),
    completed_words: Array(10).fill(0),
    completed_sentences: Array(5).fill(0),
  };

  const cards = [
    {
      title: "Start Learning",
      description: "Practice Hindi letters, words & sentences",
      icon: BookOpen,
      color: "from-green-400 to-emerald-500",
      bgColor: "bg-green-50",
      emoji: "📚",
      page: "Characters",
    },
    {
      title: "Take a Quiz",
      description: "Test your speaking skills",
      icon: Brain,
      color: "from-purple-400 to-purple-600",
      bgColor: "bg-purple-50",
      emoji: "🧠",
      page: "Quiz",
    },
    {
      title: "Your Progress",
      description: "See how far you've come",
      icon: TrendingUp,
      color: "from-orange-400 to-orange-500",
      bgColor: "bg-orange-50",
      emoji: "📊",
      page: "Profile",
    },
  ];

  const greetings = [
    "Hi there! Ready to practice?",
    "Welcome back, superstar!",
    "Let's have fun learning!",
    "You're doing amazing!",
    "Let's practice speaking together!",
  ];

  const randomGreeting =
    greetings[Math.floor(Math.random() * greetings.length)];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-sky-100 via-purple-100 to-pink-100 rounded-3xl p-6 md:p-10 mb-8 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-200 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-200 rounded-full blur-3xl opacity-30" />

        <div className="relative flex flex-col md:flex-row items-center gap-6 md:gap-10">
          <Mascot
            size="large"
            message={
              user
                ? `Hi ${user || "Friend"}! ${randomGreeting}`
                : randomGreeting
            }
            mood="happy"
            onClick={() => null}
          />

          <div className="flex-1 text-center md:text-left">
            <motion.h1
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Welcome to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-purple-500">
                VaaniMitra
              </span>
              !
            </motion.h1>
            <motion.p
              className="text-lg md:text-xl text-gray-600"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Your friendly AI helper for learning Hindi speech! 🎤
            </motion.p>

            {/* Quick Stats */}
            {progress && (
              <motion.div
                className="mt-6 flex flex-wrap justify-center md:justify-start gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-full shadow-md">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span className="font-bold text-gray-700">
                    {progress.total_stars || 0} Stars
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-full shadow-md">
                  <Zap className="w-5 h-5 text-orange-500" />
                  <span className="font-bold text-gray-700">
                    {progress.current_streak || 0} Day Streak
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-full shadow-md">
                  <Trophy className="w-5 h-5 text-purple-500" />
                  <span className="font-bold text-gray-700">
                    Level {progress.level || 1}
                  </span>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {cards.map((card, index) => (
          <Link key={card.title} href={`/${card.page.toLowerCase()}`} >
            <motion.div
              className={`${card.bgColor} rounded-3xl p-6 cursor-pointer border-2 border-transparent hover:border-white transition-all h-full`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              <div
                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-4 shadow-lg`}
              >
                <span className="text-3xl">{card.emoji}</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {card.title}
              </h3>
              <p className="text-gray-600">{card.description}</p>

              <motion.div
                className="mt-4 flex items-center gap-2 text-gray-500"
                whileHover={{ x: 5 }}
              >
                <span className="font-medium">Let&apos;s go</span>
                <span>→</span>
              </motion.div>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Progress Overview */}
      {progress && (
        <motion.div
          className="bg-white rounded-3xl p-6 md:p-8 shadow-lg border border-purple-100"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <span className="text-3xl">📈</span>
            Your Learning Journey
          </h2>

          <div className="space-y-6">
            <ProgressBar
              current={progress.completed_letters?.length || 0}
              total={60}
              label="Letters Mastered"
              color="blue"
            />
            <ProgressBar
              current={progress.completed_words?.length || 0}
              total={74}
              label="Words Learned"
              color="green"
            />
            <ProgressBar
              current={progress.completed_sentences?.length || 0}
              total={40}
              label="Sentences Practiced"
              color="purple"
            />
          </div>
        </motion.div>
      )}

      {/* Fun Tips */}
      <motion.div
        className="mt-8 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-3xl p-6 md:p-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-start gap-4">
          <div className="text-4xl animate-wiggle">💡</div>
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Tip of the Day!
            </h3>
            <p className="text-gray-600">
              Speak slowly and clearly! It&apos;s better to say words correctly than
              quickly. Take your time and practice makes perfect! 🌟
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
