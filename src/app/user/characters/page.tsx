"use client";
import React, { useState, useEffect } from "react";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import HindiLetterCard from "@/app/components/characters/HindiLetterCard";
import HindiWordCard from "@/app/components/characters/HindiWordCard";
import HindiSentenceCard from "@/app/components/characters/HindiSentenceCard";
import Mascot from "@/app/components/shared/Mascot";
import {
  lettersData,
  wordsData,
  sentencesData,
} from "@/app/components/shared/hindiData";
import { Button } from "@/app/components/ui/button";

// Local progress types
type Progress = {
  completed_letters: string[];
  completed_words: string[];
  completed_sentences: string[];
  total_stars: number;
  xp_points: number;
};

const STORAGE_KEY = "user_progress_local_v1";

// Simple local StarReward component (replaces external dependency)
function StarReward({
  show,
  stars,
  onComplete,
}: {
  show: boolean;
  stars: number;
  onComplete: () => void;
}) {
  useEffect(() => {
    if (!show) return;
    const t = setTimeout(() => onComplete(), 1400);
    return () => clearTimeout(t);
  }, [show, onComplete]);

  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="pointer-events-auto bg-white/95 p-5 rounded-xl shadow-lg flex items-center gap-4">
        <div className="text-3xl">⭐</div>
        <div>
          <div className="font-bold">
            {stars} star{stars > 1 ? "s" : ""} earned!
          </div>
          <div className="text-sm text-gray-600">Progress saved locally</div>
        </div>
      </div>
    </div>
  );
}

function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) throw new Error("no");
    return JSON.parse(raw) as Progress;
  } catch {
    const init: Progress = {
      completed_letters: [],
      completed_words: [],
      completed_sentences: [],
      total_stars: 0,
      xp_points: 0,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(init));
    } catch {}
    return init;
  }
}

function saveProgress(p: Progress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch {}
}

