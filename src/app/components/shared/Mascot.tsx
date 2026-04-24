import React from 'react';
import { motion } from 'framer-motion';

type MascotSize = "small" | "medium" | "large" | "hero";
type MascotMood = "happy" | "excited" | "encouraging" | "thinking" | "celebrating";

type MascotProps = {
  message?: string | null;
  size?: MascotSize;
  mood?: MascotMood;
  onClick?: () => void;
};

export default function Mascot({ message, size = "medium", mood = "happy", onClick }: MascotProps) {
  const sizes: Record<MascotSize, string> = {
    small: "w-20 h-20",
    medium: "w-32 h-32",
    large: "w-48 h-48",
    hero: "w-64 h-64"
  };

  const moods: Record<MascotMood, string> = {
    happy: "😊",
    excited: "🤩",
    encouraging: "💪",
    thinking: "🤔",
    celebrating: "🎉"
  };

  return (
    <motion.div 
      className="flex flex-col items-center gap-2 cursor-pointer"
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div 
        className={`${sizes[size]} relative`}
        animate={{ 
          y: [0, -8, 0],
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {/* Robot Body */}
        <div className="relative w-full h-full">
          {/* Main body */}
          <div className="absolute inset-0 bg-gradient-to-b from-sky-300 to-sky-400 rounded-3xl shadow-lg border-4 border-sky-200">
            {/* Face area */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-3/4 h-1/2 bg-white/90 rounded-2xl flex items-center justify-center gap-2">
              {/* Eyes */}
              <motion.div 
                className="w-4 h-4 md:w-6 md:h-6 bg-gray-800 rounded-full"
                animate={{ scaleY: [1, 0.1, 1] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
              />
              <motion.div 
                className="w-4 h-4 md:w-6 md:h-6 bg-gray-800 rounded-full"
                animate={{ scaleY: [1, 0.1, 1] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
              />
            </div>
            {/* Mouth */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-8 h-4 bg-pink-300 rounded-full" />
            {/* Antenna */}
            <motion.div 
              className="absolute -top-4 left-1/2 -translate-x-1/2 w-2 h-6 bg-sky-400 rounded-full"
              animate={{ rotate: [-5, 5, -5] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-yellow-400 rounded-full animate-pulse" />
            </motion.div>
          </div>
          {/* Arms */}
          <div className="absolute top-1/2 -left-3 w-6 h-3 bg-sky-400 rounded-full" />
          <div className="absolute top-1/2 -right-3 w-6 h-3 bg-sky-400 rounded-full" />
        </div>
      </motion.div>
      
      {message && (
        <motion.div 
          className="bg-white px-4 py-2 rounded-2xl shadow-md border-2 border-sky-200 max-w-xs text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-gray-700 font-medium text-sm md:text-base">{message}</p>
        </motion.div>
      )}
    </motion.div>
  );
}