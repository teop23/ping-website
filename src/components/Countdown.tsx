import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Zap, Star } from 'lucide-react';
import { COUNTDOWN_TARGET } from '../utils/constants';

interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
}

const Countdown: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = COUNTDOWN_TARGET - now;

      if (difference > 0) {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ hours, minutes, seconds });
        setIsExpired(false);
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        setIsExpired(true);
      }
    };

    // Calculate immediately
    calculateTimeLeft();

    // Update every second
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number): string => {
    return num.toString().padStart(2, '0');
  };

  if (isExpired) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative"
      >
        {/* Multi-layer glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-400/30 via-emerald-400/30 to-teal-400/30 blur-3xl -z-10 scale-125" />
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 blur-xl -z-10 scale-110" />
        
        <div className="relative bg-gradient-to-br from-green-500/10 via-emerald-500/10 to-teal-500/10 backdrop-blur-xl border-2 border-green-400/30 rounded-2xl p-6 shadow-2xl overflow-hidden">
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-green-400 to-emerald-400 animate-pulse" />
          </div>
          
          <div className="relative flex items-center justify-center gap-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Zap className="w-8 h-8 text-green-400" />
            </motion.div>
            <span className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400">
              Launch Time! 🚀
            </span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <Star className="w-6 h-6 text-emerald-400" />
            </motion.div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.0, duration: 0.8 }}
      className="relative w-full max-w-lg mx-auto"
    >
      {/* Multi-layer background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-3xl -z-10 scale-125" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-purple-600/10 blur-xl -z-10 scale-110" />
      
      <div className="relative bg-gradient-to-br from-background/90 via-background/80 to-background/70 backdrop-blur-xl border-2 border-primary/20 rounded-2xl p-4 sm:p-6 shadow-2xl overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-5">
          <motion.div 
            className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400"
            animate={{ 
              background: [
                "linear-gradient(45deg, #6366f1, #8b5cf6, #ec4899)",
                "linear-gradient(45deg, #8b5cf6, #ec4899, #6366f1)",
                "linear-gradient(45deg, #ec4899, #6366f1, #8b5cf6)"
              ]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        
        {/* Header */}
        <div className="relative flex items-center justify-center gap-3 mb-6">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <Clock className="w-6 h-6 text-primary" />
          </motion.div>
          <h3 className="text-lg sm:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
            Launch Countdown
          </h3>
          <motion.div
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Star className="w-5 h-5 text-purple-500" />
          </motion.div>
        </div>
        
        {/* Countdown Display */}
        <div className="relative flex items-center justify-center gap-2 sm:gap-4">
          {/* Hours */}
          <div className="flex flex-col items-center">
            <motion.div
              key={timeLeft.hours}
              initial={{ scale: 1.3, opacity: 0, rotateY: 180 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              transition={{ duration: 0.5, ease: "backOut" }}
              className="relative group"
            >
              {/* Glow effect for each number */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
              
              <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white rounded-xl p-3 sm:p-4 min-w-[3.5rem] sm:min-w-[5rem] text-center shadow-2xl border border-white/20">
                {/* Inner glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl" />
                
                <span className="relative text-xl sm:text-3xl font-bold font-mono tracking-wider">
                  {formatNumber(timeLeft.hours)}
                </span>
              </div>
            </motion.div>
            <span className="text-xs sm:text-sm text-muted-foreground mt-2 font-semibold tracking-wide">
              HOURS
            </span>
          </div>

          {/* Animated Separator */}
          <motion.div
            animate={{ 
              opacity: [1, 0.3, 1],
              scale: [1, 1.2, 1],
              textShadow: [
                "0 0 10px rgba(99, 102, 241, 0.5)",
                "0 0 20px rgba(139, 92, 246, 0.8)",
                "0 0 10px rgba(99, 102, 241, 0.5)"
              ]
            }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-indigo-400 to-purple-600 mx-1"
          >
            :
          </motion.div>

          {/* Minutes */}
          <div className="flex flex-col items-center">
            <motion.div
              key={timeLeft.minutes}
              initial={{ scale: 1.3, opacity: 0, rotateY: 180 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              transition={{ duration: 0.5, ease: "backOut", delay: 0.1 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
              
              <div className="relative bg-gradient-to-br from-purple-600 via-pink-600 to-rose-600 text-white rounded-xl p-3 sm:p-4 min-w-[3.5rem] sm:min-w-[5rem] text-center shadow-2xl border border-white/20">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl" />
                
                <span className="relative text-xl sm:text-3xl font-bold font-mono tracking-wider">
                  {formatNumber(timeLeft.minutes)}
                </span>
              </div>
            </motion.div>
            <span className="text-xs sm:text-sm text-muted-foreground mt-2 font-semibold tracking-wide">
              MINUTES
            </span>
          </div>

          {/* Animated Separator */}
          <motion.div
            animate={{ 
              opacity: [1, 0.3, 1],
              scale: [1, 1.2, 1],
              textShadow: [
                "0 0 10px rgba(139, 92, 246, 0.5)",
                "0 0 20px rgba(236, 72, 153, 0.8)",
                "0 0 10px rgba(139, 92, 246, 0.5)"
              ]
            }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.75 }}
            className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-purple-400 to-pink-600 mx-1"
          >
            :
          </motion.div>

          {/* Seconds */}
          <div className="flex flex-col items-center">
            <motion.div
              key={timeLeft.seconds}
              initial={{ scale: 1.3, opacity: 0, rotateY: 180 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              transition={{ duration: 0.5, ease: "backOut", delay: 0.2 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
              
              <div className="relative bg-gradient-to-br from-pink-600 via-rose-600 to-orange-600 text-white rounded-xl p-3 sm:p-4 min-w-[3.5rem] sm:min-w-[5rem] text-center shadow-2xl border border-white/20">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl" />
                
                <span className="relative text-xl sm:text-3xl font-bold font-mono tracking-wider">
                  {formatNumber(timeLeft.seconds)}
                </span>
              </div>
            </motion.div>
            <span className="text-xs sm:text-sm text-muted-foreground mt-2 font-semibold tracking-wide">
              SECONDS
            </span>
          </div>
        </div>

        {/* Bottom accent line */}
        <motion.div 
          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
          animate={{ 
            background: [
              "linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899)",
              "linear-gradient(90deg, #8b5cf6, #ec4899, #f97316)",
              "linear-gradient(90deg, #ec4899, #f97316, #6366f1)",
              "linear-gradient(90deg, #f97316, #6366f1, #8b5cf6)"
            ]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </motion.div>
  );
};

export default Countdown;