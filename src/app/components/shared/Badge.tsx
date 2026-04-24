import React from 'react';
import { motion } from 'framer-motion';

const BADGE_CONFIGS = {
  first_word: { emoji: '🎯', label: 'First Word', color: 'from-blue-400 to-blue-600' },
  five_streak: { emoji: '🔥', label: '5 Day Streak', color: 'from-orange-400 to-red-500' },
  ten_words: { emoji: '📚', label: '10 Words', color: 'from-green-400 to-green-600' },
  quiz_master: { emoji: '🧠', label: 'Quiz Master', color: 'from-purple-400 to-purple-600' },
  star_collector: { emoji: '⭐', label: 'Star Collector', color: 'from-yellow-400 to-orange-500' },
  perfect_score: { emoji: '💯', label: 'Perfect Score', color: 'from-pink-400 to-pink-600' },
  alphabet_hero: { emoji: '🦸', label: 'Alphabet Hero', color: 'from-indigo-400 to-indigo-600' },
  sentence_star: { emoji: '✨', label: 'Sentence Star', color: 'from-cyan-400 to-cyan-600' },
  listener: { emoji: '👂', label: 'Great Listener', color: 'from-teal-400 to-teal-600' },
  speaker: { emoji: '🗣️', label: 'Super Speaker', color: 'from-rose-400 to-rose-600' },
};

type BadgeType = keyof typeof BADGE_CONFIGS;
type BadgeSize = "small" | "medium" | "large";

type BadgeProps = {
  type: BadgeType;
  size?: BadgeSize;
  locked?: boolean;
  showLabel?: boolean;
};

export default function Badge({ type, size = "medium", locked = false, showLabel = true }: BadgeProps) {
  const config = BADGE_CONFIGS[type] || { emoji: '🏅', label: 'Badge', color: 'from-gray-400 to-gray-600' };
  
  const sizes = {
    small: "w-12 h-12 text-xl",
    medium: "w-16 h-16 text-2xl",
    large: "w-24 h-24 text-4xl"
  };

  return (
    <motion.div 
      className="flex flex-col items-center gap-2"
      whileHover={{ scale: locked ? 1 : 1.1 }}
      whileTap={{ scale: locked ? 1 : 0.95 }}
    >
      <div className={`
        ${sizes[size]} 
        rounded-full 
        flex items-center justify-center
        shadow-lg
        ${locked 
          ? 'bg-gray-300 grayscale opacity-50' 
          : `bg-gradient-to-br ${config.color}`
        }
        relative
      `}>
        <span className={locked ? 'opacity-50' : ''}>{config.emoji}</span>
        
        {!locked && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-white/50"
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.5, 0, 0.5]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
        
        {locked && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl">🔒</span>
          </div>
        )}
      </div>
      
      {showLabel && (
        <span className={`text-xs font-medium text-center ${locked ? 'text-gray-400' : 'text-gray-600'}`}>
          {config.label}
        </span>
      )}
    </motion.div>
  );
}