export default function Characters() {
  // UI state
  const [activeTab, setActiveTab] = useState<
    "vowels" | "consonants" | "words" | "sentences"
  >("vowels");
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);
  const [showReward, setShowReward] = useState(false);
  const [starsEarned, setStarsEarned] = useState(0);

  // progress (client-only)
  const [progress, setProgress] = useState<Progress | null>(null);

  useEffect(() => {
    // load progress on client
    if (typeof window !== "undefined") {
      setProgress(loadProgress());
    }
  }, []);

  // helper to update progress and persist
  const updateProgress = (
    type: "letter" | "word" | "sentence",
    item: string
  ) => {
    if (!progress) return;
    const fieldMap = {
      letter: "completed_letters",
      word: "completed_words",
      sentence: "completed_sentences",
    } as const;
    const field = fieldMap[type] as keyof Progress;
    const current = new Set(progress[field] as string[]);
    if (current.has(item)) return;

    const stars = type === "sentence" ? 3 : type === "word" ? 2 : 1;
    const next: Progress = {
      ...progress,
      [field]: [...(progress[field] as string[]), item],
      total_stars: (progress.total_stars || 0) + stars,
      xp_points: (progress.xp_points || 0) + stars * 10,
    };
    setProgress(next);
    saveProgress(next);
    setStarsEarned(stars);
    setShowReward(true);
  };

  const handlePractice = (
    type: "letter" | "word" | "sentence",
    item: string
  ) => {
    updateProgress(type, item);
  };

  const letterColors: Array<
    "sky" | "purple" | "green" | "pink" | "orange" | "yellow" | "indigo"
  > = [
    "sky",
    "purple",
    "green",
    "pink",
    "orange",
    "yellow",
    "indigo",
  ];

  // If no progress yet, show loading small placeholder
  if (!progress) {
    return <div className="p-6">Loading...</div>;
  }

  // Render lesson sentences if selected
  if (selectedLesson !== null) {
    const lesson = sentencesData.find(
      (l: any) => l.lessonNumber === selectedLesson
    );
    return (
      <div className="max-w-4xl mx-auto p-4">
        <Button
          variant="ghost"
          onClick={() => setSelectedLesson(null)}
          className="mb-4"
        >
          <ChevronLeft className="w-4 h-4 mr-2" /> Back
        </Button>

        <div
          className={`rounded-3xl p-6 mb-6 text-white bg-gradient-to-r ${
            lesson?.color || "from-purple-400 to-pink-400"
          }`}
        >
          <div className="flex items-center gap-4">
            <span className="text-5xl">{lesson?.emoji}</span>
            <div>
              <h2 className="text-2xl font-bold">{lesson?.title}</h2>
              <p className="opacity-80">{lesson?.titleEn}</p>
            </div>
          </div>
        </div>

        <motion.div
          className="grid grid-cols-1 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {(lesson?.sentences || []).map((item: any, index: number) => (
            <HindiSentenceCard
              key={index}
              sentence={item.sentence}
              pronunciation={item.pronunciation}
              isCompleted={progress.completed_sentences.includes(item.sentence)}
              onPractice={() => handlePractice("sentence", item.sentence)}
            />
          ))}
        </motion.div>

        <StarReward
          show={showReward}
          stars={starsEarned}
          onComplete={() => setShowReward(false)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <StarReward
        show={showReward}
        stars={starsEarned}
        onComplete={() => setShowReward(false)}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
        <Mascot
          size="medium"
          message={
            {
              vowels: "Learn vowels! Tap each letter 🔤",
              consonants: "Practice consonants! 📚",
              words: "Practice speaking words! 📝",
              sentences: "Choose a lesson! 💬",
            }[activeTab]
          }
          mood="encouraging"
        />
        <div className="text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Learn Hindi
          </h1>
          <p className="text-gray-600">
            Practice letters, words and sentences!
          </p>
        </div>
        <div className="ml-auto text-sm text-gray-600">
          Stars: <span className="font-semibold">{progress.total_stars}</span> •
          XP: <span className="font-semibold">{progress.xp_points}</span>
        </div>
      </div>

      {/* Simple Tabs (local implementation) */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab("vowels")}
          className={`px-4 py-2 rounded ${
            activeTab === "vowels"
              ? "bg-orange-400 text-white"
              : "bg-white border"
          }`}
        >
          Vowels
        </button>
        <button
          onClick={() => setActiveTab("consonants")}
          className={`px-4 py-2 rounded ${
            activeTab === "consonants"
              ? "bg-blue-400 text-white"
              : "bg-white border"
          }`}
        >
          Consonants
        </button>
        <button
          onClick={() => setActiveTab("words")}
          className={`px-4 py-2 rounded ${
            activeTab === "words"
              ? "bg-green-400 text-white"
              : "bg-white border"
          }`}
        >
          Words
        </button>
        <button
          onClick={() => setActiveTab("sentences")}
          className={`px-4 py-2 rounded ${
            activeTab === "sentences"
              ? "bg-purple-400 text-white"
              : "bg-white border"
          }`}
        >
          Sentences
        </button>
      </div>

      {/* Tab content */}
      {activeTab === "vowels" && (
        <>
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {lettersData.vowels.map((item: any, index: number) => (
              <HindiLetterCard
                key={item.character}
                character={item.character}
                pronunciation={item.pronunciation}
                isCompleted={progress.completed_letters.includes(
                  item.character
                )}
                onPractice={() => handlePractice("letter", item.character)}
                color={letterColors[index % letterColors.length]}
              />
            ))}
          </motion.div>

          <div className="mt-8">
            <h3 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2">
              <span className="text-2xl">◌ा</span> Matras (Vowel Signs)
            </h3>
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {lettersData.dependingVowels.map((item: any, index: number) => (
                <HindiLetterCard
                  key={item.character}
                  character={item.character}
                  pronunciation={item.pronunciation}
                  isCompleted={progress.completed_letters.includes(
                    item.character
                  )}
                  onPractice={() => handlePractice("letter", item.character)}
                  color={letterColors[(index + 3) % letterColors.length]}
                />
              ))}
            </motion.div>
          </div>
        </>
      )}

      {activeTab === "consonants" && (
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {lettersData.consonants.map((item: any, index: number) => (
            <HindiLetterCard
              key={item.character}
              character={item.character}
              pronunciation={item.pronunciation}
              isCompleted={progress.completed_letters.includes(item.character)}
              onPractice={() => handlePractice("letter", item.character)}
              color={letterColors[index % letterColors.length]}
            />
          ))}
        </motion.div>
      )}

      {activeTab === "words" && (
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {wordsData.common.map((item: any) => (
            <HindiWordCard
              key={item.word}
              word={item.word}
              pronunciation={item.pronunciation}
              isCompleted={progress.completed_words.includes(item.word)}
              onPractice={() => handlePractice("word", item.word)}
            />
          ))}
        </motion.div>
      )}

      {activeTab === "sentences" && (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {sentencesData.map((lesson: any) => (
            <motion.div
              key={lesson.lessonNumber}
              onClick={() => setSelectedLesson(lesson.lessonNumber)}
              className={`bg-gradient-to-r ${lesson.color} rounded-3xl p-6 cursor-pointer hover:shadow-xl transition-all duration-300`}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-4 text-white">
                <span className="text-5xl">{lesson.emoji}</span>
                <div className="flex-1">
                  <div className="text-sm opacity-80 mb-1">
                    Lesson {lesson.lessonNumber}
                  </div>
                  <h3 className="text-xl font-bold">{lesson.titleEn}</h3>
                  <p className="text-sm opacity-80">{lesson.title}</p>
                  <p className="text-sm mt-2 opacity-70">
                    {lesson.sentences.length} sentences
                  </p>
                </div>
                <ChevronRight className="w-6 h-6 opacity-70" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
