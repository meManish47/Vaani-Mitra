import React from 'react';
import { motion } from 'framer-motion';

type ProgressColor = "purple" | "green" | "blue" | "pink" | "yellow";

type ProgressBarProps = {
  current: number;
  total: number;
  label?: string;
  color?: ProgressColor;
};

export default function ProgressBar({ current, total, label, color = "purple" }: ProgressBarProps) {
  const percentage = total > 0 ? (current / total) * 100 : 0;
  
  const colors: Record<ProgressColor, string> = {
    purple: "from-purple-400 to-purple-600",
    green: "from-green-400 to-green-600",
    blue: "from-sky-400 to-sky-600",
    pink: "from-pink-400 to-pink-600",
    yellow: "from-yellow-400 to-orange-500"
  };

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600">{label}</span>
          <span className="text-sm font-bold text-gray-700">{current}/{total}</span>
        </div>
      )}
      <div className="h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner">
        <motion.div
          className={`h-full bg-gradient-to-r ${colors[color]} rounded-full relative`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent" />
          
          {/* Animated sparkle */}
          {percentage > 10 && (
            <motion.div
              className="absolute right-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full"
              animate={{ 
                opacity: [0.5, 1, 0.5],
                scale: [0.8, 1.2, 0.8]
              }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}