import React from 'react';
import { motion } from 'framer-motion';
import Builder from './Builder';

const Home: React.FC = () => {
  return (
    <motion.div 
      className="h-[calc(100vh-64px)] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Builder />
    </motion.div>
  );
};

export default Home;