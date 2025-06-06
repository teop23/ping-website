import React from 'react';
import { motion } from 'framer-motion';
import Builder from './Builder';
import TokenInfo from '../components/TokenInfo';

const Home: React.FC = () => {
  return (
    <motion.div
      className="min-h-full flex flex-col items-center justify-center gap-12 py-12 px-6"
      initial={{ opacity: 0, filter: "blur(10px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.7 }}
        className="text-center space-y-4 max-w-2xl"
      >
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
          Create Your PING Character
        </h1>
        <p className="text-lg text-muted-foreground">
          Customize your unique PING character with different traits and join the vibrant Solana memetoken community.
        </p>
      </motion.div>
      
      <div className="w-full max-w-6xl">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
        >
          <Builder />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Home;