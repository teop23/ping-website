import { motion } from 'framer-motion';
import React from 'react';
import Builder from '../components/Builder';
import ContractAddress from '../components/ContractAddress';
import Countdown from '../components/Countdown';
import { SHOW_COUNTDOWN } from '../utils/constants';
import { Sparkles, Zap, Star, Heart } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="relative h-full overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Orbs */}
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-xl"
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-xl"
          animate={{
            y: [0, 15, 0],
            x: [0, -15, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div
          className="absolute bottom-40 left-1/4 w-20 h-20 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-full blur-xl"
          animate={{
            y: [0, -25, 0],
            x: [0, 20, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        <motion.div
          className="absolute top-60 left-1/3 w-28 h-28 bg-gradient-to-br from-green-400/15 to-emerald-400/15 rounded-full blur-xl"
          animate={{
            y: [0, 30, 0],
            x: [0, -25, 0],
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3
          }}
        />
        <motion.div
          className="absolute bottom-20 right-1/3 w-36 h-36 bg-gradient-to-br from-indigo-400/15 to-purple-400/15 rounded-full blur-xl"
          animate={{
            y: [0, -35, 0],
            x: [0, 15, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
        />
        <motion.div
          className="absolute top-32 right-1/4 w-22 h-22 bg-gradient-to-br from-pink-400/18 to-rose-400/18 rounded-full blur-xl"
          animate={{
            y: [0, 20, 0],
            x: [0, -10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5
          }}
        />
        <motion.div
          className="absolute bottom-60 left-16 w-26 h-26 bg-gradient-to-br from-cyan-400/16 to-teal-400/16 rounded-full blur-xl"
          animate={{
            y: [0, -18, 0],
            x: [0, 22, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 11,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2.5
          }}
        />
        <motion.div
          className="absolute top-80 right-12 w-30 h-30 bg-gradient-to-br from-violet-400/14 to-purple-400/14 rounded-full blur-xl"
          animate={{
            y: [0, 28, 0],
            x: [0, -20, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 13,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3.5
          }}
        />
        <motion.div
          className="absolute bottom-32 left-2/3 w-24 h-24 bg-gradient-to-br from-amber-400/17 to-yellow-400/17 rounded-full blur-xl"
          animate={{
            y: [0, -22, 0],
            x: [0, 18, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        />
      </div>

      {/* Main Content */}
      <motion.div
        className="relative h-full z-10 flex flex-col items-center justify-center gap-4 sm:gap-6 md:gap-8 p-2 sm:p-4 py-4 sm:py-6"
        initial={{ opacity: 0, filter: "blur(10px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-center space-y-2 sm:space-y-4 w-full max-w-sm sm:max-w-xl md:max-w-3xl px-2"
        >
          {/* Main Title with Enhanced Styling */}
          <div className="relative">
            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 leading-tight"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Create Your PING
              <br />

            </motion.h1>

            {/* Glow effect behind title */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-pink-600/20 blur-3xl -z-10 scale-110" />
          </div>

          {/* Subtitle with Animation */}
          <motion.p
            className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            Customize your unique PING character with different traits and join the{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 font-semibold">
              community
            </span>
          </motion.p>

          {/* Feature Pills */}
          <motion.div
            className="flex flex-wrap justify-center gap-2 mt-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            {[
              { icon: <Sparkles size={16} />, text: "Unique Traits" },
              { icon: <Zap size={16} />, text: "Instant Creation" },
              { icon: <Heart size={16} />, text: "Community Driven" }
            ].map((feature, index) => (
              <motion.div
                key={feature.text}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-background/80 to-background/60 backdrop-blur-sm border border-border/50 rounded-full text-xs sm:text-sm font-medium shadow-lg"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.1 + index * 0.1, duration: 0.6 }}
              >
                <span className="text-primary">{feature.icon}</span>
                {feature.text}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Contract Address Section with Enhanced Styling */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="relative"
        >
          <ContractAddress />
          {/* Subtle glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-purple-600/10 blur-2xl -z-10 scale-110" />
        </motion.div>

        {/* Countdown Section */}
        {SHOW_COUNTDOWN && <Countdown />}

        {/* Builder Section with Enhanced Container */}
        <div className="w-full max-w-[98vw] sm:max-w-[95vw] md:max-w-6xl relative">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-600/5 rounded-3xl blur-3xl -z-10" />

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            className="relative bg-gradient-to-br from-background/80 to-background/60 backdrop-blur-xl border border-border/50 rounded-2xl p-2 sm:p-4 md:p-6 shadow-2xl"
          >
            {/* Decorative corner elements */}
            <div className="absolute top-2 left-2 w-6 h-6 border-l-2 border-t-2 border-primary/30 rounded-tl-lg" />
            <div className="absolute top-2 right-2 w-6 h-6 border-r-2 border-t-2 border-primary/30 rounded-tr-lg" />
            <div className="absolute bottom-2 left-2 w-6 h-6 border-l-2 border-b-2 border-primary/30 rounded-bl-lg" />
            <div className="absolute bottom-2 right-2 w-6 h-6 border-r-2 border-b-2 border-primary/30 rounded-br-lg" />

            <Builder />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;