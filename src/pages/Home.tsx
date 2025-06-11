import { motion } from 'framer-motion';
import React from 'react';
import Builder from './Builder';
import ContractAddress from '../components/ContractAddress';

const Home: React.FC = () => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center gap-6 sm:gap-8 md:gap-12 p-4 pb-24 sm:pb-12 sm:py-8 md:py-12 sm:px-6"
      initial={{ opacity: 0, filter: "blur(10px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.7 }}
        className="text-center space-y-3 sm:space-y-4 w-full max-w-sm sm:max-w-xl md:max-w-2xl px-2 mt-4 sm:mt-0"
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
          Create Your PING Character
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground">
          Customize your unique PING character with different traits and join the community.
        </p>
      </motion.div>
      
      {/* Contract Address Section */}
      <ContractAddress />
      
      <div className="w-full max-w-[95vw] sm:max-w-[85vw] md:max-w-6xl">
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