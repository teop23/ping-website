import React from 'react';
import { motion } from 'framer-motion';
import { Palette, Users, Coins } from 'lucide-react';
import TokenInfo from '../components/TokenInfo';
import Builder from './Builder';

const Home: React.FC = () => {
  return (
    <>
      {/* Hero Section with Builder */}
      <motion.section 
        className="py-12 px-4 relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto max-w-6xl">
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
      
      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Ping?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Palette size={24} className="text-purple-500" />}
              title="Customizable Characters"
              description="Create your unique Ping by mixing and matching different traits, accessories, and styles."
            />
            
            <FeatureCard 
              icon={<Users size={24} className="text-indigo-500" />}
              title="Vibrant Community"
              description="Join thousands of Ping enthusiasts sharing their creations and trading the token."
            />
            
            <FeatureCard 
              icon={<Coins size={24} className="text-blue-500" />}
              title="Solana Powered"
              description="Built on Solana for lightning-fast transactions with minimal fees."
            />
          </div>
        </div>
      </section>
      
      {/* Token Info Section */}
      <section className="py-16" id="token">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Token Information</h2>
          <div className="max-w-3xl mx-auto">
            <TokenInfo />
          </div>
        </div>
      </section>
    </>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <motion.div
      className="bg-white p-8 rounded-xl shadow-md"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center justify-center w-12 h-12 bg-indigo-50 rounded-full mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
};

export default Home;