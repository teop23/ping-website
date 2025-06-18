import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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

    calculateTimeLeft();
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
        transition={{ delay: 1.3, duration: 0.8 }}
        className="w-full max-w-lg mx-auto"
      >
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 border border-border/50 rounded-xl p-4 shadow-lg">
          <div className="text-center">
            <span className="text-xl font-semibold text-white">
              🚀 Launch Time!
            </span>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.3, duration: 0.8 }}
      className="w-full max-w-lg mx-auto"
    >
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 border border-border/50 rounded-xl p-4 shadow-lg">
        <div className="flex items-center justify-center gap-6">
          {/* Hours */}
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-white font-mono">
              {formatNumber(timeLeft.hours)}
            </div>
            <div className="text-xs text-white/80 font-medium mt-1">
              HOURS
            </div>
          </div>

          {/* Separator */}
          <div className="text-2xl sm:text-3xl font-bold text-white/60">
            :
          </div>

          {/* Minutes */}
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-white font-mono">
              {formatNumber(timeLeft.minutes)}
            </div>
            <div className="text-xs text-white/80 font-medium mt-1">
              MINUTES
            </div>
          </div>

          {/* Separator */}
          <div className="text-2xl sm:text-3xl font-bold text-white/60">
            :
          </div>

          {/* Seconds */}
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-white font-mono">
              {formatNumber(timeLeft.seconds)}
            </div>
            <div className="text-xs text-white/80 font-medium mt-1">
              SECONDS
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Countdown;