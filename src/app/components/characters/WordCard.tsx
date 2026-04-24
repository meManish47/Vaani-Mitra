import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2, Mic, Check, Image } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

type Difficulty = 'easy' | 'medium' | 'hard';

interface WordCardProps {
  word: string;
  imageUrl?: string;
  phonetic?: string;
  isCompleted?: boolean;
  onPractice?: (word: string) => void;
  difficulty?: Difficulty;
}

export default function WordCard({ 
  word, 
  imageUrl,
  phonetic,
  isCompleted, 
  onPractice,
  difficulty = "easy"
}: WordCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const difficultyColors = {
    easy: 'border-green-200 bg-green-50/30',
    medium: 'border-yellow-200 bg-yellow-50/30',
    hard: 'border-orange-200 bg-orange-50/30'
  };

  const difficultyBadges = {
    easy: { bg: 'bg-green-100 text-green-700', label: 'Easy' },
    medium: { bg: 'bg-yellow-100 text-yellow-700', label: 'Medium' },
    hard: { bg: 'bg-orange-100 text-orange-700', label: 'Challenge!' }
  };

  const playSound = () => {
    setIsPlaying(true);
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.rate = 0.7;
    utterance.onend = () => setIsPlaying(false);
    speechSynthesis.speak(utterance);
  };

  const handlePractice = () => {
    setIsRecording(true);
    onPractice?.(word);
    setTimeout(() => setIsRecording(false), 2000);
  };

  return (
    <motion.div
      className={`
        relative bg-white rounded-3xl p-4 shadow-lg border-2
        ${isCompleted ? 'border-green-300 bg-green-50/50' : difficultyColors[difficulty]}
        transition-all duration-300 overflow-hidden
      `}
      whileHover={{ scale: 1.02, y: -3 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Completed Badge */}
      {isCompleted && (
        <motion.div 
          className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg z-10"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          <Check className="w-5 h-5 text-white" />
        </motion.div>
      )}

      {/* Difficulty Badge */}
      <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-bold ${difficultyBadges[difficulty].bg}`}>
        {difficultyBadges[difficulty].label}
      </div>

      {/* Image */}
      <div 
        className="w-full h-28 md:h-32 bg-gradient-to-br from-sky-100 to-purple-100 rounded-2xl mb-3 flex items-center justify-center cursor-pointer overflow-hidden"
        onClick={playSound}
      >
        {imageUrl ? (
          <img src={imageUrl} alt={word} className="w-full h-full object-cover rounded-2xl" />
        ) : (
          <span className="text-5xl">{getWordEmoji(word)}</span>
        )}
      </div>

      {/* Word */}
      <motion.h3 
        className="text-xl md:text-2xl font-bold text-center text-gray-800 mb-1 cursor-pointer"
        onClick={playSound}
        animate={isPlaying ? { scale: [1, 1.05, 1] } : {}}
      >
        {word}
      </motion.h3>

      {/* Phonetic */}
      {phonetic && (
        <p className="text-center text-gray-500 text-sm mb-3">
          /{phonetic}/
        </p>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 justify-center">
        <Button
          variant="outline"
          size="sm"
          onClick={playSound}
          className="rounded-xl border-2 border-sky-200 hover:bg-sky-50"
          disabled={isPlaying}
        >
          <Volume2 className={`w-4 h-4 ${isPlaying ? 'text-sky-500 animate-pulse' : 'text-gray-600'}`} />
        </Button>
        
        <Button
          size="sm"
          onClick={handlePractice}
          className="rounded-xl bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 flex-1"
          disabled={isRecording}
        >
          <Mic className={`w-4 h-4 mr-1 ${isRecording ? 'animate-pulse' : ''}`} />
          Say it!
        </Button>
      </div>

      {/* Recording Overlay */}
      {isRecording && (
        <motion.div 
          className="absolute inset-0 bg-pink-500/10 rounded-3xl flex items-center justify-center backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="bg-white rounded-2xl px-4 py-3 shadow-lg flex flex-col items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="w-2 h-4 bg-pink-500 rounded-full animate-pulse" />
              <div className="w-2 h-6 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }} />
              <div className="w-2 h-5 bg-pink-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
              <div className="w-2 h-7 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
              <div className="w-2 h-4 bg-pink-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
            </div>
            <span className="text-sm font-medium text-gray-700">Listening...</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

function getWordEmoji(word:string) {
  const emojiMap: Record<string, string> = {
    'apple': '🍎',
    'ball': '⚽',
    'cat': '🐱',
    'dog': '🐕',
    'elephant': '🐘',
    'fish': '🐟',
    'grape': '🍇',
    'house': '🏠',
    'ice cream': '🍦',
    'jump': '🦘',
    'kite': '🪁',
    'lion': '🦁',
    'moon': '🌙',
    'nest': '🪺',
    'orange': '🍊',
    'pizza': '🍕',
    'queen': '👑',
    'rabbit': '🐰',
    'sun': '☀️',
    'tree': '🌳',
    'umbrella': '☂️',
    'violin': '🎻',
    'water': '💧',
    'xylophone': '🎹',
    'yellow': '💛',
    'zebra': '🦓',
    'star': '⭐',
    'rainbow': '🌈',
    'butterfly': '🦋',
    'flower': '🌸'
  };
  return emojiMap[word.toLowerCase()] || '📝';
}