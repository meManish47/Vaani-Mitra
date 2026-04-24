import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2, Mic, Check } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { speak } from '@/app/components/shared/Speak';

interface HindiWordCardProps {
  word: string;
  pronunciation?: string;
  isCompleted?: boolean;
  onPractice?: (word: string) => void;
}

export default function HindiWordCard({
  word,
  pronunciation,
  isCompleted,
  onPractice,
}: HindiWordCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const playSound = async () => {
    setIsPlaying(true);
    await speak(word);
    setTimeout(() => setIsPlaying(false), 1000);
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
        ${isCompleted ? 'border-green-300 bg-green-50/50' : 'border-purple-100'}
        transition-all duration-300 overflow-hidden
      `}
      whileHover={{ scale: 1.02, y: -3 }}
      whileTap={{ scale: 0.98 }}
    >
      {isCompleted && (
        <motion.div 
          className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg z-10"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          <Check className="w-5 h-5 text-white" />
        </motion.div>
      )}

      <div 
        className="w-full py-6 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl mb-3 flex items-center justify-center cursor-pointer"
        onClick={playSound}
      >
        <motion.span 
          className="text-4xl md:text-5xl font-bold text-indigo-700"
          animate={isPlaying ? { scale: [1, 1.1, 1] } : {}}
        >
          {word}
        </motion.span>
      </div>

      <p className="text-center text-gray-500 text-sm mb-3 font-medium">
        /{pronunciation}/
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
          className="rounded-xl bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 flex-1"
          disabled={isRecording}
        >
          <Mic className={`w-4 h-4 mr-1 ${isRecording ? 'animate-pulse' : ''}`} />
          Say it!
        </Button>
      </div>

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