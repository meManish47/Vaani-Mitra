import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type StarRewardProps = {
  show: boolean;
  stars?: number;
  onComplete?: () => void;
};

export default function StarReward({ show, stars = 3, onComplete }: StarRewardProps) {
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    setVisible(show);
    if (show) {
      const timer = setTimeout(() => {
        setVisible(false);
        onComplete?.();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="bg-white rounded-3xl p-8 shadow-2xl flex flex-col items-center gap-6"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: "spring", damping: 15 }}
          >
            <motion.h2 
              className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              Amazing! 🎉
            </motion.h2>
            
            <div className="flex gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, rotate: -180, y: 50 }}
                  animate={{ 
                    scale: i < stars ? 1 : 0.5, 
                    rotate: 0, 
                    y: 0,
                    opacity: i < stars ? 1 : 0.3
                  }}
                  transition={{ delay: i * 0.2, type: "spring", damping: 10 }}
                  className="relative"
                >
                  <span className="text-6xl">⭐</span>
                  {i < stars && (
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center"
                      animate={{ 
                        scale: [1, 1.5, 1],
                        opacity: [1, 0, 1]
                      }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.3 }}
                    >
                      <span className="text-6xl">✨</span>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>

            <motion.p 
              className="text-xl text-gray-600 font-medium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              You earned {stars} {stars === 1 ? 'star' : 'stars'}!
            </motion.p>

            {/* Confetti particles */}
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  background: ['#FFD700', '#FF69B4', '#87CEEB', '#98D8AA', '#FFB6C1'][i % 5],
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                initial={{ scale: 0, opacity: 1 }}
                animate={{ 
                  scale: [0, 1, 0],
                  y: [0, -100],
                  x: [(Math.random() - 0.5) * 200],
                  opacity: [1, 1, 0]
                }}
                transition={{ 
                  duration: 2,
                  delay: Math.random() * 0.5,
                  repeat: Infinity,
                  repeatDelay: 1
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}