import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
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
        <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-sm border border-green-500/20 rounded-xl p-6 shadow-xl">
          <div className="flex items-center justify-center gap-3">
            <Clock className="w-6 h-6 text-green-600" />
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-600">
              Launch Time! 🚀
            </span>
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
      className="relative"
    >
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-purple-600/10 blur-2xl -z-10 scale-110" />
      
      <div className="bg-gradient-to-br from-background/90 to-background/70 backdrop-blur-sm border border-border/50 rounded-xl p-4 sm:p-6 shadow-xl">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
            Coming Soon
          </h3>
        </div>
        
        <div className="flex items-center justify-center gap-2 sm:gap-4">
          {/* Hours */}
          <div className="flex flex-col items-center">
            <motion.div
              key={timeLeft.hours}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-br from-primary to-purple-600 text-white rounded-lg p-2 sm:p-3 min-w-[3rem] sm:min-w-[4rem] text-center shadow-lg"
            >
              <span className="text-xl sm:text-2xl font-bold font-mono">
                {formatNumber(timeLeft.hours)}
              </span>
            </motion.div>
            <span className="text-xs sm:text-sm text-muted-foreground mt-1 font-medium">
              Hours
            </span>
          </div>

          {/* Separator */}
          <motion.div
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
            className="text-2xl sm:text-3xl font-bold text-primary mx-1"
          >
            :
          </motion.div>

          {/* Minutes */}
          <div className="flex flex-col items-center">
            <motion.div
              key={timeLeft.minutes}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-br from-primary to-purple-600 text-white rounded-lg p-2 sm:p-3 min-w-[3rem] sm:min-w-[4rem] text-center shadow-lg"
            >
              <span className="text-xl sm:text-2xl font-bold font-mono">
                {formatNumber(timeLeft.minutes)}
              </span>
            </motion.div>
            <span className="text-xs sm:text-sm text-muted-foreground mt-1 font-medium">
              Minutes
            </span>
          </div>

          {/* Separator */}
          <motion.div
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="text-2xl sm:text-3xl font-bold text-primary mx-1"
          >
            :
          </motion.div>

          {/* Seconds */}
          <div className="flex flex-col items-center">
            <motion.div
              key={timeLeft.seconds}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-br from-primary to-purple-600 text-white rounded-lg p-2 sm:p-3 min-w-[3rem] sm:min-w-[4rem] text-center shadow-lg"
            >
              <span className="text-xl sm:text-2xl font-bold font-mono">
                {formatNumber(timeLeft.seconds)}
              </span>
            </motion.div>
            <span className="text-xs sm:text-sm text-muted-foreground mt-1 font-medium">
              Seconds
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Countdown;