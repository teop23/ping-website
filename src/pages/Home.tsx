import React from 'react';
import { motion } from 'framer-motion';
import { Palette, Users, Coins } from 'lucide-react';
import TokenInfo from '../components/TokenInfo';
import Builder from './Builder';

const Home: React.FC = () => {
  return (
    <>
      <motion.section 
        className="h-[calc(100vh-64px)] px-4 relative overflow-hidden flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto max-w-6xl flex-1 flex flex-col">
          <div className="text-center mb-8">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Ping Character
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Mix and match traits to create your own custom Ping. 
              Join the community and become part of the next big Solana memetoken!
            </motion.p>
          </div>

          <Builder />
        </div>
      </motion.section>
    </>
  );
};

export default Home;