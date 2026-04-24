import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2, Mic, Check } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { speak } from '@/app/components/shared/Speak';

interface HindiLetterCardProps {
  character: string;
  pronunciation: string;
  isCompleted?: boolean;
  onPractice?: (character: string) => void;
  color?: 'sky' | 'purple' | 'green' | 'pink' | 'orange' | 'yellow' | 'indigo';
}

export default function HindiLetterCard({ 
  character, 
  pronunciation, 
  isCompleted, 
  onPractice,
  color = "sky"
}: HindiLetterCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const colors = {
    sky: 'from-sky-400 to-sky-500 hover:from-sky-500 hover:to-sky-600',
    purple: 'from-purple-400 to-purple-500 hover:from-purple-500 hover:to-purple-600',
    green: 'from-green-400 to-green-500 hover:from-green-500 hover:to-green-600',
    pink: 'from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600',
    orange: 'from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600',
    yellow: 'from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600',
    indigo: 'from-indigo-400 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600',
  };

  const playSound = async () => {
    setIsPlaying(true);
    await speak(character);
    setTimeout(() => setIsPlaying(false), 1000);
  };

  const handlePractice = () => {
    setIsRecording(true);
    onPractice?.(character);
    setTimeout(() => setIsRecording(false), 2000);
  };

  return (
    <motion.div
      className={`
        relative bg-white rounded-3xl p-4 shadow-lg border-2
        ${isCompleted ? 'border-green-300 bg-green-50/50' : 'border-gray-100'}
        transition-all duration-300
      `}
      whileHover={{ scale: 1.03, y: -5 }}
      whileTap={{ scale: 0.98 }}
    >
      {isCompleted && (
        <motion.div 
          className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg z-10"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring" }}
        >
          <Check className="w-5 h-5 text-white" />
        </motion.div>
      )}

      <motion.div 
        className={`
          w-20 h-20 md:w-24 md:h-24 mx-auto rounded-2xl
          bg-gradient-to-br ${colors[color]}
          flex items-center justify-center mb-3 shadow-lg cursor-pointer
        `}
        onClick={playSound}
        animate={isPlaying ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 0.3, repeat: isPlaying ? 3 : 0 }}
      >
        <span className="text-4xl md:text-5xl font-bold text-white drop-shadow-md">
          {character}
        </span>
      </motion.div>

      <p className="text-center text-gray-600 text-sm mb-3 font-medium">
        <span className="text-purple-600 font-bold">{pronunciation}</span>
      </p>

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
          className={`
            rounded-xl bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600
            ${isRecording ? 'animate-pulse' : ''}
          `}
          disabled={isRecording}
        >
          <Mic className="w-4 h-4 mr-1" />
          <span className="text-sm">Practice</span>
        </Button>
      </div>

      {isRecording && (
        <motion.div 
          className="absolute inset-0 bg-pink-500/10 rounded-3xl flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="bg-white rounded-2xl px-4 py-2 shadow-lg flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-gray-700">Listening...</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}