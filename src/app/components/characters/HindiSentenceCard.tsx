import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2, Mic, Check, PlayCircle } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { speak } from '@/app/components/shared/Speak';

type HindiSentenceCardProps = {
  sentence: string;
  pronunciation?: string;
  isCompleted?: boolean;
  onPractice?: (sentence: string) => void;
};

export default function HindiSentenceCard({
  sentence,
  pronunciation,
  isCompleted = false,
  onPractice,
}: HindiSentenceCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  
  const playSound = async () => {
    setIsPlaying(true);
    await speak(sentence);
    setTimeout(() => setIsPlaying(false), 2000);
  };

  const handlePractice = () => {
    setIsRecording(true);
    onPractice?.(sentence);
    setTimeout(() => setIsRecording(false), 3000);
  };

  return (
    <motion.div
      className={`
        relative bg-white rounded-3xl p-5 md:p-6 shadow-lg border-2
        ${isCompleted ? 'border-green-300 bg-green-50/50' : 'border-purple-100'}
        transition-all duration-300
      `}
      whileHover={{ scale: 1.01, y: -2 }}
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

      <div className="flex items-start gap-4">
        <motion.div 
          className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0 cursor-pointer shadow-md"
          onClick={playSound}
          animate={isPlaying ? { scale: [1, 1.1, 1] } : {}}
          transition={{ repeat: isPlaying ? Infinity : 0, duration: 0.5 }}
        >
          <PlayCircle className="w-6 h-6 text-white" />
        </motion.div>

        <div className="flex-1">
          <p 
            className="text-xl md:text-2xl text-gray-800 leading-relaxed cursor-pointer font-medium"
            onClick={playSound}
          >
            &quot;{sentence}&quot;
          </p>
          
          <p className="text-sm text-gray-500 mt-2 italic">
            {pronunciation}
          </p>
        </div>
      </div>

      <div className="flex gap-3 mt-5 pt-4 border-t border-gray-100">
        <Button
          variant="outline"
          onClick={playSound}
          className="rounded-xl border-2 border-sky-200 hover:bg-sky-50 flex-1"
          disabled={isPlaying}
        >
          <Volume2 className={`w-4 h-4 mr-2 ${isPlaying ? 'text-sky-500 animate-pulse' : 'text-gray-600'}`} />
          Listen
        </Button>
        
        <Button
          onClick={handlePractice}
          className="rounded-xl bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 flex-1"
          disabled={isRecording}
        >
          <Mic className={`w-4 h-4 mr-2 ${isRecording ? 'animate-pulse' : ''}`} />
          Say it!
        </Button>
      </div>

      {isRecording && (
        <motion.div 
          className="absolute inset-0 bg-purple-500/10 rounded-3xl flex items-center justify-center backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="bg-white rounded-2xl px-6 py-4 shadow-lg flex flex-col items-center gap-3">
            <div className="flex items-center gap-1">
              {[...Array(7)].map((_, i) => (
                <motion.div 
                  key={i}
                  className="w-2 bg-gradient-to-t from-pink-500 to-purple-500 rounded-full"
                  animate={{ height: [16, 32, 16] }}
                  transition={{ 
                    duration: 0.5, 
                    repeat: Infinity, 
                    delay: i * 0.1,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>
            <span className="text-sm font-medium text-gray-700">Speak the sentence...</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}